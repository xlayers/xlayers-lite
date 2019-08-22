import { SvgContextService } from "./svg-context";
import { SvgRenderService } from "./svg-render";
import { SvgParserService } from "./svg-parser";
import { SvgBlocGenOptions } from "./svg-blocgen.d";

export class SvgBlocGenService {
  private svgContext: SvgContextService = new SvgContextService();
  private svgParser: SvgParserService = new SvgParserService();
  private svgRender: SvgRenderService = new SvgRenderService();
  constructor() {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: SvgBlocGenOptions
  ) {
    this.svgParser.compute(current, data, this.compileOptions(options));
  }

  render(current: SketchMSLayer, options?: SvgBlocGenOptions) {
    return this.svgRender.render(current, this.compileOptions(options));
  }

  identify(current: SketchMSLayer) {
    return this.svgContext.identify(current);
  }

  context(current: SketchMSLayer) {
    return this.svgContext.of(current);
  }

  private compileOptions(options: SvgBlocGenOptions) {
    return {
      xmlNamespace: true,
      ...options
    };
  }
}
