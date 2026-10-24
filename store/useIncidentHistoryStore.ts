import { create } from 'zustand';

export type EventType =
  | 'MOTION_ANOMALY'
  | 'FALL_CLASSIFIED'
  | 'VOICE_VERIFICATION_STARTED'
  | 'SPEECH_INTENT_CAPTURED'
  | 'VERIFICATION_TIMED_OUT'
  | 'ESCALATION_INITIATED'
  | 'DISPATCH_TRIGGERED'
  | 'FAMILY_SOS_DISPATCHED'
  | 'ABORT_ACKNOWLEDGED';

export type EventSeverity = 'INFO' | 'WARN' | 'CRITICAL' | 'RESOLVED';

export interface IncidentEvent {
  id: string;
  incidentId: string;
  timestamp: string; // HH:mm:ss.SSS format
  relativeOffsetSec: number; // e.g., +0.00s, +2.15s
  eventType: EventType;
  severity: EventSeverity;
  description: string;
  metadata?: Record<string, string | number | boolean>;
}

interface IncidentHistoryStoreState {
  events: IncidentEvent[];
  selectedEvent: IncidentEvent | null;
  activeFilter: 'ALL' | 'CRITICAL' | 'VOICE' | 'ESCALATION';

  // Actions
  addEvent: (event: Omit<IncidentEvent, 'id'>) => void;
  selectEvent: (event: IncidentEvent | null) => void;
  setFilter: (filter: 'ALL' | 'CRITICAL' | 'VOICE' | 'ESCALATION') => void;
  clearEvents: () => void;
  exportAuditJson: () => void;
  exportAuditText: () => void;
}

const DEMO_INCIDENT_EVENTS: IncidentEvent[] = [
  {
    id: 'evt-001',
    incidentId: 'INC-FALL-8842',
    timestamp: '12:14:03.120',
    relativeOffsetSec: 0.0,
    eventType: 'MOTION_ANOMALY',
    severity: 'INFO',
    description: 'Motion anomaly detected (Delta 4.2x baseline pixel difference)',
    metadata: {
      pixelDeltaPercent: 18.4,
      motionScore: 4.2,
      sensorId: 'CAM-01-LOBBY',
      frameRateFps: 30,
    },
  },
  {
    id: 'evt-002',
    incidentId: 'INC-FALL-8842',
    timestamp: '12:14:05.450',
    relativeOffsetSec: 2.33,
    eventType: 'FALL_CLASSIFIED',
    severity: 'CRITICAL',
    description: 'Possible fall identified (Centroid vertical drop > 62px, Aspect ratio 1.34)',
    metadata: {
      aspectRatio: 1.34,
      verticalDropPx: 64,
      confidenceCertainty: 94,
      postureState: 'horizontal',
      zone: 'Master Bedroom',
    },
  },
  {
    id: 'evt-003',
    incidentId: 'INC-FALL-8842',
    timestamp: '12:14:07.100',
    relativeOffsetSec: 3.98,
    eventType: 'VOICE_VERIFICATION_STARTED',
    severity: 'WARN',
    description: 'Voice verification started (Turn 1 prompt: "Emergency detected. Are you okay?")',
    metadata: {
      triageStep: 1,
      protocolSeverity: 'HIGH',
      initialWindowSec: 25,
      ttsPrompt: 'Emergency detected. Are you okay?',
    },
  },
  {
    id: 'evt-004',
    incidentId: 'INC-FALL-8842',
    timestamp: '12:14:14.320',
    relativeOffsetSec: 11.2,
    eventType: 'SPEECH_INTENT_CAPTURED',
    severity: 'CRITICAL',
    description: 'Speech intent captured ("I can\'t get up" -> Explicit Distress Intent)',
    metadata: {
      rawTranscript: "i can't get up my leg hurts",
      classifiedIntent: 'CRITICAL_DISTRESS',
      confidence: 98,
    },
  },
  {
    id: 'evt-005',
    incidentId: 'INC-FALL-8842',
    timestamp: '12:14:15.800',
    relativeOffsetSec: 12.68,
    eventType: 'ESCALATION_INITIATED',
    severity: 'CRITICAL',
    description: 'Emergency escalation initiated (Priority Level 5 — Tier 2 Paramedic)',
    metadata: {
      escalationLevel: 5,
      channel: 'Paramedic Dispatch CAD Trunk',
      targetPhone: 'tel:102',
    },
  },
  {
    id: 'evt-006',
    incidentId: 'INC-FALL-8842',
    timestamp: '12:14:17.210',
    relativeOffsetSec: 14.09,
    eventType: 'ESCALATION_INITIATED',
    severity: 'WARN',
    description: 'Trusted emergency contacts notified via automated trunk SMS/Voice',
    metadata: {
      contact1: 'Jane Doe (Primary Caretaker) - Notified',
      contact2: 'Dr. Robert Smith (Family Physician) - Notified',
    },
  },
  {
    id: 'evt-007',
    incidentId: 'INC-FALL-8842',
    timestamp: '12:14:20.050',
    relativeOffsetSec: 16.93,
    eventType: 'DISPATCH_TRIGGERED',
    severity: 'CRITICAL',
    description: 'Native emergency dialer (Ambulance tel:102) armed / dispatched',
    metadata: {
      dispatchStatus: 'ARMED_AND_ROUTED',
      telUri: 'tel:102',
      cadReference: 'CAD-AMB-99120',
    },
  },
];

export const useIncidentHistoryStore = create<IncidentHistoryStoreState>((set, get) => ({
  events: DEMO_INCIDENT_EVENTS,
  selectedEvent: DEMO_INCIDENT_EVENTS[1], // Default select Fall Classified
  activeFilter: 'ALL',

  addEvent: (newEvent) => {
    const fullEvent: IncidentEvent = {
      ...newEvent,
      id: `evt-${Date.now().toString().slice(-6)}`,
    };
    set((state) => ({ events: [fullEvent, ...state.events] }));
  },

  selectEvent: (event) => set({ selectedEvent: event }),

  setFilter: (filter) => set({ activeFilter: filter }),

  clearEvents: () => set({ events: [], selectedEvent: null }),

  exportAuditJson: () => {
    const events = get().events;
    const jsonStr = JSON.stringify(events, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-incident-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportAuditText: () => {
    const events = get().events;
    let textStr = `========================================================\n`;
    textStr += `SENTINEL AI — INCIDENT FORENSICS & AUDIT LEDGER\n`;
    textStr += `Generated At: ${new Date().toLocaleString()}\n`;
    textStr += `========================================================\n\n`;

    events.forEach((e) => {
      textStr += `[${e.timestamp}] (+${e.relativeOffsetSec.toFixed(2)}s) [${e.severity}] ${e.eventType}\n`;
      textStr += `  Description: ${e.description}\n`;
      if (e.metadata) {
        textStr += `  Payload Metadata: ${JSON.stringify(e.metadata)}\n`;
      }
      textStr += `--------------------------------------------------------\n`;
    });

    const blob = new Blob([textStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-incident-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  },
}));
