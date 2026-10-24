import { CameraConfig, CameraType, CameraStatus, RiskZoneType } from '../types';

/**
 * CameraManager
 * Production-ready singleton managing hardware cameras, IP streams, RTSP links,
 * ESP32-CAM edge hardware, and demo simulation feeds.
 */
export class CameraManager {
  private static instance: CameraManager;
  private cameras: Map<string, CameraConfig> = new Map();
  private listeners: ((cameras: CameraConfig[]) => void)[] = [];

  private constructor() {
    this.initializeDefaultCameras();
  }

  public static getInstance(): CameraManager {
    if (!CameraManager.instance) {
      CameraManager.instance = new CameraManager();
    }
    return CameraManager.instance;
  }

  private initializeDefaultCameras() {
    const defaults: CameraConfig[] = [
      {
        id: 'CAM-001',
        name: 'Main Lobby & Security Desk',
        type: 'rtsp',
        streamUrl: 'rtsp://192.168.1.101:554/live/ch1',
        zone: 'Entrance',
        resolution: '1920×1080 (Full HD)',
        targetFps: 30,
        status: 'online',
        bitrateKbps: 8400,
        uptimeSeconds: 86400,
      },
      {
        id: 'CAM-002',
        name: 'Server Room B2 Thermal Feed',
        type: 'ip',
        streamUrl: 'http://192.168.1.102/video.mjpeg',
        zone: 'Restricted Area',
        resolution: '2560×1440 (2K QHD)',
        targetFps: 30,
        status: 'online',
        bitrateKbps: 12200,
        uptimeSeconds: 172800,
      },
      {
        id: 'CAM-003',
        name: 'Assembly & Factory Floor East',
        type: 'ip',
        streamUrl: 'http://192.168.1.103/stream',
        zone: 'Factory Floor',
        resolution: '1920×1080 (Full HD)',
        targetFps: 30,
        status: 'online',
        bitrateKbps: 7600,
        uptimeSeconds: 43200,
      },
      {
        id: 'CAM-004',
        name: 'Warehouse Perimeter North',
        type: 'esp32-cam',
        streamUrl: 'http://192.168.1.104:81/stream',
        zone: 'Warehouse',
        resolution: '1280×720 (HD Edge)',
        targetFps: 25,
        status: 'online',
        bitrateKbps: 4200,
        uptimeSeconds: 95000,
      },
      {
        id: 'CAM-005',
        name: 'Executive Kitchen & Pantry',
        type: 'rtsp',
        streamUrl: 'rtsp://192.168.1.105:554/live/ch1',
        zone: 'Kitchen',
        resolution: '1920×1080 (Full HD)',
        targetFps: 30,
        status: 'online',
        bitrateKbps: 6800,
        uptimeSeconds: 61000,
      },
      {
        id: 'CAM-006',
        name: 'Balcony & Exterior Access Gate',
        type: 'rtsp',
        streamUrl: 'rtsp://192.168.1.106:554/live/ch1',
        zone: 'Balcony',
        resolution: '1920×1080 (Full HD)',
        targetFps: 30,
        status: 'online',
        bitrateKbps: 8100,
        uptimeSeconds: 120000,
      },
      {
        id: 'CAM-007',
        name: 'Operator Laptop Webcam (Local OS)',
        type: 'webcam',
        streamUrl: 'webcam://navigator.mediaDevices',
        zone: 'Restricted Area',
        resolution: '1280×720 (HD Webcam)',
        targetFps: 30,
        status: 'offline',
        bitrateKbps: 0,
        uptimeSeconds: 0,
      },
      {
        id: 'CAM-008',
        name: 'Forensic Video File Demo Feed',
        type: 'file',
        streamUrl: 'file:///assets/demo-incident-4K.mp4',
        zone: 'Warehouse',
        resolution: '3840×2160 (4K Ultra)',
        targetFps: 60,
        status: 'online',
        bitrateKbps: 24500,
        uptimeSeconds: 3600,
      },
    ];

    defaults.forEach((c) => this.cameras.set(c.id, c));
  }

  public getCameras(): CameraConfig[] {
    return Array.from(this.cameras.values());
  }

  public getCameraById(id: string): CameraConfig | undefined {
    return this.cameras.get(id);
  }

  public addOrUpdateCamera(config: CameraConfig): void {
    this.cameras.set(config.id, config);
    this.notifyListeners();
  }

  public removeCamera(id: string): void {
    this.cameras.delete(id);
    this.notifyListeners();
  }

  public async simulateReconnect(id: string): Promise<boolean> {
    const cam = this.cameras.get(id);
    if (!cam) return false;

    cam.status = 'reconnecting';
    this.notifyListeners();

    await new Promise((resolve) => setTimeout(resolve, 1500));

    cam.status = 'online';
    cam.lastError = undefined;
    cam.bitrateKbps = 7500 + Math.floor(Math.random() * 3000);
    this.cameras.set(id, cam);
    this.notifyListeners();
    return true;
  }

  public setStatus(id: string, status: CameraStatus, error?: string): void {
    const cam = this.cameras.get(id);
    if (cam) {
      cam.status = status;
      cam.lastError = error;
      this.notifyListeners();
    }
  }

  public subscribe(listener: (cameras: CameraConfig[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.getCameras());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    const list = this.getCameras();
    this.listeners.forEach((l) => l(list));
  }
}
