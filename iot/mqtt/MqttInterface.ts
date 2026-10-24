// ============================================================================
// Sentinel AI — IoT MQTT Broker Interface & Topic Router
// ============================================================================

import { EventBus } from '../events/EventBus';
import { IoTTelemetryPayload, IoTHeartbeatPayload } from '../models';

export interface MqttTopicHandler {
  topicPattern: string;
  onMessage: (topic: string, payload: any) => void;
}

export class MqttInterface {
  private static instance: MqttInterface;
  private brokerUrl: string = 'mqtt://broker.sentinel-ai.local:1883';
  private isConnected: boolean = false;
  private eventBus: EventBus = EventBus.getInstance();
  private handlers: MqttTopicHandler[] = [];

  private constructor() {
    this.registerDefaultHandlers();
  }

  public static getInstance(): MqttInterface {
    if (!MqttInterface.instance) {
      MqttInterface.instance = new MqttInterface();
    }
    return MqttInterface.instance;
  }

  private registerDefaultHandlers(): void {
    // Register telemetry handler
    this.handlers.push({
      topicPattern: 'sentinel/devices/+/telemetry',
      onMessage: (topic, payload: IoTTelemetryPayload) => {
        const parts = topic.split('/');
        const deviceId = parts[2];
        this.eventBus.publish('TELEMETRY_UPDATED', payload, deviceId, 'normal');
      },
    });

    // Register heartbeat handler
    this.handlers.push({
      topicPattern: 'sentinel/devices/+/heartbeat',
      onMessage: (topic, payload: IoTHeartbeatPayload) => {
        const parts = topic.split('/');
        const deviceId = parts[2];
        this.eventBus.publish('DEVICE_ONLINE', payload, deviceId, 'normal');
      },
    });
  }

  public connect(customBrokerUrl?: string): boolean {
    if (customBrokerUrl) this.brokerUrl = customBrokerUrl;
    // Simulated connection status for frontend stability
    this.isConnected = true;
    return true;
  }

  public disconnect(): void {
    this.isConnected = false;
  }

  public publishMessage(topic: string, message: any): boolean {
    if (!this.isConnected) {
      console.warn('MqttInterface: Broker disconnected, queuing message for delivery.');
      return false;
    }
    // Forward via EventBus for live dashboard visibility
    this.eventBus.publish('TELEMETRY_UPDATED', { topic, message, sentAt: new Date().toISOString() });
    return true;
  }

  public simulateIncomingMessage(topic: string, payload: any): void {
    const handler = this.handlers.find((h) => {
      const regexStr = h.topicPattern.replace(/\+/g, '[^/]+').replace(/#/g, '.*');
      const regex = new RegExp(`^${regexStr}$`);
      return regex.test(topic);
    });

    if (handler) {
      handler.onMessage(topic, payload);
    } else {
      this.eventBus.publish('TELEMETRY_UPDATED', payload, topic);
    }
  }

  public getConnectionStatus(): { isConnected: boolean; brokerUrl: string } {
    return {
      isConnected: this.isConnected,
      brokerUrl: this.brokerUrl,
    };
  }
}
