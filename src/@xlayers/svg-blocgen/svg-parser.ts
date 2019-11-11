import { LayerService, ShapeService, StyleService, SymbolService } from '@xlayers/sketch-lib';

import { SvgBlocGenOptions } from './svg-blocgen';
import { SvgContextService } from './svg-context';

export class SvgParserService {
  private shape: ShapeService = new ShapeService();
  private layer: LayerService = new LayerService();
  private style: StyleService = new StyleService();
  private symbol: SymbolService = new SymbolService();
  private svgContext: SvgContextService = new SvgContextService();

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options: SvgBlocGenOptions
  ) {
    this.visit(current, data, options);
  }

  private walk(
    current: SketchMSLayer,
    data: SketchMSData,
    options: SvgBlocGenOptions
  ) {
    if (this.layer.identify(current)) {
      current.layers.forEach(layer => {
        this.visit(layer, data, options);
      });
    } else if (this.symbol.identify(current)) {
      this.visitSymbol(current, data, options);
    }
  }

  private visit(
    current: SketchMSLayer,
    data: SketchMSData,
    options: SvgBlocGenOptions
  ) {
    if (options.force) {
      this.svgContext.clear(current);
    }
    if (this.svgContext.identify(current)) {
      if (!this.svgContext.has(current)) {
        this.visitContent(current);
      }
    }
    this.walk(current, data, options);
  }

  private visitSymbol(
    current: SketchMSLayer,
    data: SketchMSData,
    options: SvgBlocGenOptions
  ) {
    const symbolMaster = this.symbol.lookup(current, data);
    if (symbolMaster) {
      this.compute(symbolMaster, data, options);
    }
  }

  private visitContent(current: SketchMSLayer) {
    switch (current._class as string) {
      case 'shapePath':
        this.visitShapePath(current);
        break;

      case 'shapeGroup':
        this.visitShapeGroup(current);
        break;

      case 'triangle':
        this.visitTriangleShape(current);
        break;

      default:
        break;
    }
  }

  private visitShapePath(current: SketchMSLayer) {
    const config = [];
    let offset = 0;

    // TODO: Support multiple border
    if (
      current.style.borders &&
      current.style.borders.length > 0 &&
      current.style.borders[0].thickness !== null
    ) {
      config.push(`stroke-width="${current.style.borders[0].thickness}"`);
      const color = this.style.parseColorAsHex(current.style.borders[0].color);

      config.push(`stroke="${color}"`);
      offset = current.style.borders[0].thickness;
    }

    // TODO: move to @types/sketchapp
    const origin = this.shape.parsePoint(
      (current as any).points[0].point,
      offset,
      current
    );
    const segments = (current as any).points.slice(1).map(curvePoint => {
      const curveFrom = this.shape.parsePoint(
        curvePoint.curveFrom,
        offset,
        current
      );
      const curveTo = this.shape.parsePoint(
        curvePoint.curveTo,
        offset,
        current
      );
      const currPoint = this.shape.parsePoint(
        curvePoint.point,
        offset,
        current
      );
      if (curveTo.x === curveFrom.x && curveTo.y === curveFrom.y) {
        return `L ${currPoint.x} ${currPoint.y}`;
      }
      return `S ${curveTo.x} ${curveTo.y}, ${currPoint.x} ${currPoint.y}`;
    });

    segments.unshift(`M${origin.x} ${origin.y}`);

    if ((current as any).isClosed) {
      segments.push('z');
    }
    const fillStyle = this.extractFillStyle(current);

    this.svgContext.put(current, {
      offset,
      paths: [
        {
          type: 'path',
          attributes: [...config, fillStyle, `d="${segments}"`]
        }
      ]
    });
  }

  private visitTriangleShape(current: SketchMSLayer) {
    const config = [];
    let offset = 0;

    // TODO: Support multiple border
    if (
      current.style.borders &&
      current.style.borders.length > 0 &&
      current.style.borders[0].thickness !== null
    ) {
      config.push(`stroke-width="${current.style.borders[0].thickness / 2}"`);
      const color = this.style.parseColorAsHex(current.style.borders[0].color);
      config.push(`stroke="${color}"`);
      offset = current.style.borders[0].thickness;
    }

    const segments = (current as any).points
      .map(curvePoint => {
        const currPoint = this.shape.parsePoint(
          curvePoint.point,
          offset / 2,
          current
        );
        return `${currPoint.x}, ${currPoint.y}`;
      })
      .join(' ');

    const fillStyle = this.extractFillStyle(current);

    this.svgContext.put(current, {
      offset,
      paths: [
        {
          type: 'polygon',
          attributes: [...config, fillStyle, `points="${segments}"`]
        }
      ]
    });
  }

  private visitShapeGroup(current: SketchMSLayer) {
    console.log(current);
    const offset = 0;
    const paths = current.layers.map(layer => {
      // TODO: move to @types/sketchapp
      const origin = this.shape.parsePoint(
        (layer as any).points[0].point,
        offset,
        layer
      );
      const segments = (layer as any).points.slice(1).map(curvePoint => {
        const curveFrom = this.shape.parsePoint(
          curvePoint.curveFrom,
          offset,
          layer
        );
        const curveTo = this.shape.parsePoint(
          curvePoint.curveTo,
          offset,
          layer
        );
        const currPoint = this.shape.parsePoint(
          curvePoint.point,
          offset,
          layer
        );
        if (curveTo.x === curveFrom.x && curveTo.y === curveFrom.y) {
          return `L ${layer.frame.x + currPoint.x} ${layer.frame.y +
            currPoint.y}`;
        }
        return `S ${layer.frame.x + curveTo.x} ${layer.frame.y +
          curveTo.y}, ${layer.frame.x + currPoint.x} ${layer.frame.y +
          currPoint.y}`;
      });

      segments.unshift(
        `M${layer.frame.x + origin.x} ${layer.frame.y + origin.y}`
      );

      // TODO: isClosed to type
      if ((layer as any).isClosed) {
        segments.push('z');
      }

      return segments.join(' ');
    });

    const fillStyle = this.extractFillStyle(current);

    this.svgContext.put(current, {
      offset,
      paths: [
        {
          type: 'path',
          attributes: [fillStyle, `d="${paths.join(' ')}"`]
        }
      ]
    });
  }

  private extractFillStyle(current: SketchMSLayer) {
    const obj = (current as any).style.fills;

    if (obj && obj.length > 0) {
      // we only support one fill: take the first one!
      // ignore the other fills
      const firstFill = obj[0];

      if (firstFill.isEnabled) {
        const fillColor = this.style.parseColorAsRgba(firstFill.color);

        return `fill="${fillColor}"`;
      }
    }

    return 'fill="none"';
  }
}
