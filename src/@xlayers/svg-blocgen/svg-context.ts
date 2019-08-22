import { SvgBlocGenContext } from './svg-blocgen';

export class SvgContextService {
  identify(current: SketchMSLayer) {
    return ['triangle', 'shapePath'].includes(current._class as string);
  }

  has(current: SketchMSLayer) {
    return !!(current as any).svg;
  }

  of(current: SketchMSLayer) {
    return (current as any).svg || { paths: [], offset: 0, attributes: [] };
  }

  put(
    current: SketchMSLayer,
    newContext: SvgBlocGenContext = { paths: [], offset: 0, attributes: [] }
  ) {
    (current as any).svg = {
      ...this.of(current),
      ...newContext
    };
  }

  clear(current: SketchMSLayer) {
    delete (current as any).svg;
  }
}
