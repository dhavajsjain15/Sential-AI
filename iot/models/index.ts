// ============================================================================
// Sentinel AI — IoT & Hardware Telemetry Models
// ============================================================================

export type IoTDeviceType =
  | 'ESP32 Camera Node'
  | 'ESP32 Sensor Node'
  | 'Gateway Node'
  | 'Wearables'
  | 'Smartwatch'
  | 'Drone';

export type IoTSensorType =
  | 'MQ2 Gas'
  | 'Smoke'
  | 'Temperature'
  | 'Humidity'
  | 'PIR Motion'
  | 'Ultrasonic'
  | 'Water Level'
  | 'Door Sensor'
  | 'Window Sensor'
  | 'Current'
  | 'Voltage'
  | 'LDR'
  | 'Microphone'
  | 'GPS'
  | 'Pulse Sensor';

export type IoTDeviceStatus = 'online' | 'offline' | 'warning' | 'critical' | 'calibrating';

export interface IoTSensorMetric {
  sensorId: string;
  type: IoTSensorType;
  value: number | string;
  unit: string;
  rawAdc?: number;
  status: 'normal' | 'warning' | 'critical';
  calibratedThreshold?: number;
  timestamp: string;
}

export interface IoTDevice {
  deviceId: string;
  name: string;
  type: IoTDeviceType;
  location: string; // Room / Zone
  battery: number; // 0-100%
  signalStrength: number; // RSSI in dBm (e.g. -55)
  firmwareVersion: string;
  lastSeen: string;
  status: IoTDeviceStatus;
  health: {
    cpuLoadPercentage: number;
    freeHeapBytes: number;
    uptimeSeconds: number;
    packetLossPercentage: number;
    latencyMs: number;
  };
  sensors: IoTSensorMetric[];
  isSimulated?: boolean;
}

export interface IoTTelemetryPayload {
  deviceId: string;
  timestamp: string;
  sensors: Array<{
    type: IoTSensorType;
    value: number | string;
    rawAdc?: number;
  }>;
  battery?: number;
  rssi?: number;
}

export interface IoTSnapshotPayload {
  deviceId: string;
  timestamp: string;
  base64ImageOrUrl: string;
  resolution: string;
  fps?: number;
  detections?: Array<{
    label: string;
    confidence: number;
    box: [number, number, number, number];
  }>;
}

export interface IoTHeartbeatPayload {
  deviceId: string;
  timestamp: string;
  uptimeSeconds: number;
  freeHeapBytes: number;
  rssi: number;
  status: IoTDeviceStatus;
}

export interface IoTIncidentUploadPayload {
  deviceId: string;
  timestamp: string;
  triggerSensor: IoTSensorType;
  triggerValue: string | number;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  snapshotUrl?: string;
}

export interface IoTEscalationLevel {
  level: 1 | 2 | 3 | 4 | 5;
  name: 'Owner' | 'Family' | 'Security' | 'Community' | 'Emergency Services';
  delaySeconds: number;
  notified: boolean;
  timestamp?: string;
  contactChannel: string;
}

export interface IoTOfflineQueueItem {
  id: string;
  type: 'telemetry' | 'snapshot' | 'heartbeat' | 'incident';
  payload: any;
  queuedAt: string;
  attempts: number;
}

export interface IoTSimulationConfig {
  activeScenario: 'None' | 'Gas Leak' | 'Fire' | 'Medical Emergency' | 'Power Failure' | 'Flood' | 'Intrusion' | 'Device Offline' | 'Battery Low';
  tickRateMs: number;
  autoEscalate: boolean;
  noiseVariancePercentage: number;
}
