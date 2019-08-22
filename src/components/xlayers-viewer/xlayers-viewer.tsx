import { Component, Host, h, Listen, State } from "@stencil/core";
import { SketchService } from "@xlayers/core";

@Component({
  tag: "xlayers-viewer",
  styleUrl: "xlayers-viewer.css",
  shadow: true
})
export class XlayersViewer {
  private sketchService: SketchService = new SketchService();
  @State() data: SketchMSData;
  currentPage = {};

  @Listen("fileUploaded")
  async onFileUploaded(event: CustomEvent) {
    try {
      this.data = await this.sketchService.loadSketchFile(event.detail);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <Host>
        <xlayers-upload>
          <xlayers-viewer-container data={this.data} />
        </xlayers-upload>
      </Host>
    );
  }
}
