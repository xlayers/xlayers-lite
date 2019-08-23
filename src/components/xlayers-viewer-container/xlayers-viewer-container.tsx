import { Component, h, Host, Prop } from "@stencil/core";

@Component({
  tag: "xlayers-viewer-container",
  styleUrl: "xlayers-viewer-container.css",
  scoped: true
})
export class XlayersViewerContainer {
  element!: HTMLElement;

  @Prop({
    mutable: true
  })
  data: SketchMSData;

  componentWillLoad() {
    // this.data.map()
  }

  render() {
    return (
      <div class="layers-container">
        <xlayers-viewer-canvas
          ref={el => (this.element = el)}
          data={this.data}
        />
      </div>
    );
  }
}
