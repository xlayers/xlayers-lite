import { Component, h, Host, Prop } from "@stencil/core";

@Component({
  tag: "x-layers-page",
  styleUrl: "x-layers-page.css",
  scoped: true
})
export class XlayersViewerPage {
  @Prop() data: SketchMSData;
  @Prop() page: SketchMSPage;

  @Prop() wireframe: boolean;
  @Prop() level = 0;

  componentWillLoad() {
  }
  render() {
    return (
      <Host>
        {this.page.layers.map(layer => (
          <x-layers-layer
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
