// ============================================================================
// Sentinel AI — Gemini Interaction & Audit Logger
// ============================================================================

import { AIInteractionLog, AIStructuredIncidentResponse } from '../types';

export class InteractionLogger {
  private static instance: InteractionLogger;
  private logs: AIInteractionLog[] = [];

  private constructor() {}

  public static getInstance(): InteractionLogger {
    if (!InteractionLogger.instance) {
      InteractionLogger.instance = new InteractionLogger();
    }
    return InteractionLogger.instance;
  }

  public logInteraction(
    prompt: string,
    response: string | AIStructuredIncidentResponse,
    userId: string = 'JD-OPERATOR-01',
    incidentId?: string,
    latencyMs: number = 120,
    cached: boolean = false
  ): AIInteractionLog {
    const log: AIInteractionLog = {
      id: `ai_log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      prompt,
      response,
      incidentId,
      userId,
      latencyMs,
      cached,
    };

    this.logs.unshift(log); // Prepend most recent first
    if (this.logs.length > 500) {
      this.logs.pop(); // Cap memory at 500 records
    }

    return log;
  }

  public recordFeedback(logId: string, feedback: 'positive' | 'negative' | 'neutral'): boolean {
    const entry = this.logs.find((l) => l.id === logId);
    if (entry) {
      entry.feedback = feedback;
      return true;
    }
    return false;
  }

  public getLogsByIncident(incidentId: string): AIInteractionLog[] {
    return this.logs.filter((l) => l.incidentId === incidentId);
  }

  public getLogsByUser(userId: string): AIInteractionLog[] {
    return this.logs.filter((l) => l.userId === userId);
  }

  public getAllLogs(): AIInteractionLog[] {
    return [...this.logs];
  }

  public getAuditAnalytics() {
    const total = this.logs.length;
    const avgLatency = total > 0 ? Math.round(this.logs.reduce((acc, l) => acc + l.latencyMs, 0) / total) : 0;
    const cachedCount = this.logs.filter((l) => l.cached).length;
    const positiveFeedback = this.logs.filter((l) => l.feedback === 'positive').length;
    const negativeFeedback = this.logs.filter((l) => l.feedback === 'negative').length;

    return {
      totalInteractions: total,
      averageLatencyMs: avgLatency,
      cacheHitRate: total > 0 ? ((cachedCount / total) * 100).toFixed(1) + '%' : '0%',
      positiveFeedbackCount: positiveFeedback,
      negativeFeedbackCount: negativeFeedback,
    };
  }
}
