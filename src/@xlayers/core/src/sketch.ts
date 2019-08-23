import { SketchIngestorService } from "@xlayers/sketch-ingestor";
import { WebBlocGenService } from "@xlayers/web-blocgen";

export interface SketchMSData {
  pages: SketchMSPage[];
  previews: SketchMSPreview[];
  document: SketchMSDocumentData;
  user: SketchMSUserData;
  meta: SketchMSMetadata;
}

export class SketchService {
  private sketchIngestor: SketchIngestorService = new SketchIngestorService();
  private webBlocGen: WebBlocGenService = new WebBlocGenService();
  constructor() {}

  async loadSketchFile(file: File) {
    const data = await this.sketchIngestor.process(file);
    data.pages.forEach(page => {
      this.webBlocGen.compute(page, data);
    });
    return data;
  }
}
