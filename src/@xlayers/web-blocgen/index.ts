import { ImageService, LayerService, SymbolService } from "@xlayers/sketch-lib";
import { WebBlocGenOptions } from "./web-blocgen.d";
import { WebContextService } from "./web-context";
import { WebParserService } from "./web-parser";
import { WebRenderService } from "./web-render";

export class WebBlocGenService {
  private symbol: SymbolService = new SymbolService();
  private image: ImageService = new ImageService();
  private webContext: WebContextService = new WebContextService();
  private webParser: WebParserService = new WebParserService();
  private webRender: WebRenderService = new WebRenderService();
  private layer: LayerService = new LayerService();
  constructor() {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    this.webParser.compute(current, data, this.compileOptions(options));
  }

  render(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    return this.traverseAndRender(current, data, this.compileOptions(options));
  }

  identify(current: SketchMSLayer) {
    return this.webContext.identify(current);
  }

  context(current: SketchMSLayer) {
    return this.webContext.of(current);
  }

  private traverseAndRender(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    return [
      ...this.traverse(current, data, options),
      ...this.webRender.render(current, options)
    ];
  }

  private traverse(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (this.layer.identify(current)) {
      return this.layer
        .lookup(current, data)
        .flatMap(layer => this.traverse(layer, data, options));
    }
    return this.retrieveFiles(data, current, options);
  }

  private retrieveFiles(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    if (this.symbol.identify(current)) {
      return this.retrieveSymbolMaster(current, data, options);
    }
    if (this.image.identify(current)) {
      return this.image.render(current, data, options);
    }
    return [];
  }

  private retrieveSymbolMaster(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.symbol.lookup(current, data);
    if (symbolMaster) {
      return this.traverseAndRender(symbolMaster, data, options);
    }
    return [];
  }

  private compileOptions(options: WebBlocGenOptions) {
    return {
      textTagName: "span",
      bitmapTagName: "img",
      blockTagName: "div",
      mode: "web",
      jsx: false,
      xmlPrefix: "xly-",
      cssPrefix: "xly_",
      componentDir: "components",
      assetDir: "assets",
      ...options
    };
  }
}
