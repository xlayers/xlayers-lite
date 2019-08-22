export class LayerService {
  identify(current: SketchMSLayer) {
    return current.layers && Array.isArray(current.layers);
  }

  lookup(current: SketchMSLayer, _data: SketchMSData) {
    return current.layers as any;
  }
}