// ============================================================================
// Sentinel AI — Gemini Emergency Intelligence Layer Type Definitions
// ============================================================================

export type SupportedIncidentType =
  | 'Fire'
  | 'Smoke'
  | 'Gas Leak'
  | 'Water Leak'
  | 'Flood'
  | 'Electrical Fire'
  | 'Short Circuit'
  | 'Power Failure'
  | 'Fall Detection'
  | 'Medical Emergency'
  | 'Heart Attack (placeholder)'
  | 'Person Unconscious'
  | 'Intrusion'
  | 'Violence'
  | 'Weapon Detection'
  | 'Child Safety'
  | 'Elderly Safety'
  | 'Chemical Leak'
  | 'Animal Threat'
  | 'Earthquake'
  | 'Cyclone'
  | 'Storm'
  | 'Industrial Accident';

export type AILocalizationLanguage = 'English' | 'Hindi' | 'Tamil' | string;

export type AIPromptTemplateType =
  | 'Incident Analysis'
  | 'Incident Summary'
  | 'Daily Summary'
  | 'Weekly Report'
  | 'First Aid'
  | 'Safety Advice'
  | 'Maintenance Advice'
  | 'Risk Prediction'
  | 'Executive Summary';

export interface AIConfidenceMetadata {
  confidencePercentage: number;
  reasoning: string[];
  evidenceUsed: string[];
  missingInformation: string[];
  limitations: string[];
}

export interface AIEmergencyContact {
  category: 'Fire Service' | 'Police' | 'Medical' | 'Security' | 'Maintenance' | 'Community Volunteers';
  name: string;
  phoneOrChannel: string;
  dispatchPriority: 'IMMEDIATE' | 'HIGH' | 'ROUTINE';
  notes?: string;
  isPlaceholder?: boolean;
}

export interface AIFirstAidGuidance {
  category: 'Burn' | 'Fall' | 'Smoke Inhalation' | 'Bleeding' | 'Electric Shock' | 'Choking' | 'Heat Stroke' | 'Gas Exposure' | 'General';
  title: string;
  immediateSteps: string[];
  contraindications: string[];
  requiredEquipment: string[];
  medicalDisclaimer: string;
}

export interface AIEvacuationPlan {
  roomOrZone: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  blockedAreas: string[];
  primaryRoute: string;
  secondaryRoute: string;
  peopleCount: number;
  specialNeedsBreakdown: {
    children: number;
    elderly: number;
    pets: number;
    mobilityImpaired: number;
  };
  assemblyPoint: string;
  instructions: string[];
}

export interface AIInputContext {
  cameraDetections: Array<{
    cameraId: string;
    label: string;
    confidence: number;
    timestamp: string;
    box?: [number, number, number, number];
  }>;
  sensorValues: Array<{
    sensorId: string;
    type: string;
    value: string | number;
    status: string;
  }>;
  riskScore: number;
  timeline: Array<{ timestamp: string; event: string }>;
  weather: {
    temp: string;
    condition: string;
    humidity?: string;
    windSpeed?: string;
  };
  room: string;
  buildingType: string;
  pastIncidents: Array<{
    id: string;
    type: string;
    timestamp: string;
    resolution: string;
  }>;
  deviceStatus: Array<{
    deviceId: string;
    status: string;
  }>;
  evidence: string[];
  peopleDetected: number;
  objectsDetected: string[];
  zone: string;
  predictionScore: number;
}

export interface AIStructuredIncidentResponse {
  incidentTitle: string;
  incidentType: SupportedIncidentType;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  confidence: number;
  summary: string;
  evidence: string[];
  riskAnalysis: string;
  immediateActions: string[];
  firstAid: AIFirstAidGuidance;
  evacuationPlan: AIEvacuationPlan;
  recommendedEmergencyServices: AIEmergencyContact[];
  safetyChecklist: string[];
  followUpActions: string[];
  recoverySuggestions: string[];
  insuranceNotes: string;
  confidenceMetadata: AIConfidenceMetadata;
}

export interface AITimelineEntry {
  timestamp: string;
  event: string;
  sensorAnomaly?: string;
  probabilityDeviation?: number;
  severityStage?: 'Detection' | 'Escalation' | 'Threshold Exceeded' | 'Critical Declaration';
}

export interface AITimelineNarrative {
  incidentId: string;
  generatedAt: string;
  entries: AITimelineEntry[];
  summaryParagraph: string;
}

export interface AIReportDocument {
  id: string;
  title: string;
  executiveSummary: string;
  timeline: AITimelineEntry[];
  evidence: string[];
  riskScore: number;
  severity: string;
  sensorData: Array<{ name: string; value: string; status: string }>;
  cameraData: Array<{ source: string; detections: string[] }>;
  aiReasoning: string;
  actionsTaken: string[];
  recommendedActions: string[];
  attachments: Array<{ type: string; urlOrName: string; caption: string }>;
  generatedAt: string;
  type: 'Professional PDF Report' | 'Incident Certificate' | 'Executive Report' | 'Insurance Report' | 'Maintenance Report';
}

export interface AIPDFExportConfig {
  reportType: AIReportDocument['type'];
  includeWatermark: boolean;
  includeRawTelemetry: boolean;
  language: AILocalizationLanguage;
  companyLogoUrl?: string;
}

export interface AIInteractionLog {
  id: string;
  timestamp: string;
  prompt: string;
  response: string | AIStructuredIncidentResponse;
  incidentId?: string;
  userId: string;
  feedback?: 'positive' | 'negative' | 'neutral';
  latencyMs: number;
  cached: boolean;
}

export interface AISettings {
  aiTone: 'Professional' | 'Urgent' | 'Empathetic' | 'Technical' | 'Concise';
  responseLength: 'Short' | 'Balanced' | 'Detailed' | 'Comprehensive';
  language: AILocalizationLanguage;
  streamingEnabled: boolean;
  cachingEnabled: boolean;
  privacyMode: 'Strict (No External Logs)' | 'Standard' | 'Diagnostic Audit';
}
