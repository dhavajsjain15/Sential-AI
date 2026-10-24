// ============================================================================
// Sentinel AI — IoT Device Manager Service
// ============================================================================

import { IoTDevice, IoTDeviceType, IoTSensorMetric, IoTTelemetryPayload } from '../models';
import { EventBus } from '../events/EventBus';
import { SensorFusionEngine } from '../sensors/SensorFusionEngine';
import { OfflineQueueManager } from '../sensors/OfflineQueueManager';

export class DeviceManager {
  private static instance: DeviceManager;
  private devices: Map<string, IoTDevice> = new Map();
  private eventBus: EventBus = EventBus.getInstance();
  private fusionEngine: SensorFusionEngine = SensorFusionEngine.getInstance();
  private offlineQueue: OfflineQueueManager = OfflineQueueManager.getInstance();

  private constructor() {
    this.seedInitialDevices();
  }

  public static getInstance(): DeviceManager {
    if (!DeviceManager.instance) {
      DeviceManager.instance = new DeviceManager();
    }
    return DeviceManager.instance;
  }

  private seedInitialDevices(): void {
    const initialList: IoTDevice[] = [
      {
        deviceId: 'ESP32-CAM-001',
        name: 'Main Atrium Vision & Optical Node',
        type: 'ESP32 Camera Node',
        location: 'Main Atrium',
        battery: 98,
        signalStrength: -52,
        firmwareVersion: 'v2.4.1-PROD',
        lastSeen: new Date().toISOString(),
        status: 'online',
        health: {
          cpuLoadPercentage: 34,
          freeHeapBytes: 184020,
          uptimeSeconds: 342900,
          packetLossPercentage: 0.02,
          latencyMs: 12,
        },
        sensors: [
          { sensorId: 'SEN-CAM-LDR', type: 'LDR', value: 840, unit: 'Lux', status: 'normal', timestamp: new Date().toISOString() },
          { sensorId: 'SEN-CAM-TEMP', type: 'Temperature', value: 31.2, unit: '°C', status: 'normal', timestamp: new Date().toISOString() },
        ],
        isSimulated: false,
      },
      {
        deviceId: 'ESP32-SEN-002',
        name: 'Kitchen Multi-Hazard Telemetry Hub',
        type: 'ESP32 Sensor Node',
        location: 'Kitchen',
        battery: 92,
        signalStrength: -58,
        firmwareVersion: 'v2.4.1-PROD',
        lastSeen: new Date().toISOString(),
        status: 'online',
        health: {
          cpuLoadPercentage: 18,
          freeHeapBytes: 214500,
          uptimeSeconds: 512000,
          packetLossPercentage: 0.0,
          latencyMs: 8,
        },
        sensors: [
          { sensorId: 'SEN-MQ2-001', type: 'MQ2 Gas', value: 3.1, unit: 'ppm', status: 'normal', timestamp: new Date().toISOString() },
          { sensorId: 'SEN-SMK-002', type: 'Smoke', value: 0.08, unit: '%/ft', status: 'normal', timestamp: new Date().toISOString() },
          { sensorId: 'SEN-TMP-003', type: 'Temperature', value: 32.4, unit: '°C', status: 'normal', timestamp: new Date().toISOString() },
          { sensorId: 'SEN-HUM-004', type: 'Humidity', value: 58.0, unit: '%', status: 'normal', timestamp: new Date().toISOString() },
        ],
        isSimulated: false,
      },
      {
        deviceId: 'GW-NODE-003',
        name: 'Central Building IoT Mesh Gateway',
        type: 'Gateway Node',
        location: 'Server Room B1',
        battery: 100,
        signalStrength: -44,
        firmwareVersion: 'v3.0.0-PROD',
        lastSeen: new Date().toISOString(),
        status: 'online',
        health: {
          cpuLoadPercentage: 42,
          freeHeapBytes: 524288,
          uptimeSeconds: 1209600,
          packetLossPercentage: 0.0,
          latencyMs: 4,
        },
        sensors: [
          { sensorId: 'SEN-GW-VOLT', type: 'Voltage', value: 223.4, unit: 'V', status: 'normal', timestamp: new Date().toISOString() },
          { sensorId: 'SEN-GW-CURR', type: 'Current', value: 12.8, unit: 'A', status: 'normal', timestamp: new Date().toISOString() },
        ],
        isSimulated: false,
      },
      {
        deviceId: 'WEAR-004',
        name: 'Executive Personnel Safety Wearable',
        type: 'Wearables',
        location: 'Executive Wing',
        battery: 84,
        signalStrength: -64,
        firmwareVersion: 'v1.8.2-BLE',
        lastSeen: new Date().toISOString(),
        status: 'online',
        health: {
          cpuLoadPercentage: 12,
          freeHeapBytes: 98304,
          uptimeSeconds: 86400,
          packetLossPercentage: 0.1,
          latencyMs: 24,
        },
        sensors: [
          { sensorId: 'SEN-WEAR-PULSE', type: 'Pulse Sensor', value: 76, unit: 'BPM', status: 'normal', timestamp: new Date().toISOString() },
          { sensorId: 'SEN-WEAR-PIR', type: 'PIR Motion', value: 'Active', unit: 'Binary', status: 'normal', timestamp: new Date().toISOString() },
        ],
        isSimulated: false,
      },
      {
        deviceId: 'DRONE-005',
        name: 'Autonomous Perimeter Patrol Drone Alpha',
        type: 'Drone',
        location: 'Roof Landing Pad',
        battery: 95,
        signalStrength: -48,
        firmwareVersion: 'v4.1.0-AERO',
        lastSeen: new Date().toISOString(),
        status: 'online',
        health: {
          cpuLoadPercentage: 68,
          freeHeapBytes: 1048576,
          uptimeSeconds: 43200,
          packetLossPercentage: 0.05,
          latencyMs: 38,
        },
        sensors: [
          { sensorId: 'SEN-DRN-GPS', type: 'GPS', value: '37.7749,-122.4194', unit: 'Lat/Long', status: 'normal', timestamp: new Date().toISOString() },
          { sensorId: 'SEN-DRN-MIC', type: 'Microphone', value: 42, unit: 'dB', status: 'normal', timestamp: new Date().toISOString() },
        ],
        isSimulated: false,
      },
    ];

    initialList.forEach((d) => this.devices.set(d.deviceId, d));
  }

