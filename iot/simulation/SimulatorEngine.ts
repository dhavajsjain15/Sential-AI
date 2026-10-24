// ============================================================================
// Sentinel AI — IoT Simulation Engine
// ============================================================================

import { IoTSimulationConfig } from '../models';
import { DeviceManager } from '../devices/DeviceManager';
import { EventBus } from '../events/EventBus';
import { SensorFusionEngine } from '../sensors/SensorFusionEngine';

export class SimulatorEngine {
  private static instance: SimulatorEngine;
  private config: IoTSimulationConfig = {
    activeScenario: 'None',
    tickRateMs: 2000,
    autoEscalate: true,
    noiseVariancePercentage: 5,
  };
  private timer: any = null;
  private deviceManager: DeviceManager = DeviceManager.getInstance();
  private eventBus: EventBus = EventBus.getInstance();
  private fusionEngine: SensorFusionEngine = SensorFusionEngine.getInstance();
  private tickCount: number = 0;

  private constructor() {}

  public static getInstance(): SimulatorEngine {
    if (!SimulatorEngine.instance) {
      SimulatorEngine.instance = new SimulatorEngine();
    }
    return SimulatorEngine.instance;
  }

  public setScenario(scenario: IoTSimulationConfig['activeScenario']): void {
    this.config.activeScenario = scenario;
    this.tickCount = 0;
    this.eventBus.publish('SIMULATION_SCENARIO_CHANGED', { scenario, timestamp: new Date().toISOString() }, undefined, 'warning');

    if (scenario === 'None') {
      this.stopSimulation();
      this.resetDevicesToNominal();
    } else {
      this.startSimulation();
    }
  }

  public getConfig(): IoTSimulationConfig {
    return { ...this.config };
  }

