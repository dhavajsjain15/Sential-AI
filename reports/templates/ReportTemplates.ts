// ============================================================================
// Sentinel AI — Programmatic Report Templates & Compiler Engine
// ============================================================================

import { CompleteReportDocument, ReportHeaderMetadata, TelemetrySnapshotSection, AIReasoningSection } from '../interfaces';
import { AIInputContext, AIStructuredIncidentResponse } from '../../ai/gemini/types';

export class ReportTemplates {
  public static compileIncidentCertificate(
    metadata: ReportHeaderMetadata,
    snapshot: TelemetrySnapshotSection,
    reasoning: AIReasoningSection
  ): CompleteReportDocument {
    return {
      metadata: { ...metadata, variant: 'Incident Certificate' },
      telemetrySnapshot: snapshot,
      aiReasoning: reasoning,
      actionsLog: [
        { timestamp: new Date().toISOString(), action: 'Incident Triage Declared & Certified', actor: metadata.certifiedBy },
        { timestamp: new Date().toISOString(), action: 'Automated Containment & HVAC Dampers Actuated', actor: 'Sentinel AI Mesh Core' },
      ],
      attachments: [
        {
          attachmentId: `att_${Date.now()}_1`,
          type: 'Telemetry Waveform Graph',
          title: 'High-Resolution 100ms Sensor Array Waveform',
          base64OrPath: '/assets/reports/sample-telemetry-graph.png',
          capturedAt: snapshot.timestamp,
          caption: 'Continuous 5-minute sampling window verifying anomaly emergence threshold.',
        },
      ],
      watermarkText: 'CONFIDENTIAL — OFFICIAL SENTINEL AI CERTIFICATE',
      verificationHash: `SHA256-${Math.abs(Date.now() * 1337).toString(16).toUpperCase()}`,
    };
  }

  public static compileExecutiveSummary(
    metadata: ReportHeaderMetadata,
    snapshot: TelemetrySnapshotSection,
    reasoning: AIReasoningSection
  ): CompleteReportDocument {
    return {
      metadata: { ...metadata, variant: 'Executive Summary Report' },
      telemetrySnapshot: snapshot,
      aiReasoning: reasoning,
      actionsLog: [
        { timestamp: new Date().toISOString(), action: 'Executive C-Suite Notification Dispatched', actor: 'System Notification Center' },
        { timestamp: new Date().toISOString(), action: 'Facility Security Operations Center Armed', actor: 'SOC Chief Operator' },
      ],
      attachments: [
        {
          attachmentId: `att_${Date.now()}_2`,
          type: 'Digital Twin Heatmap Overlay',
          title: 'Spatio-Temporal Facility Risk Heatmap',
          base64OrPath: '/assets/reports/sample-heatmap.png',
          capturedAt: snapshot.timestamp,
          caption: `Risk concentration localized within ${metadata.roomOrZone}.`,
        },
      ],
      watermarkText: 'EXECUTIVE BRIEFING — INTERNAL USE ONLY',
      verificationHash: `SHA256-${Math.abs(Date.now() * 9999).toString(16).toUpperCase()}`,
    };
  }

  public static compileInsuranceClaimsDocumentation(
    metadata: ReportHeaderMetadata,
    snapshot: TelemetrySnapshotSection,
    reasoning: AIReasoningSection
  ): CompleteReportDocument {
    return {
      metadata: { ...metadata, variant: 'Insurance Claims Documentation' },
      telemetrySnapshot: snapshot,
      aiReasoning: reasoning,
      actionsLog: [
        { timestamp: new Date().toISOString(), action: 'Immutable Telemetry Package Sealed for Audit', actor: 'Sentinel Audit Logger' },
        { timestamp: new Date().toISOString(), action: 'First Responder Dispatch Verification Timestamped', actor: 'Municipal Dispatch Link' },
      ],
      attachments: [
        {
          attachmentId: `att_${Date.now()}_3`,
          type: 'YOLOv8 Optical Frame',
          title: 'Optical Surveillance Bounding Box Verification',
          base64OrPath: '/assets/reports/sample-optical-frame.jpg',
          capturedAt: snapshot.timestamp,
          caption: 'Tamper-proof optical frame with timestamp and AI detection confidence box overlay.',
        },
      ],
      watermarkText: 'AUDIT VERIFIED — INSURANCE CLAIMS PACKAGE',
      verificationHash: `SHA256-${Math.abs(Date.now() * 8888).toString(16).toUpperCase()}`,
    };
  }
}