  public registerDevice(device: IoTDevice): IoTDevice {
    this.devices.set(device.deviceId, device);
    this.eventBus.publish('DEVICE_REGISTERED', device, device.deviceId, 'normal');
    return device;
  }

  public getDevice(deviceId: string): IoTDevice | undefined {
    return this.devices.get(deviceId);
  }

  public getAllDevices(): IoTDevice[] {
    return Array.from(this.devices.values());
  }

  public processTelemetry(payload: IoTTelemetryPayload): boolean {
    const device = this.devices.get(payload.deviceId);
    if (!device) {
      this.offlineQueue.enqueueItem('telemetry', payload);
      return false;
    }

    device.lastSeen = payload.timestamp || new Date().toISOString();
    if (typeof payload.battery === 'number') device.battery = payload.battery;
    if (typeof payload.rssi === 'number') device.signalStrength = payload.rssi;

    payload.sensors.forEach((incomingSensor) => {
      const existing = device.sensors.find((s) => s.type === incomingSensor.type);
      if (existing) {
        existing.value = incomingSensor.value;
        existing.timestamp = device.lastSeen;
        if (incomingSensor.rawAdc !== undefined) existing.rawAdc = incomingSensor.rawAdc;

        // Check threshold calibration
        if (typeof incomingSensor.value === 'number') {
          if (existing.type === 'Smoke' || existing.type === 'MQ2 Gas') {
            existing.status = incomingSensor.value > (existing.calibratedThreshold ?? 400) ? 'critical' : incomingSensor.value > 150 ? 'warning' : 'normal';
          } else if (existing.type === 'Temperature') {
            existing.status = incomingSensor.value > (existing.calibratedThreshold ?? 45) ? 'critical' : incomingSensor.value > 38 ? 'warning' : 'normal';
          } else if (existing.type === 'Water Level') {
            existing.status = incomingSensor.value > (existing.calibratedThreshold ?? 10) ? 'critical' : 'normal';
          }
        }
      } else {
        device.sensors.push({
          sensorId: `SEN-${payload.deviceId}-${incomingSensor.type}`,
          type: incomingSensor.type,
          value: incomingSensor.value,
          unit: this.getDefaultUnit(incomingSensor.type),
          status: 'normal',
          timestamp: device.lastSeen,
        });
      }
    });

    // Run fusion evaluation
    this.fusionEngine.evaluateFusion(device);
    this.eventBus.publish('TELEMETRY_UPDATED', device, device.deviceId, 'normal');
    return true;
  }

  public updateDeviceLocation(deviceId: string, newLocation: string): boolean {
    const device = this.devices.get(deviceId);
    if (device) {
      device.location = newLocation;
      this.eventBus.publish('TELEMETRY_UPDATED', device, deviceId, 'normal');
      return true;
    }
    return false;
  }

  public calibrateSensorThreshold(deviceId: string, sensorType: string, newThreshold: number): boolean {
    const device = this.devices.get(deviceId);
    if (device) {
      const sensor = device.sensors.find((s) => s.type === sensorType);
      if (sensor) {
        sensor.calibratedThreshold = newThreshold;
        this.eventBus.publish('TELEMETRY_UPDATED', device, deviceId, 'normal');
        return true;
      }
    }
    return false;
  }

  public restartDeviceRemote(deviceId: string): boolean {
    const device = this.devices.get(deviceId);
    if (device) {
      device.status = 'warning';
      this.eventBus.publish('DEVICE_OFFLINE', { deviceId, reason: 'Remote restart initiated' }, deviceId, 'warning');
      setTimeout(() => {
        if (this.devices.has(deviceId)) {
          const d = this.devices.get(deviceId)!;
          d.status = 'online';
          d.health.uptimeSeconds = 0;
          this.eventBus.publish('DEVICE_ONLINE', d, deviceId, 'normal');
        }
      }, 3000);
      return true;
    }
    return false;
  }

  public startFirmwareUpdate(deviceId: string, targetVersion: string): boolean {
    const device = this.devices.get(deviceId);
    if (device) {
      device.status = 'warning';
      this.eventBus.publish('FIRMWARE_UPDATE_STARTED', { deviceId, targetVersion }, deviceId, 'warning');
      setTimeout(() => {
        if (this.devices.has(deviceId)) {
          const d = this.devices.get(deviceId)!;
          d.firmwareVersion = targetVersion;
          d.status = 'online';
          this.eventBus.publish('FIRMWARE_UPDATE_COMPLETED', d, deviceId, 'normal');
        }
      }, 4000);
      return true;
    }
    return false;
  }

  private getDefaultUnit(type: string): string {
    switch (type) {
      case 'MQ2 Gas': return 'ppm';
      case 'Smoke': return '%/ft';
      case 'Temperature': return '°C';
      case 'Humidity': return '%';
      case 'Current': return 'A';
      case 'Voltage': return 'V';
      case 'Microphone': return 'dB';
      case 'LDR': return 'Lux';
      case 'Pulse Sensor': return 'BPM';
      default: return 'Units';
    }
  }
}
