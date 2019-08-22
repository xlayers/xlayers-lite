import { Component, Host, h, Prop, State } from "@stencil/core";

@Component({
  tag: "xlayers-viewer-page",
  styleUrl: "xlayers-viewer-page.css",
  shadow: true
})
export class XlayersViewerPage {

  @Prop() data: SketchMSData;
  @Prop() page: SketchMSPage;

  @Prop() wireframe = false;
  @State() isWireframe = false;
  @Prop() level = 0;

  componentWillLoad() {
    this.wireframe = this.isWireframe;
  }
  render() {
    return (
      <Host>
        {this.page.layers.map(layer => (
          <xlayer-viewer-layer
            class={"layer" + (this.wireframe === true) ? "wireframe" : ""}
            data={this.data}
            layer={layer}
            level="1"
            wireframe={this.wireframe}
            id={layer.do_objectID}
            data-name={layer.name}
            data-class={layer._class}
            style={{
              width: layer.frame.width + "px",
              height: layer.frame.height + "px"
            }}
          />
        ))}
      </Host>
    );
  }
}
