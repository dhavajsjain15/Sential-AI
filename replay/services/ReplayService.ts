// ============================================================================
// Sentinel AI — Post-Incident Forensics & Replay Engine Service
// ============================================================================

export interface ReplayFrame {
  timestampMs: number;
  timeLabel: string;
  globalRiskScore: number;
  sensorReadings: {
    smokePpm: number;
    tempCelsius: number;
    gasPpm: number;
    motionActive: boolean;
  };
  cameraEventLabel: string;
  cameraBoundingBox?: [number, number, number, number];
  aiReasoningSnapshot: {
    stage: 'Detection' | 'Escalation' | 'Threshold Exceeded' | 'Critical Declaration';
    conclusionText: string;
    confidence: number;
  };
}

export interface HistoricalIncidentSession {
  sessionId: string;
  incidentTitle: string;
  incidentType: string;
  room: string;
  durationSeconds: number;
  frames: ReplayFrame[];
}

export class ReplayService {
  private static instance: ReplayService;
  private sessions: HistoricalIncidentSession[] = [];

  private constructor() {
    this.seedHistoricalSessions();
  }

  public static getInstance(): ReplayService {
    if (!ReplayService.instance) {
      ReplayService.instance = new ReplayService();
    }
    return ReplayService.instance;
  }

  private seedHistoricalSessions(): void {
    const frames: ReplayFrame[] = [
      {
        timestampMs: 0,
        timeLabel: '00:00.0',
        globalRiskScore: 28,
        sensorReadings: { smokePpm: 0.04, tempCelsius: 24.2, gasPpm: 18, motionActive: false },
        cameraEventLabel: 'Nominal Surveillance',
        aiReasoningSnapshot: { stage: 'Detection', conclusionText: 'All telemetry arrays reporting within nominal baseline equilibrium.', confidence: 99.0 },
      },
      {
        timestampMs: 3000,
        timeLabel: '00:03.0',
        globalRiskScore: 45,
        sensorReadings: { smokePpm: 0.12, tempCelsius: 29.8, gasPpm: 45, motionActive: true },
        cameraEventLabel: 'Person Entered Kitchen Zone',
        cameraBoundingBox: [120, 80, 240, 380],
        aiReasoningSnapshot: { stage: 'Detection', conclusionText: 'Occupant entry correlated with initial thermal gradient increase over stove array.', confidence: 84.5 },
      },
      {
        timestampMs: 6000,
        timeLabel: '00:06.0',
        globalRiskScore: 68,
        sensorReadings: { smokePpm: 0.28, tempCelsius: 38.4, gasPpm: 140, motionActive: true },
        cameraEventLabel: 'Smoke Plume Detected above Hood',
        cameraBoundingBox: [180, 110, 310, 290],
        aiReasoningSnapshot: { stage: 'Escalation', conclusionText: 'Smoke particulate obscuration crossing warning limit. Optical detector confirms localized haze.', confidence: 89.2 },
      },
      {
        timestampMs: 9000,
        timeLabel: '00:09.0',
        globalRiskScore: 88,
        sensorReadings: { smokePpm: 0.52, tempCelsius: 48.6, gasPpm: 380, motionActive: true },
        cameraEventLabel: 'Open Flame / Stove Flare Verified',
        cameraBoundingBox: [200, 130, 340, 310],
        aiReasoningSnapshot: { stage: 'Threshold Exceeded', conclusionText: 'Multi-sensor fusion confirmed open flame and dangerous CO buildup. Automated containment dampers armed.', confidence: 93.8 },
      },
      {
        timestampMs: 12000,
        timeLabel: '00:12.0',
        globalRiskScore: 96,
        sensorReadings: { smokePpm: 0.84, tempCelsius: 56.2, gasPpm: 620, motionActive: false },
        cameraEventLabel: 'CRITICAL FIRE DECLARATION',
        cameraBoundingBox: [190, 120, 360, 340],
        aiReasoningSnapshot: { stage: 'Critical Declaration', conclusionText: 'Critical Fire Emergency declared. EMS & Municipal Fire Command dispatched with coordinates.', confidence: 96.4 },
      },
    ];

    this.sessions.push({
      sessionId: 'SESS-2026-FIRE-01',
      incidentTitle: 'Commercial Kitchen Stove Flare & Thermal Escalation',
      incidentType: 'Fire',
      room: 'Main Kitchen & Dining',
      durationSeconds: 12,
      frames,
    });
  }

  public getAllSessions(): HistoricalIncidentSession[] {
    return [...this.sessions];
  }

  public getSession(sessionId: string): HistoricalIncidentSession | undefined {
    return this.sessions.find((s) => s.sessionId === sessionId);
  }
}
