// ============================================================================
// Sentinel AI — IoT Real-Time Event Bus
// ============================================================================

import { IoTDevice, IoTSensorMetric, IoTTelemetryPayload } from '../models';

export type IoTEventType =
  | 'DEVICE_REGISTERED'
  | 'DEVICE_ONLINE'
  | 'DEVICE_OFFLINE'
  | 'TELEMETRY_UPDATED'
  | 'SENSOR_ANOMALY'
  | 'FUSION_INCIDENT_TRIGGERED'
  | 'ESCALATION_LEVEL_RAISED'
  | 'FAMILY_SOS_TRIGGERED'
  | 'SIMULATION_SCENARIO_CHANGED'
  | 'FIRMWARE_UPDATE_STARTED'
  | 'FIRMWARE_UPDATE_COMPLETED';

export interface IoTEvent {
  id: string;
  type: IoTEventType;
  timestamp: string;
  deviceId?: string;
  payload: any;
  severity: 'normal' | 'warning' | 'critical';
}

export type IoTEventCallback = (event: IoTEvent) => void;

export class EventBus {
  private static instance: EventBus;
  private subscribers: Map<string, IoTEventCallback[]> = new Map();
  private eventHistory: IoTEvent[] = [];
  private maxHistorySize: number = 1000;

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe(eventType: IoTEventType | '*', callback: IoTEventCallback): () => void {
    const list = this.subscribers.get(eventType) || [];
    list.push(callback);
    this.subscribers.set(eventType, list);

    // Return unsubscribe function
    return () => {
      const current = this.subscribers.get(eventType) || [];
      const updated = current.filter((cb) => cb !== callback);
      this.subscribers.set(eventType, updated);
    };
  }

  public publish(type: IoTEventType, payload: any, deviceId?: string, severity: IoTEvent['severity'] = 'normal'): IoTEvent {
    const event: IoTEvent = {
      id: `iot_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      timestamp: new Date().toISOString(),
      deviceId,
      payload,
      severity,
    };

    // Store in history
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.pop();
    }

    // Notify specific type subscribers
    const typeSubscribers = this.subscribers.get(type) || [];
    typeSubscribers.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.error(`EventBus: Error executing subscriber for ${type}`, err);
      }
    });

    // Notify wildcard subscribers
    const wildcardSubscribers = this.subscribers.get('*') || [];
    wildcardSubscribers.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.error(`EventBus: Error executing wildcard subscriber`, err);
      }
    });

    return event;
  }

  public getHistory(filter?: { type?: IoTEventType; deviceId?: string; severity?: IoTEvent['severity']; limit?: number }): IoTEvent[] {
    let filtered = [...this.eventHistory];
    if (filter) {
      if (filter.type) filtered = filtered.filter((e) => e.type === filter.type);
      if (filter.deviceId) filtered = filtered.filter((e) => e.deviceId === filter.deviceId);
      if (filter.severity) filtered = filtered.filter((e) => e.severity === filter.severity);
      if (filter.limit) filtered = filtered.slice(0, filter.limit);
    }
    return filtered;
  }

  public replayEvents(events: IoTEvent[], speedFactor: number = 1.0, onProgress?: (event: IoTEvent) => void): Promise<void> {
    return new Promise(async (resolve) => {
      const sorted = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      if (sorted.length === 0) {
        resolve();
        return;
      }

      for (let i = 0; i < sorted.length; i++) {
        const evt = sorted[i];
        this.publish(evt.type, evt.payload, evt.deviceId, evt.severity);
        if (onProgress) onProgress(evt);

        if (i < sorted.length - 1) {
          const deltaMs = new Date(sorted[i + 1].timestamp).getTime() - new Date(evt.timestamp).getTime();
          const delay = Math.max(10, Math.min(3000, deltaMs / speedFactor));
          await new Promise((r) => setTimeout(r, delay));
        }
      }
      resolve();
    });
  }

  public clearHistory(): void {
    this.eventHistory = [];
  }
}
