import {
  Component,
  Host,
  h,
  Prop,
  State,
  Element,
  Listen
} from "@stencil/core";
import { SvgBlocGenService } from "@xlayers/svg-blocgen";
import { TextService, SymbolService, ImageService } from "@xlayers/sketch-lib";
import { CssBlocGenService } from "@xlayers/css-blocgen";

@Component({
  tag: "xlayers-viewer-layer",
  styleUrl: "xlayers-viewer-layer.css",
  shadow: true
})
export class XlayersViewerLayer {
  @Prop() data: SketchMSData;
  @Prop() layer: SketchMSLayer;

  @Prop() wireframe = false;
  @Prop() level = 0;

  @State() isWireframe = false;
  @State() is3dView = false;

  @Element() element: HTMLElement;

  borderWidth = 1;
  offset3d = 20;

  texts: string[] = [];
  images: string[] = [];
  layers: SketchMSLayer[] = [];

  private text: TextService = new TextService();
  private cssBlocGen: CssBlocGenService = new CssBlocGenService();
  private svgBlocGen: SvgBlocGenService = new SvgBlocGenService();
  private resource: SymbolService = new SymbolService();
  private image: ImageService = new ImageService();

  componentWillLoad() {
    this.wireframe = this.isWireframe;

    if (this.is3dView) {
      this.enable3dStyle();
    } else {
      this.disable3dStyle();
    }
  }

  componentDidRender() {
    this.loadText();
    this.applyHighlightStyles();
    this.applyLayerStyles();
    this.loadImage();
    this.loadShapes();
    this.loadLayers();
  }

  loadText() {
    if (this.text.identify(this.layer)) {
      const content = this.text.lookup(this.layer);
      if (content) {
        this.texts.push(content);
      }
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
        this.element[property] = value;
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
    this.element.style.transform = `translateZ(${(
      this.level * this.offset3d
    ).toFixed(3)}px)`;
  }

  disable3dStyle() {
    this.element.style.transform = `none`;
  }

  @Listen("selectedLayer")
  selectLayer(event) {
    console.log("layer selected");
  }

  render() {
    return (
      <Host>
        <div
          style={{
            height: this.layer.frame.height + "px",
            width: this.layer.frame.width + "px"
          }}
        >
          {this.layers.map(layer => (
            <xlayers-viewer-layer
              class={"layer" + (this.wireframe ? "wireframe" : "")}
              data={this.data}
              layer={layer}
              level={this.level + 1}
              wireframe={this.wireframe}
              data-id={layer.do_objectID}
              data-name={layer.name}
              data-class={layer._class}
            />
          ))}

          {this.texts.map(text => (
            <span>{{ text }}</span>
          ))}

          {this.images.map(image => (
            <img src={image} style={{ height: "100%", width: "100%" }} />
          ))}
        </div>
      </Host>
    );
  }
}
