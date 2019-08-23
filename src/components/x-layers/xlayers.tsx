import { Component, Host, h, Listen, State, Prop } from "@stencil/core";
import { SketchService } from "@xlayers/core";

@Component({
  tag: "x-layers",
  styleUrl: "x-layers.css",
  scoped: true
})
export class XlayersViewer {
  private sketchService: SketchService = new SketchService();
  @Prop() src!: string;
  @Prop() mode: "2d" | "3d" = "2d";
  @Prop() wireframe: boolean = false;
  @State() data: SketchMSData;
  currentPage = {};

  async componentWillLoad() {
    if (this.src) {
      const res = await fetch(this.src);
      const fileBlob = await res.blob();
      this.data = await this.sketchService.loadSketchFile(fileBlob);
    }
  }

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
        <x-layers-upload>
          <x-layers-container data={this.data} mode={this.mode} wireframe={this.wireframe} />
        </x-layers-upload>
      </Host>
    );
  }
}
