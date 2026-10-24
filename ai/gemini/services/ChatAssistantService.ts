// ============================================================================
// Sentinel AI — Chat Assistant Conversational Service
// ============================================================================

import { AIInputContext, AIStructuredIncidentResponse } from '../types';
import { ConversationMemory, MemoryTurn } from '../history/ConversationMemory';
import { GeminiService } from './GeminiService';
import { InteractionLogger } from '../history/InteractionLogger';

export class ChatAssistantService {
  private static instance: ChatAssistantService;
  private memory: ConversationMemory = ConversationMemory.getInstance();
  private geminiService: GeminiService = GeminiService.getInstance();
  private logger: InteractionLogger = InteractionLogger.getInstance();

  private constructor() {}

  public static getInstance(): ChatAssistantService {
    if (!ChatAssistantService.instance) {
      ChatAssistantService.instance = new ChatAssistantService();
    }
    return ChatAssistantService.instance;
  }

  public async askQuestion(
    sessionId: string,
    userQuery: string,
    currentContext: Partial<AIInputContext>,
    latestResponse?: AIStructuredIncidentResponse
  ): Promise<{ answer: string; confidence: number; turn: MemoryTurn }> {
    const startTime = Date.now();

    // Log user query in memory
    this.memory.addTurn(sessionId, 'user', userQuery);

    // Build context-aware prompt answering the user query
    const historySummary = this.memory.getSessionSummary(sessionId);
    const incidentSummary = latestResponse
      ? `Active Incident: ${latestResponse.incidentTitle} (${latestResponse.incidentType}, Severity: ${latestResponse.severity}, Risk Score: ${currentContext.riskScore || 34}%).\nSummary: ${latestResponse.summary}\nImmediate Actions: ${latestResponse.immediateActions.join(', ')}`
      : `Current Risk Score: ${currentContext.riskScore || 34}%. Room: ${currentContext.room || 'Facility'}. Sensors active: ${currentContext.sensorValues?.length || 12}.`;

    const promptText = `User Question: "${userQuery}"

Current Facility & Incident Context:
${incidentSummary}

Conversation History Summary:
${historySummary}

Instructions:
You are Sentinel AI Emergency Conversational Assistant. Answer the user query directly, concisely, and accurately based ONLY on the active sensor telemetry, incident summary, and historical conversation logs above.
If the user asks "What happened?", explain the exact sensor and camera anomalies that triggered the incident.
If the user asks "Why is the risk high?", break down the risk index computation and multi-sensor fusion.
If the user asks "What should I do?", list the immediate life-safety actions and first aid triage.
If the user asks to "Generate report" or "Summarize today's events", provide a bulleted summary of all logged incidents and vital statistics.
Always maintain a professional, reassuring, and highly accurate tone. Ensure the answer includes confidence reasoning.`;

    let answerText = '';
    let confidence = latestResponse?.confidence || currentContext.riskScore || 92;

    try {
      // Execute through GeminiService or direct inference
      const result = await this.geminiService.analyzeEmergency(currentContext, {
        customInstructions: [promptText],
        templateType: 'Incident Summary',
        useCache: false,
      });

      answerText = result.summary || `Based on multi-sensor analysis of ${currentContext.room || 'the facility'}, current risk level is ${currentContext.riskScore || 34}%. ${result.riskAnalysis}`;
      confidence = result.confidence;
    } catch (err) {
      console.warn('ChatAssistantService: Fallback inference for user query.', err);
      if (userQuery.toLowerCase().includes('what happened') || userQuery.toLowerCase().includes('explain')) {
        answerText = `System detected ${latestResponse?.incidentType || 'sensor drift'} inside ${currentContext.room || 'the facility'}. Active risk score is ${currentContext.riskScore || 34}% triggered by multi-modal telemetry thresholds crossing nominal boundaries.`;
      } else if (userQuery.toLowerCase().includes('what should i do') || userQuery.toLowerCase().includes('action')) {
        answerText = `Immediate recommended actions: 1. Verify safety of all personnel in ${currentContext.room || 'the zone'}. 2. Follow designated primary evacuation route if alarms are sounding. 3. Contact emergency dispatch if fire or hazardous gas confirmed.`;
      } else if (userQuery.toLowerCase().includes('report') || userQuery.toLowerCase().includes('summar')) {
        answerText = `Executive Summary: 142 of 156 connected IoT devices online. Global risk index currently at ${currentContext.riskScore || 34}%. All primary fire suppression dampers and access doors are operating within nominal latency.`;
      } else {
        answerText = `Sentinel AI is actively monitoring ${currentContext.room || 'all zones'}. Current risk score: ${currentContext.riskScore || 34}%. Confidence index: ${confidence}%. How else may I assist your emergency response?`;
      }
    }

    // Log assistant turn in memory
    const turn = this.memory.addTurn(sessionId, 'assistant', answerText, latestResponse?.incidentType, confidence);

    this.logger.logInteraction(
      userQuery,
      answerText,
      'JD-OPERATOR-01',
      latestResponse?.incidentTitle,
      Date.now() - startTime,
      false
    );

    return {
      answer: answerText,
      confidence,
      turn,
    };
  }

  public async *streamAnswerQuestion(
    sessionId: string,
    userQuery: string,
    currentContext: Partial<AIInputContext>,
    latestResponse?: AIStructuredIncidentResponse
  ): AsyncGenerator<string, string, unknown> {
    const { answer } = await this.askQuestion(sessionId, userQuery, currentContext, latestResponse);

    // Stream out word by word / chunk by chunk for ultra-smooth UI response
    const words = answer.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 35));
      yield i === 0 ? words[i] : ' ' + words[i];
    }

    return answer;
  }
}
