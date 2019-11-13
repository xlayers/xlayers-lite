import { CssBlocGenOptions } from './css-blocgen.d';
import { CssContextService } from './css-context';
import { CssParserService } from './css-parser';
import { CssRenderService } from './css-render';
export class CssBlocGenService {

  private cssContext: CssContextService = new CssContextService();
  private cssParser: CssParserService = new CssParserService();
  private cssRender: CssRenderService = new CssRenderService();

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: CssBlocGenOptions
  ) {
    this.cssParser.compute(current, data, this.compileOptions(options));
  }

  render(current: SketchMSLayer, options?: CssBlocGenOptions) {
    return this.cssRender.render(current, this.compileOptions(options));
  }

  identify(current: SketchMSLayer) {
    return this.cssContext.identify(current);
  }

  context(current: SketchMSLayer) {
    return this.cssContext.of(current);
  }

  private compileOptions(options: CssBlocGenOptions) {
    return {
      generateClassName: true,
      cssPrefix: 'xly_',
      componentDir: 'components',
      ...options
    };
  }
}
