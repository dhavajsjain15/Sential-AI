// ============================================================================
// Sentinel AI — IoT Offline Queue Manager
// ============================================================================

import { IoTOfflineQueueItem } from '../models';
import { EventBus } from '../events/EventBus';

export class OfflineQueueManager {
  private static instance: OfflineQueueManager;
  private queue: IoTOfflineQueueItem[] = [];
  private isOnline: boolean = true;
  private eventBus: EventBus = EventBus.getInstance();
  private maxQueueSize: number = 500;

  private constructor() {
    this.setupListeners();
  }

  public static getInstance(): OfflineQueueManager {
    if (!OfflineQueueManager.instance) {
      OfflineQueueManager.instance = new OfflineQueueManager();
    }
    return OfflineQueueManager.instance;
  }

  private setupListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.setConnectionStatus(true));
      window.addEventListener('offline', () => this.setConnectionStatus(false));
    }
  }

  public setConnectionStatus(online: boolean): void {
    const previous = this.isOnline;
    this.isOnline = online;

    if (!previous && online) {
      console.log('OfflineQueueManager: Network restored. Flushing offline queue...');
      this.flushQueue();
    }
  }

  public enqueueItem(type: IoTOfflineQueueItem['type'], payload: any): IoTOfflineQueueItem {
    const item: IoTOfflineQueueItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      payload,
      queuedAt: new Date().toISOString(),
      attempts: 0,
    };

    this.queue.push(item);
    if (this.queue.length > this.maxQueueSize) {
      this.queue.shift(); // Drop oldest if full
    }

    if (this.isOnline) {
      this.flushQueue();
    }

    return item;
  }

  public async flushQueue(): Promise<number> {
    if (!this.isOnline || this.queue.length === 0) return 0;

    let processed = 0;
    const currentQueue = [...this.queue];
    this.queue = [];

    for (const item of currentQueue) {
      try {
        item.attempts++;
        if (item.type === 'telemetry') {
          this.eventBus.publish('TELEMETRY_UPDATED', item.payload);
        } else if (item.type === 'incident') {
          this.eventBus.publish('FUSION_INCIDENT_TRIGGERED', item.payload);
        } else {
          this.eventBus.publish('DEVICE_ONLINE', item.payload);
        }
        processed++;
      } catch (err) {
        if (item.attempts < 5) {
          this.queue.push(item);
        }
      }
    }

    return processed;
  }

  public getQueueSize(): number {
    return this.queue.length;
  }
}
