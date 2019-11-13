import {
  Component,
  Element,
  Host,
  Listen,
  Prop,
  State,
  Watch,
  h
} from '@stencil/core';

@Component({
  tag: 'x-layers-canvas',
  styleUrl: 'x-layers-canvas.css',
  scoped: true
})
export class XlayersViewerCanvas {
  canvasRef: HTMLDivElement;
  @Prop() data: SketchMSData;

  @Prop() mode: '2d' | '3d';
  @Prop() wireframe: boolean;
  @Prop() zoom: number;

  @State() currentPage: SketchMSPage = null;
  @Element() element: HTMLElement;

  currentZoomLevel = 1;

  componentWillLoad() {
    this.modeChanged();
    this.currentPage = this.data.pages[0];
  }

  @Watch('mode')
  modeChanged() {
    if (this.mode === '3d') {
      this.element.classList.add('is-3d-view');
    } else {
      this.element.classList.remove('is-3d-view');
    }
  }

  // use async to wait for canvasRef to be defined
  async componentDidLoad() {
    this.canvasRef.style.transform = this.formatTransformStyle(
      this.canvasRef.style.transform,
      this.zoom
    );
    this.currentZoomLevel = this.zoom;
  }

  @Watch('data')
  updateCurrentPage() {
    if (this.data) {
      this.currentPage = this.data.pages[0];
    }
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
                'canvas ' +
                (page.do_objectID === this.currentPage.do_objectID
                  ? 'selected'
                  : '')
              }
              ref={el => (this.canvasRef = el)}
            >
              <x-layers-page
                data={this.data}
                page={page}
                mode={this.mode}
                wireframe={this.wireframe}
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
