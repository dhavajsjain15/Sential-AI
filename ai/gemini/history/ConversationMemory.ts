// ============================================================================
// Sentinel AI — Gemini Conversation Memory & Context Window Manager
// ============================================================================

export interface MemoryTurn {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  incidentContextId?: string;
  confidence?: number;
}

export class ConversationMemory {
  private static instance: ConversationMemory;
  private sessions: Map<string, MemoryTurn[]> = new Map();
  private maxTurnsPerSession: number = 20;

  private constructor() {}

  public static getInstance(): ConversationMemory {
    if (!ConversationMemory.instance) {
      ConversationMemory.instance = new ConversationMemory();
    }
    return ConversationMemory.instance;
  }

  public addTurn(
    sessionId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    incidentContextId?: string,
    confidence?: number
  ): MemoryTurn {
    const turn: MemoryTurn = {
      id: `turn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      role,
      content,
      timestamp: new Date().toISOString(),
      incidentContextId,
      confidence,
    };

    const turns = this.sessions.get(sessionId) || [];
    turns.push(turn);

    // Prune sliding window if exceeding max turns while keeping system instructions
    if (turns.length > this.maxTurnsPerSession) {
      const systemTurns = turns.filter((t) => t.role === 'system');
      const nonSystemTurns = turns.filter((t) => t.role !== 'system');
      const trimmedNonSystem = nonSystemTurns.slice(- (this.maxTurnsPerSession - systemTurns.length));
      this.sessions.set(sessionId, [...systemTurns, ...trimmedNonSystem]);
    } else {
      this.sessions.set(sessionId, turns);
    }

    return turn;
  }

  public getHistory(sessionId: string): MemoryTurn[] {
    return this.sessions.get(sessionId) || [];
  }

  public getHistoryAsGeminiMessages(sessionId: string): Array<{ role: string; parts: Array<{ text: string }> }> {
    const turns = this.getHistory(sessionId);
    return turns
      .filter((t) => t.role !== 'system')
      .map((t) => ({
        role: t.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: t.content }],
      }));
  }

  public clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  public getSessionSummary(sessionId: string): string {
    const turns = this.getHistory(sessionId);
    if (turns.length === 0) return 'No conversation history logged for this session.';
    return turns
      .map((t) => `[${t.timestamp}] (${t.role.toUpperCase()}): ${t.content.substring(0, 100)}...`)
      .join('\n');
  }
}
