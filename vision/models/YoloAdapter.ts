import { IYoloAdapter, Detection, CameraConfig } from '../types';
import { SimulatedYoloModel } from './SimulatedYoloModel';

/**
 * YoloModelFactory & Adapter Registry
 * This adapter decouples the UI from the underlying detection engine.
 * Currently uses SimulatedYoloModel for zero-dependency browser execution,
 * but can easily accept a WebGL/WASM ONNX YoloV8 adapter or FastAPI backend WebSocket stream.
 */
export class YoloModelFactory {
  private static instance: IYoloAdapter | null = null;

  public static getModel(type: 'simulated' | 'onnx-web' | 'fastapi-stream' = 'simulated'): IYoloAdapter {
    if (!this.instance) {
      if (type === 'simulated') {
        this.instance = new SimulatedYoloModel();
      } else {
        // Future pluggable integration point:
        // this.instance = new OnnxWebYoloAdapter();
        this.instance = new SimulatedYoloModel();
      }
    }
    return this.instance!;
  }

  public static async initializeModel(): Promise<IYoloAdapter> {
    const model = this.getModel();
    if (!model.isReady) {
      await model.initialize();
    }
    return model;
  }
}
