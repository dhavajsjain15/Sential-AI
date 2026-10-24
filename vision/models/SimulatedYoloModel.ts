import { IYoloAdapter, Detection, DetectionClass, SeverityLevel, CameraConfig, BoundingBox } from '../types';

export type SimulationScenario =
  | 'Normal Surveillance'
  | 'Critical Fire & Smoke'
  | 'Person Fallen (Medical)'
  | 'Intrusion & Weapon Alert'
  | 'Water Flooding Leak'
  | 'VOC Gas Vapor Leak'
  | 'Random Multi-Object Activity';

export class SimulatedYoloModel implements IYoloAdapter {
  public name = 'Simulated YOLOv8n-Sentinel-XAI';
  public version = '8.0.1-sim';
  public isReady = false;

  private frameCounter = 0;
  private activeTracks: Map<string, { x: number; y: number; vx: number; vy: number }> = new Map();

  public async initialize(): Promise<void> {
    // Simulate short model initialization / warm-up latency
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.isReady = true;
  }

  public async detect(
    _frameData?: ImageData | string,
    scenarioInput: string = 'Normal Surveillance',
    camera?: CameraConfig
  ): Promise<{
    detections: Detection[];
    inferenceTimeMs: number;
    fps: number;
  }> {
    if (!this.isReady) {
      await this.initialize();
    }

    const scenario = scenarioInput as SimulationScenario;
    this.frameCounter++;
    const now = Date.now();
    const zone = camera?.zone || 'Entrance';

    // Simulate realistic inference jitter between 11.4 ms and 18.2 ms
    const inferenceTimeMs = Number((11.4 + Math.random() * 6.8).toFixed(1));
    const fps = Math.round(1000 / Math.max(inferenceTimeMs + 15, 33)); // ~30 FPS average

    const detections: Detection[] = [];

    // Helper to generate or update tracked object coordinates
    const getOrUpdateTrack = (id: string, startX: number, startY: number, speed = 0.012) => {
      if (!this.activeTracks.has(id)) {
        this.activeTracks.set(id, {
          x: startX,
          y: startY,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
        });
      }
      const t = this.activeTracks.get(id)!;
      t.x += t.vx;
      t.y += t.vy;
      // Bounce off box boundaries
      if (t.x < 0.05 || t.x > 0.75) t.vx *= -1;
      if (t.y < 0.05 || t.y > 0.65) t.vy *= -1;
      return { x: Math.max(0.05, Math.min(0.75, t.x)), y: Math.max(0.05, Math.min(0.65, t.y)) };
    };

    switch (scenario) {
      case 'Critical Fire & Smoke': {
        const firePos = getOrUpdateTrack('fire-trk-01', 0.45, 0.35, 0.005);
        detections.push({
          id: `det-${now}-fire`,
          className: 'Fire',
          confidence: Number((94 + Math.random() * 5.5).toFixed(1)),
          box: { x: firePos.x, y: firePos.y, width: 0.25, height: 0.38 },
          trackingId: '#TRK-FIRE-01',
          riskContribution: 95,
          severity: 'critical',
          timestamp: now,
          zone,
        });
        detections.push({
          id: `det-${now}-smoke`,
          className: 'Smoke',
          confidence: Number((91 + Math.random() * 7).toFixed(1)),
          box: { x: firePos.x - 0.05, y: firePos.y - 0.15, width: 0.35, height: 0.35 },
          trackingId: '#TRK-SMK-02',
          riskContribution: 80,
          severity: 'high',
          timestamp: now,
          zone,
        });
        break;
      }

      case 'Person Fallen (Medical)': {
        const fallPos = getOrUpdateTrack('fall-trk-11', 0.38, 0.52, 0.002);
        detections.push({
          id: `det-${now}-fall`,
          className: 'Fall',
          confidence: Number((97 + Math.random() * 2.8).toFixed(1)),
          box: { x: fallPos.x, y: fallPos.y, width: 0.38, height: 0.18 },
          trackingId: '#TRK-MED-881',
          riskContribution: 90,
          severity: 'critical',
          timestamp: now,
          zone,
        });
        detections.push({
          id: `det-${now}-lying`,
          className: 'Lying Person',
          confidence: Number((95 + Math.random() * 4).toFixed(1)),
          box: { x: fallPos.x + 0.02, y: fallPos.y + 0.02, width: 0.34, height: 0.14 },
          trackingId: '#TRK-MED-881',
          riskContribution: 85,
          severity: 'high',
          timestamp: now,
          zone,
        });
        break;
      }

      case 'Intrusion & Weapon Alert': {
        const personPos = getOrUpdateTrack('intruder-trk-22', 0.22, 0.25, 0.018);
        detections.push({
          id: `det-${now}-person-int`,
          className: 'Person',
          confidence: Number((98 + Math.random() * 1.5).toFixed(1)),
          box: { x: personPos.x, y: personPos.y, width: 0.22, height: 0.55 },
          trackingId: '#TRK-SEC-409',
          riskContribution: 75,
          severity: 'high',
          timestamp: now,
          zone,
        });
        detections.push({
          id: `det-${now}-weapon`,
          className: 'Weapon',
          confidence: Number((88 + Math.random() * 8.5).toFixed(1)),
          box: { x: personPos.x + 0.12, y: personPos.y + 0.22, width: 0.1, height: 0.12 },
          trackingId: '#TRK-WPN-101',
          riskContribution: 99,
          severity: 'critical',
          timestamp: now,
          zone,
        });
        break;
      }

      case 'Water Flooding Leak': {
        detections.push({
          id: `det-${now}-person-wtr`,
          className: 'Safety Vest',
          confidence: Number((93 + Math.random() * 6).toFixed(1)),
          box: { x: 0.52, y: 0.3, width: 0.2, height: 0.5 },
          trackingId: '#TRK-ENG-302',
          riskContribution: 20,
          severity: 'low',
          timestamp: now,
          zone,
        });
        break;
      }

      case 'VOC Gas Vapor Leak': {
        detections.push({
          id: `det-${now}-smoke-gas`,
          className: 'Smoke',
          confidence: Number((86 + Math.random() * 9).toFixed(1)),
          box: { x: 0.3, y: 0.2, width: 0.45, height: 0.4 },
          trackingId: '#TRK-VOC-009',
          riskContribution: 88,
          severity: 'high',
          timestamp: now,
          zone,
        });
        break;
      }

      case 'Random Multi-Object Activity': {
        const pPos = getOrUpdateTrack('random-person', 0.15, 0.3, 0.015);
        const dPos = getOrUpdateTrack('random-dog', 0.55, 0.55, 0.02);
        detections.push({
          id: `det-${now}-p1`,
          className: 'Person',
          confidence: Number((96 + Math.random() * 3).toFixed(1)),
          box: { x: pPos.x, y: pPos.y, width: 0.18, height: 0.48 },
          trackingId: '#TRK-PERSON-11',
          riskContribution: 15,
          severity: 'low',
          timestamp: now,
          zone,
        });
        detections.push({
          id: `det-${now}-dog`,
          className: 'Dog',
          confidence: Number((92 + Math.random() * 7).toFixed(1)),
          box: { x: dPos.x, y: dPos.y, width: 0.15, height: 0.22 },
          trackingId: '#TRK-DOG-05',
          riskContribution: 10,
          severity: 'low',
          timestamp: now,
          zone,
        });
        if (this.frameCounter % 4 === 0) {
          detections.push({
            id: `det-${now}-cat`,
            className: 'Cat',
            confidence: 89.4,
            box: { x: 0.72, y: 0.6, width: 0.12, height: 0.18 },
            trackingId: '#TRK-CAT-02',
            riskContribution: 5,
            severity: 'low',
            timestamp: now,
            zone,
          });
        }
        break;
      }

      case 'Normal Surveillance':
      default: {
        const p1 = getOrUpdateTrack('norm-p1', 0.28, 0.32, 0.01);
        const v1 = getOrUpdateTrack('norm-v1', 0.62, 0.4, 0.008);
        detections.push({
          id: `det-${now}-norm-p1`,
          className: 'Person',
          confidence: Number((98 + Math.random() * 1.8).toFixed(1)),
          box: { x: p1.x, y: p1.y, width: 0.2, height: 0.5 },
          trackingId: '#TRK-881',
          riskContribution: 12,
          severity: 'low',
          timestamp: now,
          zone,
        });
        detections.push({
          id: `det-${now}-norm-v1`,
          className: 'Vehicle',
          confidence: Number((94 + Math.random() * 4).toFixed(1)),
          box: { x: v1.x, y: v1.y, width: 0.28, height: 0.32 },
          trackingId: '#TRK-104',
          riskContribution: 18,
          severity: 'low',
          timestamp: now,
          zone,
        });
        break;
      }
    }

    return { detections, inferenceTimeMs, fps };
  }
}
