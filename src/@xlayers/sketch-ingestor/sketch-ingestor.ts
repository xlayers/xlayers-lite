import JSZip from 'jszip';

type Functer = <T>(value: any) => Promise<T>;

const entryAsyncCheck = (entry: any): entry is { async: Functer } => {
  return !!entry && typeof entry === 'object' && 'async' in entry;
};

const jszipLoadAsync = (jszip: any): jszip is { loadAsync: Functer } => {
  return !!jszip && typeof jszip === 'object' && 'loadAsync' in jszip;
};

export class SketchIngestorService {
  async process(file: File | Blob) {
    const data = {
      images: {},
      pages: [],
      previews: [],
      document: {},
      user: {},
      meta: {}
    } as any;

    const files = await this.readZipEntries(file);

    await Promise.all(
      Object.entries(files).map(async ([relativePath, entry]) => {
        if (relativePath === 'previews/preview.png') {
          return this.addPreviewImage(data, relativePath, entry);
        } else if (relativePath.startsWith('images/')) {
          return this.addImage(data, relativePath, entry);
        } else if (relativePath.startsWith('pages/')) {
          return this.addPage(data, relativePath, entry);
        } else {
          const objectName = relativePath.replace('.json', '');
          if (data.hasOwnProperty(objectName)) {
            return this.addConfiguration(data, objectName, entry);
          }
        }
        return Promise.resolve({});
      })
    );

    return data;
  }

  private async readZipEntries(file: Blob) {
    return new Promise<unknown[]>((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onloadstart = _event => undefined;
      fileReader.onloadend = _event => undefined;

      fileReader.onload = _event => {
        try {
          resolve(this.unzipSketchPackage(fileReader.result));
        } catch (e) {
          reject(e);
        }
      };

      fileReader.onerror = e => {
        reject(e);
      };

      try {
        fileReader.readAsArrayBuffer(file);
      } catch (e) {
        reject(e);
      }
    });
  }

  private async unzipSketchPackage(data: string | ArrayBuffer) {
    const jszip = JSZip();

    if (jszipLoadAsync(jszip)) {
      const zipFileInstance = await jszip.loadAsync<string | ArrayBuffer>(data);

      const files: unknown[] = [];
      // TODO: We need to resolve this by a type;
      (zipFileInstance as any).forEach((relativePath, zipEntry) => {
        files[relativePath] = zipEntry;
      });
      return files;
    } else {
      throw new Error('JSzip not loaded');
    }
  }

  private async addConfiguration(
    data: SketchMSData,
    relativePath: string,
    entry: unknown
  ) {
    const content = await this.extractJson(relativePath, entry);
    data[relativePath] = content;
  }

  private async addPage(
    data: SketchMSData,
    relativePath: string,
    entry: unknown
  ) {
    try {
      const content = await this.extractJson(relativePath, entry);
      data.pages.push(content);
    } catch (e) {
      throw new Error(`Could not load page "${relativePath}"`);
    }
  }

  private async addImage(
    data: SketchMSData,
    relativePath: string,
    entry: unknown
  ) {
    const imageData = await this.extractBase64(relativePath, entry);
    (data as any).images[relativePath] = imageData;
  }

  private async addPreviewImage(
    data: SketchMSData,
    relativePath: string,
    entry: unknown
  ) {
    const imageData = await this.extractBase64(relativePath, entry);
    data.previews.push(imageData);
  }

  private async extractJson(_relativePath: string, entry: unknown) {
    if (entryAsyncCheck(entry)) {
      const content = await entry.async<string>('string');
      return JSON.parse(content);
    } else {
      throw new Error('JSZip undefined async function');
    }
  }

  private async extractBase64(_relativePath: string, entry: unknown) {
    if (entryAsyncCheck(entry)) {
      return entry.async<SketchMSPreview>('base64');
    } else {
      throw new Error('JSZip undefined async function');
    }
  }
}
