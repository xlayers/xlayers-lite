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

export class WebRenderService {
  private text: TextService = new TextService();
  private symbol: SymbolService = new SymbolService();
  private image: ImageService = new ImageService();
  private format: FormatService = new FormatService();
  private layer: LayerService = new LayerService();
  private webContext: WebContextService = new WebContextService();
  private cssBlocGen: CssBlocGenService = new CssBlocGenService();
  private svgBlocGen: SvgBlocGenService = new SvgBlocGenService();

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.normalizeName(current.name);
    return [
      {
        kind: 'web',
        value: this.renderComponent(current, options),
        language: 'html',
        uri: `${options.componentDir}/${fileName}.html`
      },
      ...this.cssBlocGen.render(current, options).map(file => ({
        ...file,
        kind: 'web'
      }))
    ];
  }

  private renderComponent(current: SketchMSLayer, options: WebBlocGenOptions) {
    const template = [];

    if (current._class === 'page') {
      this.walk(current, template, 0, options);
    } else {
      this.visit(current, template, 0, options);
    }

    return template.join('\n');
  }

  private walk(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    if (this.layer.identify(current)) {
      current.layers.forEach(layer => {
        this.visit(layer, template, indent, options);
      });
    }
  }

  private visit(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    if (this.symbol.identify(current)) {
      this.visitSymbol(current, template, indent, options);
    } else if (this.image.identify(current)) {
      this.visitBitmap(current, template, indent, options);
    } else if (this.text.identify(current)) {
      this.visitText(current, template, indent, options);
    } else if (this.svgBlocGen.identify(current)) {
      this.visitShape(current, template, indent, options);
    } else if (this.webContext.identify(current)) {
      this.visitLayer(current, template, indent, options);
    }
  }

  private visitLayer(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    const openTag = this.renderAttributeTag(
      current,
      options.blockTagName,
      options
    );
    const closeTag = `</${options.blockTagName}>`;

    template.push(this.format.indent(indent, openTag));
    this.walk(current, template, indent + 1, options);
    template.push(this.format.indent(indent, closeTag));
  }

  private visitSymbol(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    const tagName = options.jsx
      ? this.format.className(current.name)
      : `${options.xmlPrefix}${this.format.normalizeName(current.name)}`;
    template.push(this.format.indent(indent, `<${tagName}></${tagName}>`));
  }

  private visitBitmap(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    const attributes = this.webContext.of(current).attributes;
    template.push(
      this.format.indent(
        indent,
        [`<${options.bitmapTagName}`, ...attributes].join(' ') + ' />'
      )
    );
  }

  private visitText(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    template.push(
      this.format.indent(
        indent,
        this.renderAttributeTag(current, options.textTagName, options)
      )
    );
    template.push(
      this.format.indent(
        indent + 1,
        [
          `<${options.textTagName}>`,
          this.text.lookup(current),
          `</${options.textTagName}>`
        ].join('')
      )
    );
    template.push(this.format.indent(indent, `</${options.blockTagName}>`));
  }

  private visitShape(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    template.push(
      this.format.indent(
        indent,
        this.renderAttributeTag(current, options.blockTagName, options)
      )
    );
    template.push(
      this.svgBlocGen
        .render(current, { xmlNamespace: false })
        .map(file =>
          file.value
            .split('\n')
            .map(line => this.format.indent(indent + 1, line))
            .join('\n')
        )
        .join('\n')
    );
    template.push(this.format.indent(indent, `</${options.blockTagName}>`));
  }

  private renderAttributeTag(
    current: SketchMSLayer,
    tagName: string,
    options: WebBlocGenOptions
  ) {
    const attributes = this.webContext.of(current).attributes;
    if (options.jsx) {
      const attributIndex = attributes.findIndex(attribute =>
        attribute.startsWith('class=')
      );
      attributes[attributIndex] = attributes[attributIndex].replace(
        'class=',
        'className='
      );
    }
    return [`<${tagName}`, ...attributes].join(' ') + '>';
  }
}
