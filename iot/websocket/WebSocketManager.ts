// ============================================================================
// Sentinel AI — IoT WebSocket Feeds Manager
// ============================================================================

import { EventBus, IoTEvent } from '../events/EventBus';

export interface WebSocketClient {
  id: string;
  socket?: any; // Native WebSocket instance or simulated client
  subscribedDevices: Set<string>;
  connectedAt: string;
}

export class WebSocketManager {
  private static instance: WebSocketManager;
  private clients: Map<string, WebSocketClient> = new Map();
  private eventBus: EventBus = EventBus.getInstance();
  private isSimulated: boolean = true;
  private serverUrl: string = 'ws://localhost:8000/api/v1/ws/telemetry';

  private constructor() {
    this.setupEventForwarding();
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private setupEventForwarding(): void {
    // Forward all critical event bus items to active socket clients
    this.eventBus.subscribe('*', (event: IoTEvent) => {
      this.broadcastToClients(event);
    });
  }

  public connectClient(clientId: string = 'dashboard_main'): WebSocketClient {
    let client = this.clients.get(clientId);
    if (!client) {
      client = {
        id: clientId,
        subscribedDevices: new Set(),
        connectedAt: new Date().toISOString(),
      };
      this.clients.set(clientId, client);
    }
    return client;
  }

  public subscribeToDevice(clientId: string, deviceId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.subscribedDevices.add(deviceId);
    }
  }

  public unsubscribeFromDevice(clientId: string, deviceId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.subscribedDevices.delete(deviceId);
    }
  }

  public broadcastToClients(event: IoTEvent): void {
    this.clients.forEach((client) => {
      if (!event.deviceId || client.subscribedDevices.has(event.deviceId) || client.subscribedDevices.size === 0) {
        if (client.socket && typeof client.socket.send === 'function') {
          try {
            client.socket.send(JSON.stringify(event));
          } catch (err) {
            console.warn(`WebSocketManager: Error sending to socket ${client.id}`, err);
          }
        }
      }
    });
  }

  public sendCommandToDevice(deviceId: string, command: string, payload: any): boolean {
    this.eventBus.publish('TELEMETRY_UPDATED', {
      deviceId,
      command,
      payload,
      executedAt: new Date().toISOString(),
    }, deviceId, 'normal');
    return true;
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
}
