// ============================================================================
// Sentinel AI — AI Confidence & Evidence Evaluator
// ============================================================================

import { AIConfidenceMetadata, AIInputContext } from '../types';

export class ConfidenceEvaluator {
  public static evaluateContextConfidence(
    context: AIInputContext,
    baseConfidence: number = 94
  ): AIConfidenceMetadata {
    const reasoning: string[] = [];
    const evidenceUsed: string[] = [];
    const missingInfo: string[] = [];
    const limitations: string[] = [
      'Visual occlusion in peripheral room corners may hide secondary hazards.',
      'AI inference relies on real-time sensor sampling rate (currently 100ms interval).',
      'Atmospheric smoke density can degrade long-range optical IR camera accuracy.',
    ];

    let computedScore = baseConfidence;

    // Check camera evidence
    if (context.cameraDetections.length > 0) {
      reasoning.push(`Optical object detector verified ${context.cameraDetections.length} bounding box anomalies with average confidence of ${(context.cameraDetections.reduce((acc, d) => acc + d.confidence, 0) / context.cameraDetections.length * 100).toFixed(1)}%.`);
      context.cameraDetections.forEach((d) => {
        evidenceUsed.push(`Camera stream ${d.cameraId} detected "${d.label}" @ ${d.timestamp}`);
      });
      computedScore = Math.min(99, computedScore + 2);
    } else {
      missingInfo.push('No direct optical camera detections in active alert bounding zone.');
      computedScore = Math.max(65, computedScore - 8);
    }

    // Check sensor telemetry
    const abnormalSensors = context.sensorValues.filter((s) => s.status !== 'normal');
    if (abnormalSensors.length > 0) {
      reasoning.push(`Multi-sensor fusion identified ${abnormalSensors.length} telemetry streams exceeding safety limits.`);
      abnormalSensors.forEach((s) => {
        evidenceUsed.push(`Sensor ${s.sensorId} (${s.type}) reading ${s.value} reported ${s.status.toUpperCase()}`);
      });
      computedScore = Math.min(99.5, computedScore + 3);
    } else {
      missingInfo.push('All environmental sensors currently report nominal equilibrium.');
    }

    // Check timeline consistency
    if (context.timeline.length >= 3) {
      reasoning.push(`Chronological timeline logs 3+ sequential escalating phase transitions supporting sustained incident verification.`);
    } else {
      missingInfo.push('Brief or incomplete historical timeline window (< 3 discrete event logs).');
    }

    // Check historical correlation
    if (context.pastIncidents.length > 0) {
      reasoning.push(`Zone has experienced ${context.pastIncidents.length} similar historical incident(s), validating structural vulnerability.`);
    }

    return {
      confidencePercentage: Number(computedScore.toFixed(1)),
      reasoning,
      evidenceUsed,
      missingInformation: missingInfo,
      limitations,
    };
  }
}
