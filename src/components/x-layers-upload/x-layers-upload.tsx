import { Component, Event, Host, Listen, h } from '@stencil/core';
import { EventEmitter } from 'events';

@Component({
  tag: 'x-layers-upload',
  styleUrl: 'x-layers-upload.css',
  scoped: true
})
export class XlayersUpload {
  @Event({
    eventName: 'fileUploaded'
  })
  fileUploaded: EventEmitter;

  fileBrowserRef!: HTMLInputElement;

  @Listen('drop', {
    passive: false
  })
  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (const file of Array.from(event.dataTransfer.files)) {
        // If dropped items aren't files, reject them
        if ((file as any).kind === 'file') {
          // we only accept one file (for now)
          this.onFileChange((file as any).getAsFile());
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (const file of Array.from(event.dataTransfer.files)) {
        this.onFileChange(file);
        // we only accept one file (for now)
        return true;
      }
    }

    // Pass event to removeDragData for cleanup
    this.removeDragData(event);
  }

  @Listen('dragover', {
    passive: false
  })
  dragOverHandler(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  @Listen('input')
  onFileChange(inputEvent: any | File) {
    let file;
    if (!inputEvent.target) {
      file = inputEvent as File;
    } else {
      const files = inputEvent.target.files || inputEvent.dataTransfer.files;
      if (!files.length) {
        return;
      }
      file = files[0];
    }

    if (file.name.endsWith('.sketch')) {
      this.fileUploaded.emit(file);
    }
  }

  private removeDragData(event: DragEvent) {
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      event.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      event.dataTransfer.clearData();
    }
  }

  render() {
    return (
      <Host>
        <input
          ref={el => (this.fileBrowserRef = el)}
          type="file"
          accept=".sketch"
        />

        <slot></slot>

        <footer class="footer footer--full">
          <span>
            <a
              href="https://github.com/xlayers/xlayers/issues/new"
              target="__blank"
            >
              Give us your feedback{' '}
            </a>{' '}
            ●
            <a href="https://opencollective.com/xlayers" target="__blank">
              {' '}
              Support us{' '}
            </a>
          </span>
          <span>
            <a href="https://twitter.com/xlayers_" target="__blank">
              <img
                src="https://xlayers.app/assets/twitter.png"
                alt="Follow us on twitter"
              />
            </a>
            <a href="https://opencollective.com/xlayers" target="__blank">
              <img
                src="https://xlayers.app/assets/github-circle.png"
                alt="Find us on Github"
              />
            </a>
          </span>
          <span>
            <a href="xlayers.dev">Powered by xLayers Lite</a>
          </span>
        </footer>
      </Host>
    );
  }
}
