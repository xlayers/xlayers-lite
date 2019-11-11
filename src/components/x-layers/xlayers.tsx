import { Component, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { SketchService } from '@xlayers/core';

@Component({
  tag: 'x-layers',
  styleUrl: 'x-layers.css',
  scoped: true
})
export class XlayersViewer {
  private sketchService: SketchService = new SketchService();
  @Prop() src?: string;
  @Prop() mode: '2d' | '3d' = '3d';
  @Prop() zoom = 1;
  @Prop() wireframe = false;
  @State() data: SketchMSData;
  currentPage = {};
  isError = false;

  async componentWillLoad() {
    await this.srcChanged();
  }

  @Watch('src')
  async srcChanged() {
    try {
      if (this.src.length > 0) {
        const res = await fetch(this.src);
        const fileBlob = await res.blob();
        this.data = null;
        this.data = await this.sketchService.loadSketchFile(fileBlob);
      } else {
        this.data = null;
      }
    } catch (error) {
      this.isError = true;
    }
  }

  @Listen('fileUploaded')
  async onFileUploaded(event: CustomEvent) {
    try {
      this.data = await this.sketchService.loadSketchFile(event.detail);
    } catch (error) {
      console.error(error);
    }
  }

  @Watch('mode')
  modechanged(prev, curr) {
    console.error(prev, curr);
  }

  render() {
    return (
      <Host>
        <x-layers-upload>
          {this.isError ? (
            <span class="error">File {this.src} is not accessible.</span>
          ) : (
            <span></span>
          )}
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
