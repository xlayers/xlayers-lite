import { Component, Event, h, Host, Listen } from "@stencil/core";
import { EventEmitter } from "events";

@Component({
  tag: "xlayers-upload",
  styleUrl: "xlayers-upload.css",
  shadow: true
})
export class XlayersUpload {
  @Event({
    eventName: "fileUploaded"
  })
  fileUploaded: EventEmitter;

  fileBrowserRef!: HTMLInputElement;

  constructor() {}

  @Listen("drop", {
    passive: false
  })
  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === "file") {
          const file = event.dataTransfer.items[i].getAsFile() as File;
          this.onFileChange(file);

          // we only accept one file (for now)
          return true;
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        const file = event.dataTransfer.files[i];
        this.onFileChange(file);

        // we only accept one file (for now)
        return true;
      }
    }

    // Pass event to removeDragData for cleanup
    this.removeDragData(event);
  }

  @Listen("dragover", {
    passive: false
  })
  dragOverHandler(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  @Listen("input")
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

    if (file.name.endsWith(".sketch")) {
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
        <section>
          <b>Powered by <a href="xlayers.dev">xlayers.dev</a></b>
        </section>

        <input
          ref={el => (this.fileBrowserRef = el)}
          type="file"
          accept=".sketch"
        />

        <slot></slot>
      </Host>
    );
  }
}
