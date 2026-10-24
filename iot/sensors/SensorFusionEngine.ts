// ============================================================================
// Sentinel AI — IoT Sensor Fusion Engine
// ============================================================================

import { IoTDevice, IoTSensorMetric } from '../models';
import { EventBus } from '../events/EventBus';
import { SupportedIncidentType } from '../../ai/gemini/types';

export interface SensorFusionResult {
  triggered: boolean;
  incidentType?: SupportedIncidentType;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  title: string;
  reasoning: string[];
  involvedSensors: IoTSensorMetric[];
  deviceId: string;
  room: string;
}

export class SensorFusionEngine {
  private static instance: SensorFusionEngine;
  private eventBus: EventBus = EventBus.getInstance();

  private constructor() {}

  public static getInstance(): SensorFusionEngine {
    if (!SensorFusionEngine.instance) {
      SensorFusionEngine.instance = new SensorFusionEngine();
    }
    return SensorFusionEngine.instance;
  }

  /**
   * Evaluates sensor metrics combined with optical camera detections or time context.
   */
  public evaluateFusion(device: IoTDevice, cameraLabels: string[] = []): SensorFusionResult | null {
    const sensors = device.sensors;
    const room = device.location || 'Monitored Zone';

    const getMetric = (type: string) => sensors.find((s) => s.type.toLowerCase().includes(type.toLowerCase()));

    const smoke = getMetric('smoke') || getMetric('mq2');
    const temp = getMetric('temperature');
    const motion = getMetric('motion') || getMetric('pir');
    const ultrasonic = getMetric('ultrasonic') || getMetric('pulse');
    const water = getMetric('water');
    const door = getMetric('door') || getMetric('window');
    const gas = getMetric('gas');

    // 1. Smoke + High Temperature + Fire Detection → Critical Fire
    const isHighTemp = temp && typeof temp.value === 'number' && temp.value > 45; // >45°C or >113°F
    const isSmokeHigh = smoke && smoke.status !== 'normal';
    const isFireCamera = cameraLabels.some((l) => l.toLowerCase().includes('fire') || l.toLowerCase().includes('flame'));

    if ((isSmokeHigh && isHighTemp) || (isSmokeHigh && isFireCamera) || (isHighTemp && isFireCamera)) {
      const result: SensorFusionResult = {
        triggered: true,
        incidentType: 'Fire',
        severity: 'CRITICAL',
        title: `Critical Fire Anomaly — ${room}`,
        reasoning: [
          'Sensor fusion rule triggered: Smoke + High Temperature / Optical Fire Detection.',
          `Thermal reading at ${temp?.value || 'High'} with smoke state ${smoke?.status.toUpperCase() || 'HIGH'}.`,
        ],
        involvedSensors: [smoke, temp].filter(Boolean) as IoTSensorMetric[],
        deviceId: device.deviceId,
        room,
      };
      this.eventBus.publish('FUSION_INCIDENT_TRIGGERED', result, device.deviceId, 'critical');
      return result;
    }

    // 2. No Movement + Fall Detection → Medical Emergency
    const isStatic = motion && (motion.value === 0 || String(motion.value).toLowerCase() === 'none' || String(motion.value).toLowerCase() === 'inactive');
    const isFallCamera = cameraLabels.some((l) => l.toLowerCase().includes('fall') || l.toLowerCase().includes('collapsed') || l.toLowerCase().includes('unconscious'));

    if (isStatic && isFallCamera) {
      const result: SensorFusionResult = {
        triggered: true,
        incidentType: 'Medical Emergency',
        severity: 'CRITICAL',
        title: `Medical Emergency & Fall Triage — ${room}`,
        reasoning: [
          'Sensor fusion rule triggered: No Movement + Fall Detection.',
          'Subject detected recumbent/collapsed without active bodily motion after impact.',
        ],
        involvedSensors: [motion].filter(Boolean) as IoTSensorMetric[],
        deviceId: device.deviceId,
        room,
      };
      this.eventBus.publish('FUSION_INCIDENT_TRIGGERED', result, device.deviceId, 'critical');
      return result;
    }

    // 3. Water + Door Open → Flood Alert
    const isWaterHigh = water && water.status !== 'normal';
    const isDoorOpen = door && (String(door.value).toLowerCase() === 'open' || door.status === 'warning');

    if (isWaterHigh && isDoorOpen) {
      const result: SensorFusionResult = {
        triggered: true,
        incidentType: 'Flood',
        severity: 'HIGH',
        title: `Flood & Water Breach Alert — ${room}`,
        reasoning: [
          'Sensor fusion rule triggered: Water Level High + Door/Access Open.',
          `Water sensor reported ${water.value} while doorway perimeter breached.`,
        ],
        involvedSensors: [water, door].filter(Boolean) as IoTSensorMetric[],
        deviceId: device.deviceId,
        room,
      };
      this.eventBus.publish('FUSION_INCIDENT_TRIGGERED', result, device.deviceId, 'critical');
      return result;
    }

    // 4. Motion + Night + Restricted Zone → Security Alert
    const currentHour = new Date().getHours();
    const isNight = currentHour < 6 || currentHour >= 22;
    const isMotionActive = motion && (motion.value === 1 || String(motion.value).toLowerCase() === 'active' || String(motion.value).toLowerCase() === 'detected');
    const isRestricted = room.toLowerCase().includes('executive') || room.toLowerCase().includes('server') || room.toLowerCase().includes('penthouse') || room.toLowerCase().includes('vault');

    if (isMotionActive && isNight && isRestricted) {
      const result: SensorFusionResult = {
        triggered: true,
        incidentType: 'Intrusion',
        severity: 'HIGH',
        title: `Security Breach in Restricted Zone — ${room}`,
        reasoning: [
          'Sensor fusion rule triggered: Motion + Night Hours + Restricted Zone.',
          `Unauthorized movement detected at ${new Date().toLocaleTimeString()} during curfew protocol.`,
        ],
        involvedSensors: [motion].filter(Boolean) as IoTSensorMetric[],
        deviceId: device.deviceId,
        room,
      };
      this.eventBus.publish('FUSION_INCIDENT_TRIGGERED', result, device.deviceId, 'critical');
      return result;
    }

    // 5. High Gas Leak check
    if (gas && gas.status === 'critical') {
      const result: SensorFusionResult = {
        triggered: true,
        incidentType: 'Gas Leak',
        severity: 'CRITICAL',
        title: `Toxic Gas Buildup Alert — ${room}`,
        reasoning: [
          `Gas concentration breached critical safety limit (${gas.value} ${gas.unit}).`,
        ],
        involvedSensors: [gas],
        deviceId: device.deviceId,
        room,
      };
      this.eventBus.publish('FUSION_INCIDENT_TRIGGERED', result, device.deviceId, 'critical');
      return result;
    }

    return null;
  }
}
