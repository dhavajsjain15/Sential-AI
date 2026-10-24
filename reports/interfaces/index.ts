// ============================================================================
// Sentinel AI — Comprehensive Report & Export Interfaces
// ============================================================================

export type ReportVariant =
  | 'Incident Certificate'
  | 'Executive Summary Report'
  | 'Insurance Claims Documentation'
  | 'Maintenance Diagnostics Audit';

export interface ReportHeaderMetadata {
  documentId: string;
  variant: ReportVariant;
  generatedAt: string;
  facilityName: string;
  roomOrZone: string;
  incidentType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  certifiedBy: string;
}

export interface TelemetrySnapshotSection {
  timestamp: string;
  globalRiskScore: number;
  sensorReadings: Array<{
    sensorId: string;
    type: string;
    value: string | number;
    status: string;
    unit: string;
  }>;
  cameraDetections: Array<{
    cameraId: string;
    label: string;
    confidence: number;
    timestamp: string;
  }>;
}

export interface AIReasoningSection {
  geminiConfidenceScore: number;
  executiveSummaryText: string;
  causalSynthesis: string[];
  evidenceAuditTrail: string[];
  firstAidTriageProvided?: string;
  evacuationRouteRecommended?: string;
}

export interface MediaAttachment {
  attachmentId: string;
  type: 'Telemetry Waveform Graph' | 'YOLOv8 Optical Frame' | 'Digital Twin Heatmap Overlay';
  title: string;
  base64OrPath: string;
  capturedAt: string;
  caption: string;
}

export interface CompleteReportDocument {
  metadata: ReportHeaderMetadata;
  telemetrySnapshot: TelemetrySnapshotSection;
  aiReasoning: AIReasoningSection;
  actionsLog: Array<{ timestamp: string; action: string; actor: string }>;
  attachments: MediaAttachment[];
  watermarkText?: string;
  verificationHash: string;
}
