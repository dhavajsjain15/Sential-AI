import { create } from 'zustand';
import { SeverityLevel, EscalationVerdict } from '@/engine/triageEngine';

export interface IncidentData {
  id: string;
  zoneId: string;
  zoneName: string;
  eventType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  personStatus: string;
  verificationStatus: string;
  escalationTier: string;
  position: [number, number, number];
  timestamp: string;
}

export interface TriageState {
  dialogueStep: number; // 0, 1, 2
  activePrompt: string;
  recognizedTranscript: string;
  timeRemaining: number;
  protocolSeverity: SeverityLevel;
  escalationVerdict: EscalationVerdict;
}

interface EmergencyStoreState {
  activeIncident: IncidentData | null;
  cameraFocusPosition: [number, number, number] | null;
  isMacroView: boolean;
  
  // Adaptive Triage State
  triage: TriageState;
  
  // Actions
  triggerIncident: (incident: IncidentData) => void;
  resolveIncident: () => void;
  setCameraFocus: (pos: [number, number, number] | null) => void;
  resetCameraMacro: () => void;
  updateTriageState: (update: Partial<TriageState>) => void;
}

export const useEmergencyStore = create<EmergencyStoreState>((set) => ({
  activeIncident: {
    id: 'INC-FALL-001',
    zoneId: 'h-3',
    zoneName: 'Master Bedroom',
    eventType: 'Possible Fall Detected',
    severity: 'CRITICAL',
    confidence: 91,
    personStatus: 'Stationary (38s) / Horizontal Posture',
    verificationStatus: 'Awaiting Voice Response',
    escalationTier: 'Tier 2 — Paramedic Dispatch (tel:102)',
    position: [1, 0, -6],
    timestamp: new Date().toLocaleTimeString(),
  },
  cameraFocusPosition: [1, 0, -6],
  isMacroView: false,

  triage: {
    dialogueStep: 0,
    activePrompt: 'Standby Monitoring',
    recognizedTranscript: '',
    timeRemaining: 0,
    protocolSeverity: 'HIGH',
    escalationVerdict: 'IDLE',
  },

  triggerIncident: (incident) =>
    set({
      activeIncident: incident,
      cameraFocusPosition: incident.position,
      isMacroView: false,
    }),

  resolveIncident: () =>
    set((state) => ({
      activeIncident: null,
      cameraFocusPosition: null,
      isMacroView: true,
      triage: {
        ...state.triage,
        dialogueStep: 0,
        activePrompt: 'Protocol Aborted',
        escalationVerdict: 'ABORTED',
      },
    })),

  setCameraFocus: (pos) => set({ cameraFocusPosition: pos, isMacroView: false }),

  resetCameraMacro: () => set({ cameraFocusPosition: null, isMacroView: true }),

  updateTriageState: (update) =>
    set((state) => ({
      triage: { ...state.triage, ...update },
    })),
}));
