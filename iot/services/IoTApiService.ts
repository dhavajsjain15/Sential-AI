// ============================================================================
// Sentinel AI — IoT REST & FastAPI Endpoint Services
// ============================================================================

import {
  IoTDevice,
  IoTHeartbeatPayload,
  IoTIncidentUploadPayload,
  IoTSnapshotPayload,
  IoTTelemetryPayload,
} from '../models';
import { DeviceManager } from '../devices/DeviceManager';
import { EventBus } from '../events/EventBus';
import { OfflineQueueManager } from '../sensors/OfflineQueueManager';

export class IoTApiService {
  private static instance: IoTApiService;
  private deviceManager: DeviceManager = DeviceManager.getInstance();
  private eventBus: EventBus = EventBus.getInstance();
  private offlineQueue: OfflineQueueManager = OfflineQueueManager.getInstance();

  private constructor() {}

  public static getInstance(): IoTApiService {
    if (!IoTApiService.instance) {
      IoTApiService.instance = new IoTApiService();
    }
    return IoTApiService.instance;
  }

  // POST /api/v1/devices/register
  public async handleDeviceRegistration(device: IoTDevice): Promise<{ success: boolean; deviceId: string; message: string }> {
    try {
      this.deviceManager.registerDevice(device);
      return {
        success: true,
        deviceId: device.deviceId,
        message: `Device ${device.name} successfully registered across mesh network.`,
      };
    } catch (err: any) {
      return { success: false, deviceId: device.deviceId, message: err.message || 'Registration failed' };
    }
  }

  // POST /api/v1/devices/{id}/heartbeat
  public async handleHeartbeat(payload: IoTHeartbeatPayload): Promise<{ success: boolean; status: string }> {
    const device = this.deviceManager.getDevice(payload.deviceId);
    if (device) {
      device.lastSeen = payload.timestamp || new Date().toISOString();
      device.status = payload.status;
      device.health.uptimeSeconds = payload.uptimeSeconds;
      device.health.freeHeapBytes = payload.freeHeapBytes;
      device.signalStrength = payload.rssi;
      this.eventBus.publish('DEVICE_ONLINE', device, device.deviceId, 'normal');
      return { success: true, status: 'acknowledged' };
    }
    return { success: false, status: 'device_not_found' };
  }

  // POST /api/v1/devices/{id}/telemetry
  public async handleTelemetryUpload(payload: IoTTelemetryPayload): Promise<{ success: boolean; queued: boolean }> {
    const processed = this.deviceManager.processTelemetry(payload);
    if (!processed) {
      this.offlineQueue.enqueueItem('telemetry', payload);
      return { success: true, queued: true };
    }
    return { success: true, queued: false };
  }

  // POST /api/v1/devices/{id}/snapshot
  public async handleSnapshotUpload(payload: IoTSnapshotPayload): Promise<{ success: boolean; detectionCount: number }> {
    this.eventBus.publish('TELEMETRY_UPDATED', {
      deviceId: payload.deviceId,
      snapshotUrl: payload.base64ImageOrUrl,
      detections: payload.detections || [],
      timestamp: payload.timestamp,
    }, payload.deviceId, 'normal');

    return { success: true, detectionCount: payload.detections?.length || 0 };
  }

  // POST /api/v1/incidents/upload
  public async handleIncidentUpload(payload: IoTIncidentUploadPayload): Promise<{ success: boolean; incidentId: string }> {
    const incidentId = `INC-IOT-${Date.now().toString().slice(-6)}`;
    this.eventBus.publish('FUSION_INCIDENT_TRIGGERED', {
      incidentId,
      ...payload,
    }, payload.deviceId, 'critical');

    return { success: true, incidentId };
  }

  // GET /api/v1/devices
  public async handleGetDevices(): Promise<IoTDevice[]> {
    return this.deviceManager.getAllDevices();
  }

  // GET /api/v1/devices/{id}/health
  public async handleGetDeviceHealth(deviceId: string): Promise<IoTDevice['health'] | null> {
    const device = this.deviceManager.getDevice(deviceId);
    return device ? device.health : null;
  }
}
