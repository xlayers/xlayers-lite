import { Component, h, Host, Prop } from "@stencil/core";

@Component({
  tag: "xlayers-viewer-page",
  styleUrl: "xlayers-viewer-page.css",
  scoped: true
})
export class XlayersViewerPage {
  @Prop() data: SketchMSData;
  @Prop() page: SketchMSPage;

  @Prop() wireframe = true;
  @Prop() level = 0;

  componentWillLoad() {
  }
  render() {
    return (
      <Host>
        {this.page.layers.map(layer => (
          <xlayers-viewer-layer
            class={"layer " + (this.wireframe ? "wireframe" : "")}
            data={this.data}
            layer={layer}
            level={1}
            wireframe={this.wireframe}
            data-id={layer.do_objectID}
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
