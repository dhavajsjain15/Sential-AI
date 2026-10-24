// ============================================================================
// Sentinel AI — Automatic Incident Report Generator & PDF Layout Engine
// ============================================================================

import { AIInputContext, AIPDFExportConfig, AIReportDocument, AIStructuredIncidentResponse } from '../types';
import { TimelineNarrativeBuilder } from '../utils/TimelineNarrative';

export class ReportGenerator {
  public static generateReportDocument(
    context: AIInputContext,
    aiResponse: AIStructuredIncidentResponse,
    reportType: AIReportDocument['type'] = 'Professional PDF Report'
  ): AIReportDocument {
    const now = new Date();
    const incidentId = `SENTINEL-INC-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const timelineNarrative = TimelineNarrativeBuilder.generateNarrative(
      incidentId,
      context.timeline,
      aiResponse.incidentType,
      context.riskScore
    );

    const sensorData = context.sensorValues.map((s) => ({
      name: `${s.type} [${s.sensorId}]`,
      value: String(s.value),
      status: s.status,
    }));

    // Group camera detections by source
    const cameraMap: Record<string, string[]> = {};
    context.cameraDetections.forEach((d) => {
      if (!cameraMap[d.cameraId]) cameraMap[d.cameraId] = [];
      cameraMap[d.cameraId].push(`${d.label} (${Math.round(d.confidence * 100)}% @ ${d.timestamp})`);
    });
    const cameraData = Object.entries(cameraMap).map(([source, detections]) => ({
      source,
      detections,
    }));

    if (cameraData.length === 0) {
      cameraData.push({
        source: 'CAM-SYSTEM-ARRAY',
        detections: ['Visual surveillance tracking nominal — zero acute optical anomalies confirmed.'],
      });
    }

    const attachments = [
      {
        type: 'Telemetry Snapshot Graph',
        urlOrName: `/api/telemetry/export/${incidentId}_graph.png`,
        caption: 'High-frequency 100ms multi-sensor waveform progression during alert escalation.',
      },
      {
        type: 'Optical Surveillance Frame',
        urlOrName: `/api/cameras/export/${incidentId}_frame.jpg`,
        caption: `AI bounding box verification overlay recorded at ${now.toLocaleTimeString()}.`,
      },
      {
        type: 'Digital Twin Floorplan Zone',
        urlOrName: `/api/digital-twin/export/${incidentId}_zone.svg`,
        caption: `Spatio-temporal heat map highlighting ${context.room} inside ${context.buildingType}.`,
      },
    ];

    return {
      id: incidentId,
      title: aiResponse.incidentTitle || `Emergency Incident Report — ${aiResponse.incidentType}`,
      executiveSummary: aiResponse.summary || timelineNarrative.summaryParagraph,
      timeline: timelineNarrative.entries,
      evidence: aiResponse.evidence.length > 0 ? aiResponse.evidence : context.evidence,
      riskScore: context.riskScore,
      severity: aiResponse.severity,
      sensorData,
      cameraData,
      aiReasoning: aiResponse.riskAnalysis || `AI confidence synthesis scored ${aiResponse.confidence}% based on synchronized multi-modal sensor and optical anomalies.`,
      actionsTaken: [
        'Automated local acoustic and visual evacuation alarms triggered.',
        'High-priority push notifications dispatched to all assigned building wardens.',
        'HVAC ventilation dampers and access containment relays switched to emergency protocol.',
      ],
      recommendedActions: aiResponse.immediateActions.length > 0 ? aiResponse.immediateActions : aiResponse.safetyChecklist,
      attachments,
      generatedAt: now.toISOString(),
      type: reportType,
    };
  }

  public static preparePDFExportConfig(reportDocument: AIReportDocument, language: string = 'English'): AIPDFExportConfig {
    return {
      reportType: reportDocument.type,
      includeWatermark: reportDocument.severity === 'CRITICAL' || reportDocument.severity === 'HIGH',
      includeRawTelemetry: true,
      language,
      companyLogoUrl: 'https://sentinel-ai.platform/assets/logo-official.png',
    };
  }
}
