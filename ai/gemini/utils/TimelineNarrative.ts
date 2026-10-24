// ============================================================================
// Sentinel AI — AI Timeline Narrative Generator
// ============================================================================

import { AITimelineEntry, AITimelineNarrative } from '../types';

export class TimelineNarrativeBuilder {
  public static generateNarrative(
    incidentId: string,
    rawEvents: Array<{ timestamp: string; event: string }>,
    sensorType: string = 'Smoke',
    finalRiskScore: number = 94
  ): AITimelineNarrative {
    const entries: AITimelineEntry[] = [];
    const now = new Date();

    if (rawEvents.length > 0) {
      rawEvents.forEach((ev, idx) => {
        let stage: AITimelineEntry['severityStage'] = 'Detection';
        if (idx === rawEvents.length - 1 && finalRiskScore > 85) stage = 'Critical Declaration';
        else if (idx > 0) stage = 'Escalation';

        entries.push({
          timestamp: ev.timestamp,
          event: ev.event,
          sensorAnomaly: `${sensorType} deviation +${(idx + 1) * 15}%`,
          probabilityDeviation: Math.min(99, 30 + idx * 20),
          severityStage: stage,
        });
      });
    } else {
      // Generate standard chronological progression
      const baseTime = new Date(now.getTime() - 5 * 60000); // 5 minutes ago
      
      const formatTime = (offsetMin: number) => {
        const d = new Date(baseTime.getTime() + offsetMin * 60000);
        return d.toTimeString().substring(0, 5); // HH:MM
      };

      entries.push({
        timestamp: formatTime(0),
        event: `${sensorType} detected above nominal threshold in monitored zone.`,
        sensorAnomaly: `${sensorType} +18%`,
        probabilityDeviation: 32,
        severityStage: 'Detection',
      });

      entries.push({
        timestamp: formatTime(1),
        event: `Temperature increased to abnormal thermal rate (+4.2°F/min).`,
        sensorAnomaly: 'Thermal rate gradient steepening',
        probabilityDeviation: 54,
        severityStage: 'Escalation',
      });

      entries.push({
        timestamp: formatTime(2),
        event: `Optical surveillance confirmed human subject entered proximity.`,
        sensorAnomaly: 'Bounding box motion overlap with hazard zone',
        probabilityDeviation: 71,
        severityStage: 'Escalation',
      });

      entries.push({
        timestamp: formatTime(3),
        event: `Gas concentration and particulate density increased exponentially.`,
        sensorAnomaly: 'CO / CO2 cross-correlation spike',
        probabilityDeviation: 88,
        severityStage: 'Threshold Exceeded',
      });

      entries.push({
        timestamp: formatTime(4),
        event: `Incident probability exceeded 90%. Autonomous containment armed.`,
        sensorAnomaly: 'System probability index = 93.4%',
        probabilityDeviation: 93,
        severityStage: 'Threshold Exceeded',
      });

      entries.push({
        timestamp: formatTime(5),
        event: `CRITICAL ${sensorType.toUpperCase()} INCIDENT DECLARED. Emergency dispatch notifications dispatched.`,
        sensorAnomaly: 'Automated 911 / EMS protocol armed',
        probabilityDeviation: finalRiskScore,
        severityStage: 'Critical Declaration',
      });
    }

    const summaryParagraph = `Spatio-temporal analysis confirms a multi-stage ${sensorType.toLowerCase()} event initiating at ${
      entries[0]?.timestamp || 'N/A'
    } and escalating over ${entries.length} discrete phases to a critical hazard declaration at ${
      entries[entries.length - 1]?.timestamp || 'N/A'
    } with an aggregate AI confidence index of ${finalRiskScore}%.`;

    return {
      incidentId,
      generatedAt: now.toISOString(),
      entries,
      summaryParagraph,
    };
  }
}
