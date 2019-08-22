import { Component, h, Host, Listen, Prop, State } from "@stencil/core";

@Component({
  tag: "xlayers-viewer-container",
  styleUrl: "xlayers-viewer-container.css",
  shadow: true
})
export class XlayersViewerContainer {
  element!: HTMLElement;

  @Prop({
    mutable: true
  })
  data: SketchMSData;

  render() {
    if (this.data) {
      return (
        <div class="layers-container">
          <xlayers-viewer-canvas
            ref={el => (this.element = el)}
            data={this.data}
          />
        </div>
      );
    }
    return <Host />;
  }
}
