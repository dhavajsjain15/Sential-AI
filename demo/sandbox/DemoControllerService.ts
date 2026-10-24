// ============================================================================
// Sentinel AI — Judge / Demo Mode Sandbox Controller Service
// ============================================================================

import { SimulatorEngine } from '../../iot/simulation/SimulatorEngine';
import { DeviceManager } from '../../iot/devices/DeviceManager';
import { EventBus } from '../../iot/events/EventBus';

export type DemoCatastropheScenario =
  | 'Multi-Room Fire & Gas Leak'
  | 'Simulate Elderly Unconscious Fall with Power Failure'
  | 'Critical Perimeter Armed Intrusion'
  | 'Flash Flood & Electrical Short Circuit';

export class DemoControllerService {
  private static instance: DemoControllerService;
  private simulator: SimulatorEngine = SimulatorEngine.getInstance();
  private deviceManager: DeviceManager = DeviceManager.getInstance();
  private eventBus: EventBus = EventBus.getInstance();

  private constructor() {}

  public static getInstance(): DemoControllerService {
    if (!DemoControllerService.instance) {
      DemoControllerService.instance = new DemoControllerService();
    }
    return DemoControllerService.instance;
  }

  public triggerCatastrophe(scenario: DemoCatastropheScenario): void {
    console.log(`DemoControllerService: Injecting instant catastrophe scenario -> "${scenario}"`);

    switch (scenario) {
      case 'Multi-Room Fire & Gas Leak':
        this.simulator.setScenario('Fire');
        // Force immediate high risk jump
        const kitchen = this.deviceManager.getDevice('ESP32-SEN-002');
        if (kitchen) {
          kitchen.sensors.forEach((s) => {
            if (s.type === 'Temperature') { s.value = 58.4; s.status = 'critical'; }
            if (s.type === 'Smoke') { s.value = 0.92; s.status = 'critical'; }
            if (s.type === 'MQ2 Gas') { s.value = 640; s.status = 'critical'; }
          });
          this.deviceManager.processTelemetry({
            deviceId: kitchen.deviceId,
            timestamp: new Date().toISOString(),
            sensors: kitchen.sensors.map((s) => ({ type: s.type, value: s.value })),
          });
        }
        break;

      case 'Simulate Elderly Unconscious Fall with Power Failure':
        this.simulator.setScenario('Medical Emergency');
        const wearable = this.deviceManager.getDevice('WEAR-004');
        const gateway = this.deviceManager.getDevice('GW-NODE-003');
        if (wearable) {
          wearable.sensors.forEach((s) => {
            if (s.type === 'Pulse Sensor') { s.value = 42; s.status = 'critical'; }
            if (s.type === 'PIR Motion') { s.value = 0; s.status = 'critical'; }
          });
          this.deviceManager.processTelemetry({
            deviceId: wearable.deviceId,
            timestamp: new Date().toISOString(),
            sensors: wearable.sensors.map((s) => ({ type: s.type, value: s.value })),
          });
        }
        if (gateway) {
          gateway.sensors.forEach((s) => {
            if (s.type === 'Voltage') { s.value = 0; s.status = 'critical'; }
          });
          this.deviceManager.processTelemetry({
            deviceId: gateway.deviceId,
            timestamp: new Date().toISOString(),
            sensors: gateway.sensors.map((s) => ({ type: s.type, value: s.value })),
          });
        }
        break;

      case 'Critical Perimeter Armed Intrusion':
        this.simulator.setScenario('Intrusion');
        break;

      case 'Flash Flood & Electrical Short Circuit':
        this.simulator.setScenario('Flood');
        break;
    }
  }

  public resetToSafeState(): void {
    console.log('DemoControllerService: Executing instant under-500ms safe state wipe...');
    this.simulator.setScenario('None');
    this.eventBus.clearHistory();
    this.eventBus.publish('SIMULATION_SCENARIO_CHANGED', { scenario: 'None', reset: true }, undefined, 'normal');
  }
}
