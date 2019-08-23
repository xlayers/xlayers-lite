import { Component, Host, h, Prop, State, Element, Watch } from "@stencil/core";

@Component({
  tag: "xlayers-viewer-canvas",
  styleUrl: "xlayers-viewer-canvas.css",
  scoped: true
})
export class XlayersViewerCanvas {
  canvas!: HTMLDivElement;
  @Prop() data: SketchMSData;

  @State() currentPage: SketchMSPage = null;
  @State() is3dView: boolean = false;
  @State() zoomLevel: number = 1.0;

  @Element() element: HTMLElement;

  currentZoomLevel = 1;

  componentWillLoad() {
    if (this.is3dView === true) {
      this.element.classList.add("is-3d-view");
    } else {
      this.element.classList.remove("is-3d-view");
    }

    if (this.canvas) {
      this.canvas.style.transform = this.formatTransformStyle(
        this.canvas.style.transform,
        this.zoomLevel
      );
      this.currentZoomLevel = this.zoomLevel;
    }

    if (this.data) {
      this.currentPage = this.data.pages[0];
    }
  }

  @Watch("data")
  updateCurrentPage() {
    this.currentPage = this.data.pages[0];
  }

  formatTransformStyle(existingTransformStyle: string, zoomLevel: number) {
    const scaleStyleRegex = /(\([ ]?[\d]+(\.[\d]+)?[ ]?(,[ ]?[\d]+(\.[\d]+)?[ ]?)?\))/gim;
    return scaleStyleRegex.test(existingTransformStyle)
      ? existingTransformStyle.replace(
          scaleStyleRegex,
          `(${zoomLevel},${zoomLevel})`
        )
      : existingTransformStyle + ` scale(${zoomLevel},${zoomLevel})`;
  }

  render() {
    if (this.data) {
      return (
        <Host>
          {this.data.pages.map(page => (
            <div
              class={
                "canvas " +
                (page.do_objectID == this.currentPage.do_objectID
                  ? "selected"
                  : "")
              }
              ref={el => (this.canvas = el)}
            >
              <xlayers-viewer-page
                data={this.data}
                page={page}
                data-id={page.do_objectID}
                data-name={page.name}
                data-class={page._class}
              />
            </div>
          ))}
        </Host>
      );
    }
    return <Host />;
  }
}
