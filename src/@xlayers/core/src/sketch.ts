import { SketchIngestorService } from "@xlayers/sketch-ingestor";

export interface SketchMSData {
  pages: SketchMSPage[];
  previews: SketchMSPreview[];
  document: SketchMSDocumentData;
  user: SketchMSUserData;
  meta: SketchMSMetadata;
}

export class SketchService {
  private sketchIngestor: SketchIngestorService = new SketchIngestorService();
  constructor() {}

  async loadSketchFile(file: File) {
    return await this.sketchIngestor.process(file);
  }
}
