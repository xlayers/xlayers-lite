import { Component, Listen, Prop, h } from '@stencil/core';

@Component({
  tag: 'x-layers-container',
  styleUrl: 'x-layers-container.css',
  scoped: true
})
export class XlayersViewerContainer {
  element!: HTMLElement;

  @Prop() data: SketchMSData;

  @Prop() mode: '2d' | '3d';
  @Prop() zoom: number;
  @Prop() wireframe: boolean;

  render() {
    return (
      <div class="layers-container">
        <x-layers-canvas
          ref={el => (this.element = el)}
          data={this.data}
          mode={this.mode}
          zoom={this.zoom}
          wireframe={this.wireframe}
        />
      </div>
    );
  }
}
