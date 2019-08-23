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
  @Prop() zoom: number = 1;
  @Prop() wireframe: boolean = false;
  @State() data: SketchMSData;
  currentPage = {};
  isError = false;

  async componentWillLoad() {
    if (this.src) {
      try {
        const res = await fetch(this.src);
        const fileBlob = await res.blob();
        this.data = await this.sketchService.loadSketchFile(fileBlob);
      }
      catch(error) {
        this.isError = true;
      }
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
          { this.isError 
            ? <span class="error">File {this.src} is not accessible.</span>
            : <span></span>
          }
          <x-layers-container
            zoom={this.zoom}
            data={this.data}
            mode={this.mode}
            wireframe={this.wireframe}
          />
        </x-layers-upload>
      </Host>
    );
  }
}
