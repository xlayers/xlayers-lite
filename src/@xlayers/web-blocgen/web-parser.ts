import { CssBlocGenService } from '@xlayers/css-blocgen';
import {
  FormatService,
  ImageService,
  LayerService,
  SymbolService,
  TextService
} from '@xlayers/sketch-lib';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';

import { WebBlocGenOptions } from './web-blocgen.d';
import { WebContextService } from './web-context';

export class WebParserService {
  private text: TextService = new TextService();
  private format: FormatService = new FormatService();
  private symbol: SymbolService = new SymbolService();
  private image: ImageService = new ImageService();
  private layer: LayerService = new LayerService();
  private cssBlocGen: CssBlocGenService = new CssBlocGenService();
  private svgBlocGen: SvgBlocGenService = new SvgBlocGenService();
  private webContext: WebContextService = new WebContextService();

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    this.svgBlocGen.compute(current, data, options);
    this.cssBlocGen.compute(current, data, options);
    if (current._class === 'page') {
      this.walk(current, data, options);
    } else {
      this.visit(current, data, options);
    }
  }

  private walk(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (this.layer.identify(current)) {
      current.layers.forEach(layer => {
        this.visit(layer, data, options);
      });
    }
  }

  private visit(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (options.force) {
      this.webContext.clear(current);
    }
    if (!this.webContext.has(current)) {
      this.visitContent(current, data, options);
    }
    if (this.webContext.identify(current)) {
      this.walk(current, data, options);
    }
  }

  private visitContent(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (this.symbol.identify(current)) {
      this.visitSymbol(current, data, options);
    } else if (this.image.identify(current)) {
      this.visitBitmap(current, options);
    } else if (this.text.identify(current)) {
      this.visitText(current, options);
    } else if (this.svgBlocGen.identify(current)) {
      this.visitShape(current, options);
    } else if (this.webContext.identify(current)) {
      this.visitLayer(current, options);
    }
  }

  private visitLayer(current: SketchMSLayer, options: WebBlocGenOptions) {
    const className = this.cssBlocGen.context(current).className;
    this.webContext.put(current, {
      attributes: [
        ...(className.length > 0
          ? [`${options.jsx ? 'className' : 'class'}="${className}"`]
          : []),
        `role="${current._class}"`,
        `aria-label="${current.name}"`
      ],
      type: 'block'
    });
  }

  private visitSymbol(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.symbol.lookup(current, data);
    if (symbolMaster) {
      this.compute(symbolMaster, data, options);
      this.webContext.put(current, {
        components: [...this.webContext.of(current).components, current.name]
      });
    }
  }

  private visitBitmap(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.normalizeName(current.name);
    this.webContext.put(current, {
      attributes: [
        ...this.generateClassAttribute(current),
        `role="${current._class}"`,
        `aria-label="${current.name}"`,
        `src="${options.assetDir}/${fileName}.jpg`
      ],
      type: 'image'
    });
  }

  private visitText(current: SketchMSLayer, _options: WebBlocGenOptions) {
    this.webContext.put(current, {
      attributes: this.generateClassAttribute(current),
      type: 'text'
    });
  }

  private visitShape(current: SketchMSLayer, _options: WebBlocGenOptions) {
    this.webContext.put(current, {
      attributes: this.generateClassAttribute(current),
      type: 'shape'
    });
  }

  private generateClassAttribute(current: SketchMSLayer) {
    const className = this.cssBlocGen.context(current).className;
    return className.length > 0
      ? [`class="${this.cssBlocGen.context(current).className}"`]
      : [];
  }
}
