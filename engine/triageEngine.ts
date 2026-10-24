export type PostureState = 'horizontal' | 'upright' | 'inconclusive';
export type SeverityLevel = 'LOW' | 'HIGH' | 'CRITICAL';
export type IntentType =
  | 'SAFE_AFFIRMATIVE'
  | 'ASSISTANCE_NEEDED'
  | 'CRITICAL_DISTRESS'
  | 'FAMILY_SOS_REQUEST'
  | 'AMBIGUOUS';

export type EscalationVerdict =
  | 'IDLE'
  | 'AWAITING'
  | 'ABORTED'
  | 'ASSISTANCE_REQ'
  | 'EMS_DISPATCH'
  | 'FAMILY_DISPATCH';

export interface TelemetryInput {
  visionConfidence: number; // 0 - 100
  postureState: PostureState;
  stationaryTimeSec: number;
}

export interface TriageClassification {
  severity: SeverityLevel;
  initialWindowSec: number;
  initialPrompt: string;
}

// --- 1. DYNAMIC CONFIDENCE & SEVERITY CLASSIFICATION ENGINE ---
export function evaluateTriage(input: TelemetryInput): TriageClassification {
  const { visionConfidence, postureState, stationaryTimeSec } = input;

  // Critical Event: >= 90% confidence OR zero movement > 45s with horizontal posture
  if (visionConfidence >= 90 || (stationaryTimeSec >= 45 && postureState === 'horizontal')) {
    return {
      severity: 'CRITICAL',
      initialWindowSec: 5,
      initialPrompt: 'Critical fall detected. Initializing emergency tripwire verification.',
    };
  }

  // High Confidence: 70 - 89%
  if (visionConfidence >= 70) {
    return {
      severity: 'HIGH',
      initialWindowSec: 25,
      initialPrompt: 'Incident detected. Are you injured? Say "Call Family" for private SOS.',
    };
  }

  // Low Confidence: 50 - 69%
  return {
    severity: 'LOW',
    initialWindowSec: 60,
    initialPrompt: 'Checking in: Is assistance needed? Say "Call Family" to notify family only.',
  };
}

// --- 3. LOCAL NLP INTENT CLASSIFIER ---
export function classifyTranscript(text: string): IntentType {
  const t = text.trim().toLowerCase();
  if (!t) return 'AMBIGUOUS';

  // Explicit Family SOS & Direct Family Calling Request
  const familyRegex = /\b(call family|call my family|family sos|notify family|notify my family|alert family|call daughter|call my daughter|call son|call my son|call wife|call my wife|call husband|call my husband|family help|family only|call sarah|call michael|let my family know|tell my family|contact family|tell my daughter|tell my son|call family only|family emergency)\b/i;
  if (familyRegex.test(t)) {
    return 'FAMILY_SOS_REQUEST';
  }

  // Critical Distress Patterns (911 / EMS)
  const distressRegex = /\b(it hurts|help me|call an ambulance|ambulance|bleeding|chest pain|severe pain|injured|i'm hurt|pain|emergency|911|102)\b/i;
  if (distressRegex.test(t)) {
    return 'CRITICAL_DISTRESS';
  }

  // Assistance Needed Patterns
  const assistanceRegex = /\b(no|can't|cannot|i can't|stuck|i need help|need help|help|cannot get up|can't stand|unable)\b/i;
  if (assistanceRegex.test(t)) {
    return 'ASSISTANCE_NEEDED';
  }

  // Safe Affirmative Patterns
  const safeRegex = /\b(yes|yeah|yep|i'm okay|i am okay|i'm fine|fine|i am fine|all good|false alarm|yes always good|always good|standing|i'm up|i am up|no problem)\b/i;
  if (safeRegex.test(t)) {
    return 'SAFE_AFFIRMATIVE';
  }

  return 'AMBIGUOUS';
}

