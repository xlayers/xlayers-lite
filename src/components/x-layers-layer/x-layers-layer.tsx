import {
  Component,
  Element,
  Host,
  Listen,
  Prop,
  State,
  Watch,
  h
} from '@stencil/core';
import { CssBlocGenService } from '@xlayers/css-blocgen';
import { ImageService, SymbolService, TextService } from '@xlayers/sketch-lib';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';

@Component({
  tag: 'x-layers-layer',
  styleUrl: 'x-layers-layer.css',
  scoped: true
})
export class XlayersViewerLayer {
  @Prop() data: SketchMSData;
  @Prop() layer: SketchMSLayer;

  @Prop() wireframe: boolean;
  @Prop() depth: number;
  @Prop() mode: '2d' | '3d';

  @Element() element: HTMLElement;

  @State() borderWidth = 1;
  @State() offset3d = 20;

  @State() texts: string[] = [];
  @State() images: string[] = [];
  @State() layers: SketchMSLayer[] = [];

  private text: TextService = new TextService();
  private cssBlocGen: CssBlocGenService = new CssBlocGenService();
  private svgBlocGen: SvgBlocGenService = new SvgBlocGenService();
  private resource: SymbolService = new SymbolService();
  private image: ImageService = new ImageService();

  componentWillLoad() {
    this.loadText();
    this.applyHighlightStyles();
    this.applyLayerStyles();
    this.loadImage();
    this.loadShapes();
    this.loadLayers();
    this.modeChanged();
  }

  loadText() {
    if (this.text.identify(this.layer)) {
      const content = this.text.lookup(this.layer);
      if (content) {
        this.texts.push(content);
      }
    }
  }

  @Watch('mode')
  modeChanged() {
    if (this.mode === '3d') {
      this.enable3dStyle();
    } else {
      this.disable3dStyle();
    }
  }

  applyHighlightStyles() {
    const elementPosition = this.element.getBoundingClientRect();
    this.element.style.borderWidth = `${this.borderWidth}px`;
    this.element.style.left = `${elementPosition.left - this.borderWidth}px`;
    this.element.style.top = `${elementPosition.top - this.borderWidth}px`;
  }

  applyLayerStyles() {
    if (this.cssBlocGen.identify(this.layer)) {
      const rules = this.cssBlocGen.context(this.layer).rules;
      Object.entries(rules).forEach(([property, value]) => {
        this.element.style[property] = value;
      });
    }
  }

  loadImage() {
    if (this.image.identify(this.layer)) {
      const content = this.image.lookup(this.layer, this.data);
      if (content) {
        this.images.push(`data:image/png;base64,${content}`);
      }
    }
  }

  loadShapes() {
    if (this.svgBlocGen.identify(this.layer)) {
      this.svgBlocGen
        .render(this.layer)
        .forEach(file =>
          this.images.push(`data:image/svg+xml;base64,${btoa(file.value)}`)
        );
    }
  }

  loadLayers() {
    if (this.layer.layers) {
      this.layers = this.layer.layers;
    } else {
      this.loadSymbolMaster();
    }
  }

  loadSymbolMaster() {
    if (this.resource.identify(this.layer)) {
      const symbolMaster = this.resource.lookup(this.layer, this.data);

      if (symbolMaster) {
        this.layers = [symbolMaster];
      }
    }
  }

  enable3dStyle() {
    this.element.classList.add('is-3d-view');
    this.element.style.transform = `translateZ(${(
      this.depth * this.offset3d
    ).toFixed(3)}px)`;
  }

  disable3dStyle() {
    this.element.classList.remove('is-3d-view');
    this.element.style.transform = `none`;
  }

  render() {
    return (
      <Host>
        <div
          style={{
            height: this.layer.frame.height + 'px',
            width: this.layer.frame.width + 'px'
          }}
        >
          {this.layers.map(layer => (
            <x-layers-layer
              class={'layer ' + (this.wireframe ? 'wireframe' : '')}
              data={this.data}
              layer={layer}
              depth={this.depth + 1}
              mode={this.mode}
              wireframe={this.wireframe}
              data-id={layer.do_objectID}
              data-name={layer.name}
              data-class={layer._class}
              style={{
                width: layer.frame.width + 'px',
                height: layer.frame.height + 'px'
              }}
            />
          ))}

          {this.texts.map(text => (
            <span>{text}</span>
          ))}

          {this.images.map(image => (
            <img src={image} style={{ height: '100%', width: '100%' }} />
          ))}
        </div>
      </Host>
    );
  }
}
