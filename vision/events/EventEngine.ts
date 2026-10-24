import { VisionEvent, Detection, CameraConfig, SeverityLevel } from '../types';

/**
 * EventEngine
 * Converts raw YOLO edge detections into structured, deduplicated, and enriched
 * timeline events linked to physical risk zones.
 */
export class EventEngine {
  private static instance: EventEngine;
  private timeline: VisionEvent[] = [];
  private listeners: ((events: VisionEvent[]) => void)[] = [];
  private lastEventTimeByClass: Map<string, number> = new Map();

  private constructor() {}

  public static getInstance(): EventEngine {
    if (!EventEngine.instance) {
      EventEngine.instance = new EventEngine();
    }
    return EventEngine.instance;
  }

  public processDetections(detections: Detection[], camera: CameraConfig): VisionEvent[] {
    if (!detections || detections.length === 0) return [];

    const now = Date.now();
    const newEvents: VisionEvent[] = [];

    // Group detections by class to determine event type
    const classesSeen = new Set(detections.map((d) => d.className));

    const checkAndEmit = (
      className: string,
      eventType: string,
      description: string,
      severity: SeverityLevel,
      cooldownMs = 4000
    ) => {
      const key = `${camera.id}-${eventType}`;
      const last = this.lastEventTimeByClass.get(key) || 0;
      if (now - last > cooldownMs) {
        this.lastEventTimeByClass.set(key, now);
        const event: VisionEvent = {
          id: `evt-${now}-${Math.floor(Math.random() * 1000)}`,
          timestamp: now,
          cameraId: camera.id,
          cameraName: camera.name,
          zone: camera.zone,
          eventType,
          description,
          severity,
          detections: detections.filter((d) => d.className === className || className === 'ALL'),
          acknowledged: false,
        };
        newEvents.push(event);
        this.timeline.unshift(event);
      }
    };

    if (classesSeen.has('Fire')) {
      checkAndEmit('Fire', 'Fire Detected', `Thermal runaway detected in ${camera.zone} via ${camera.name}`, 'critical', 3000);
    }
    if (classesSeen.has('Smoke')) {
      checkAndEmit('Smoke', 'Smoke Increasing', `Particulate/VOC smoke plume detected in ${camera.zone}`, 'high', 4000);
    }
    if (classesSeen.has('Fall')) {
      checkAndEmit('Fall', 'Fall Detected', `Physiological fall / collapse event logged in ${camera.zone}`, 'critical', 5000);
    }
    if (classesSeen.has('Weapon')) {
      checkAndEmit('Weapon', 'Weapon Detected', `Concealed or drawn weapon identified in ${camera.zone}`, 'critical', 2000);
    }
    if (classesSeen.has('Person')) {
      if (camera.zone === 'Restricted Area') {
        checkAndEmit('Person', 'Unauthorized Access', `Person entered restricted sector (${camera.zone}) during monitoring window`, 'high', 6000);
      } else {
        checkAndEmit('Person', 'Person Entered', `Personnel activity logged in ${camera.zone}`, 'low', 12000);
      }
    }
    if (classesSeen.has('Door')) {
      checkAndEmit('Door', 'Door Opened', `Access point state changed in ${camera.zone}`, 'medium', 8000);
    }
    if (classesSeen.has('Window')) {
      checkAndEmit('Window', 'Window Broken', `Structural window anomaly detected in ${camera.zone}`, 'high', 4000);
    }

    if (newEvents.length > 0) {
      if (this.timeline.length > 100) {
        this.timeline = this.timeline.slice(0, 100);
      }
      this.notifyListeners();
    }

    return newEvents;
  }

  public getTimeline(): VisionEvent[] {
    return [...this.timeline];
  }

  public acknowledgeEvent(id: string): void {
    const evt = this.timeline.find((e) => e.id === id);
    if (evt) {
      evt.acknowledged = true;
      this.notifyListeners();
    }
  }

  public clearTimeline(): void {
    this.timeline = [];
    this.lastEventTimeByClass.clear();
    this.notifyListeners();
  }

  public subscribe(listener: (events: VisionEvent[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.getTimeline());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    const list = this.getTimeline();
    this.listeners.forEach((l) => l(list));
  }
}
