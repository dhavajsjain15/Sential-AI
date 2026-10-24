export type CameraType = 'webcam' | 'usb' | 'ip' | 'esp32-cam' | 'rtsp' | 'file';
export type CameraStatus = 'online' | 'connecting' | 'reconnecting' | 'error' | 'offline';
export type RiskZoneType = 'Kitchen' | 'Bedroom' | 'Garage' | 'Entrance' | 'Balcony' | 'Factory Floor' | 'Warehouse' | 'Restricted Area';
export type DetectionClass =
  | 'Person'
  | 'Fire'
  | 'Smoke'
  | 'Fall'
  | 'Lying Person'
  | 'Dog'
  | 'Cat'
  | 'Vehicle'
  | 'Helmet'
  | 'Safety Vest'
  | 'Door'
  | 'Window'
  | 'Weapon'
  | 'Violence';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface BoundingBox {
  x: number;      // normalized 0-1
  y: number;      // normalized 0-1
  width: number;  // normalized 0-1
  height: number; // normalized 0-1
}

export interface TrackingPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface ObjectTrackingData {
  trackingId: string;
  className: DetectionClass;
  firstSeen: number;
  lastSeen: number;
  durationSeconds: number;
  path: TrackingPoint[];
  currentZone: RiskZoneType;
}

export interface Detection {
  id: string;
  className: DetectionClass;
  confidence: number;       // 0 to 100
  box: BoundingBox;
  trackingId: string;
  riskContribution: number; // 0 to 100
  severity: SeverityLevel;
  timestamp: number;
  zone: RiskZoneType;
}

export interface CameraConfig {
  id: string;
  name: string;
  type: CameraType;
  streamUrl: string;
  zone: RiskZoneType;
  resolution: string;
  targetFps: number;
  status: CameraStatus;
  bitrateKbps: number;
  lastError?: string;
  uptimeSeconds: number;
}

export interface VisionEvent {
  id: string;
  timestamp: number;
  cameraId: string;
  cameraName: string;
  zone: RiskZoneType;
  eventType: string; // e.g. 'Person Entered', 'Fire Detected', 'Smoke Increasing', 'Fall Detected'
  description: string;
  severity: SeverityLevel;
  detections: Detection[];
  acknowledged: boolean;
}

export interface AlertRule {
  id: string;
  name: string;
  conditionDescription: string;
  severity: SeverityLevel;
  enabled: boolean;
  evaluate: (detections: Detection[], activeEvents: VisionEvent[], camera: CameraConfig) => {
    triggered: boolean;
    reason?: string;
  };
}

export interface VideoSnapshot {
  id: string;
  timestamp: number;
  cameraId: string;
  cameraName: string;
  zone: RiskZoneType;
  riskScore: number;
  incidentId?: string;
  imageUrl: string;       // Simulated or base64 frame
  detectionsCount: number;
  triggerType: 'Critical Incident' | 'Manual Capture' | 'Scheduled Capture';
}

export interface RecordingState {
  isRecording: boolean;
  cameraId?: string;
  startTime?: number;
  elapsedSeconds: number;
  fileSizeMb: number;
  autoTriggered: boolean;
  cloudUploadStatus: 'idle' | 'uploading' | 'synced' | 'error';
}

export interface VisionAnalyticsSummary {
  detectionsPerHour: { hour: string; count: number }[];
  mostActiveCamera: { cameraId: string; cameraName: string; totalDetections: number };
  incidentFrequency: { type: string; count: number }[];
  averageConfidence: number;
  totalCamerasOnline: number;
  averageUptimePercentage: number;
}

export interface IYoloAdapter {
  name: string;
  version: string;
  isReady: boolean;
  initialize: () => Promise<void>;
  detect: (frameData?: ImageData | string, scenario?: string, camera?: CameraConfig) => Promise<{
    detections: Detection[];
    inferenceTimeMs: number;
    fps: number;
  }>;
}