  public startSimulation(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.tick(), this.config.tickRateMs);
  }

  public stopSimulation(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick(): void {
    this.tickCount++;
    const scenario = this.config.activeScenario;
    if (scenario === 'None') return;

    const allDevices = this.deviceManager.getAllDevices();
    const kitchenNode = allDevices.find((d) => d.deviceId === 'ESP32-SEN-002') || allDevices[0];
    const cameraNode = allDevices.find((d) => d.deviceId === 'ESP32-CAM-001') || allDevices[1];
    const gatewayNode = allDevices.find((d) => d.deviceId === 'GW-NODE-003') || allDevices[2];
    const wearableNode = allDevices.find((d) => d.deviceId === 'WEAR-004') || allDevices[3];

    switch (scenario) {
      case 'Fire':
        if (kitchenNode) {
          const tempSensor = kitchenNode.sensors.find((s) => s.type === 'Temperature');
          const smokeSensor = kitchenNode.sensors.find((s) => s.type === 'Smoke');
          if (tempSensor) {
            tempSensor.value = Math.min(120, 32 + this.tickCount * 8);
            tempSensor.status = tempSensor.value > 45 ? 'critical' : 'warning';
          }
          if (smokeSensor) {
            smokeSensor.value = Math.min(1.5, Number(smokeSensor.value) + 0.15);
            smokeSensor.status = Number(smokeSensor.value) > 0.4 ? 'critical' : 'warning';
          }
          this.deviceManager.processTelemetry({
            deviceId: kitchenNode.deviceId,
            timestamp: new Date().toISOString(),
            sensors: kitchenNode.sensors.map((s) => ({ type: s.type, value: s.value })),
          });
          if (this.tickCount >= 3 && cameraNode) {
            this.fusionEngine.evaluateFusion(kitchenNode, ['Fire', 'Open Flame']);
          }
        }
        break;

      case 'Gas Leak':
        if (kitchenNode) {
          const gasSensor = kitchenNode.sensors.find((s) => s.type === 'MQ2 Gas');
          if (gasSensor) {
            gasSensor.value = Math.min(2500, Number(gasSensor.value) + 350);
            gasSensor.status = Number(gasSensor.value) > 400 ? 'critical' : 'warning';
          }
          this.deviceManager.processTelemetry({
            deviceId: kitchenNode.deviceId,
            timestamp: new Date().toISOString(),
            sensors: kitchenNode.sensors.map((s) => ({ type: s.type, value: s.value })),
          });
        }
        break;

      case 'Medical Emergency':
        if (wearableNode) {
          const pulse = wearableNode.sensors.find((s) => s.type === 'Pulse Sensor');
          const pir = wearableNode.sensors.find((s) => s.type === 'PIR Motion');
          if (pulse) {
            pulse.value = this.tickCount % 2 === 0 ? 142 : 44; // Arrhythmia/tachycardia
            pulse.status = 'critical';
          }
          if (pir) {
            pir.value = 0;
            pir.status = 'critical';
          }
          this.fusionEngine.evaluateFusion(wearableNode, ['Collapsed Subject', 'Unconscious Person']);
          this.deviceManager.processTelemetry({
            deviceId: wearableNode.deviceId,
            timestamp: new Date().toISOString(),
            sensors: wearableNode.sensors.map((s) => ({ type: s.type, value: s.value })),
          });
        }
        break;

      case 'Power Failure':
        if (gatewayNode) {
          const volt = gatewayNode.sensors.find((s) => s.type === 'Voltage');
          if (volt) {
            volt.value = Math.max(0, 223 - this.tickCount * 65);
            volt.status = volt.value < 180 ? 'critical' : 'warning';
          }
          this.deviceManager.processTelemetry({
            deviceId: gatewayNode.deviceId,
            timestamp: new Date().toISOString(),
            sensors: gatewayNode.sensors.map((s) => ({ type: s.type, value: s.value })),
          });
        }
        break;

      case 'Flood':
        if (kitchenNode) {
          let water = kitchenNode.sensors.find((s) => s.type === 'Water Level');
          if (!water) {
            water = { sensorId: 'SEN-KIT-WTR', type: 'Water Level', value: 0, unit: 'cm', status: 'normal', timestamp: new Date().toISOString() };
            kitchenNode.sensors.push(water);
          }
          water.value = Math.min(45, Number(water.value) + 8);
          water.status = Number(water.value) > 10 ? 'critical' : 'warning';

          let door = kitchenNode.sensors.find((s) => s.type === 'Door Sensor');
          if (!door) {
            door = { sensorId: 'SEN-KIT-DOR', type: 'Door Sensor', value: 'Open', unit: 'Binary', status: 'warning', timestamp: new Date().toISOString() };
            kitchenNode.sensors.push(door);
          }
          this.fusionEngine.evaluateFusion(kitchenNode);
          this.deviceManager.processTelemetry({
            deviceId: kitchenNode.deviceId,
            timestamp: new Date().toISOString(),
            sensors: kitchenNode.sensors.map((s) => ({ type: s.type, value: s.value })),
          });
        }
        break;

      case 'Intrusion':
        if (cameraNode) {
          this.fusionEngine.evaluateFusion(cameraNode, ['Masked Intruder', 'Crowbar Weapon']);
        }
        break;

      case 'Device Offline':
        if (kitchenNode && kitchenNode.status !== 'offline') {
          kitchenNode.status = 'offline';
          this.eventBus.publish('DEVICE_OFFLINE', { deviceId: kitchenNode.deviceId, reason: 'Simulated Network Loss' }, kitchenNode.deviceId, 'warning');
        }
        break;

      case 'Battery Low':
        if (cameraNode) {
          cameraNode.battery = Math.max(2, cameraNode.battery - 12);
          cameraNode.status = cameraNode.battery < 15 ? 'warning' : 'online';
          this.eventBus.publish('TELEMETRY_UPDATED', cameraNode, cameraNode.deviceId, 'warning');
        }
        break;
    }
  }

  private resetDevicesToNominal(): void {
    this.deviceManager.getAllDevices().forEach((d) => {
      d.status = 'online';
      d.battery = 98;
      d.sensors.forEach((s) => {
        s.status = 'normal';
        if (s.type === 'Temperature') s.value = 24.5;
        if (s.type === 'Smoke') s.value = 0.04;
        if (s.type === 'MQ2 Gas') s.value = 18.0;
        if (s.type === 'Voltage') s.value = 223.0;
        if (s.type === 'Water Level') s.value = 0;
      });
      this.eventBus.publish('TELEMETRY_UPDATED', d, d.deviceId, 'normal');
    });
  }
}
