import { Component, h, Host, Prop, Element } from "@stencil/core";

@Component({
  tag: "x-layers-page",
  styleUrl: "x-layers-page.css",
  scoped: true
})
export class XlayersViewerPage {
  @Prop() data: SketchMSData;
  @Prop() page: SketchMSPage;

  @Prop() wireframe: boolean;
  @Prop() mode: "2d" | "3d";

  @Element() element: HTMLElement;

  componentWillLoad() {
    if (this.mode === "3d") {
      this.element.classList.add("is-3d-view");
    } else {
      this.element.classList.remove("is-3d-view");
    }
  }

  render() {
    return (
      <Host>
        {this.page.layers.map(layer => (
          <x-layers-layer
            class={"layer " + (this.wireframe ? "wireframe" : "")}
            data={this.data}
            layer={layer}
            depth={1}
            mode={this.mode}
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
