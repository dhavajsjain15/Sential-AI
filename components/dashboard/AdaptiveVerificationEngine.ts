export type VerificationState =
  | 'IDLE'
  | 'AWAITING_STATUS'   // "Are you okay?"
  | 'AWAITING_MOBILITY' // "Can you stand safely?"
  | 'ESCALATING'        // Dispatched emergency
  | 'RESOLVED';         // Stand down

export interface IntentClassifier {
  isAffirmative: (text: string) => boolean;
  isNegativeOrDistress: (text: string) => boolean;
  isConfirmedSafe: (text: string) => boolean;
}

export const intentMatcher: IntentClassifier = {
  isAffirmative: (t) => /\b(yes|yeah|yep|i am|fine|okay|ok|always good|yes always good)\b/i.test(t),
  isNegativeOrDistress: (t) => /\b(no|can't|cannot|help|hurts|pain|stuck|fall|bleed|injured|unconscious)\b/i.test(t),
  isConfirmedSafe: (t) => /\b(standing|fine|i am okay|false alarm|all good|yes always good|always good|i'm up)\b/i.test(t),
};

export interface FsmStateUpdate {
  state: VerificationState;
  prompt: string;
  statusMessage: string;
  targetZone: string;
  confidenceScore: number;
  postureRatio: number;
}

export class AdaptiveSafetyController {
  private state: VerificationState = 'IDLE';
  private timer: NodeJS.Timeout | null = null;
  private currentTargetZone: string = 'Master Bedroom';

  constructor(
    private speak: (text: string) => Promise<void>,
    private onEscalate: (reason: string, urgency: 'HIGH' | 'CRITICAL') => void,
    private onResolved: () => void,
    private updateDigitalTwin: (data: FsmStateUpdate) => void
  ) {}

  public getState(): VerificationState {
    return this.state;
  }

  public async startAssessment(triggerReason: string = 'Fall Detection', targetZone: string = 'Master Bedroom') {
    this.currentTargetZone = targetZone;
    this.state = 'AWAITING_STATUS';

    this.updateDigitalTwin({
      state: 'AWAITING_STATUS',
      prompt: 'Emergency detected. Are you okay?',
      statusMessage: `Incident: ${triggerReason} — Verifying consciousness...`,
      targetZone: this.currentTargetZone,
      confidenceScore: 94,
      postureRatio: 1.34,
    });

    await this.speak('Emergency detected. Are you okay?');

    // 15s timeout for consciousness check
    this.armTimeout(15000, () => {
      this.state = 'ESCALATING';
      this.updateDigitalTwin({
        state: 'ESCALATING',
        prompt: 'Unresponsive timeout',
        statusMessage: 'Status: Unresponsive — Immediate rescue required',
        targetZone: this.currentTargetZone,
        confidenceScore: 98,
        postureRatio: 1.38,
      });
      this.speak('No response received. Dispatching emergency rescue team immediately.');
      this.onEscalate('Victim unresponsive to primary audio ping', 'CRITICAL');
    });
  }

  public async processSpeechInput(transcript: string) {
    if (this.state === 'AWAITING_STATUS') {
      this.clearTimeout();

      // Immediate resolution if exact codeword "yes always good" or "always good" is spoken
      if (transcript.toLowerCase().includes('always good')) {
        await this.resolveSafety('Safety codeword accepted. Returning to baseline.');
        return;
      }

      if (intentMatcher.isNegativeOrDistress(transcript)) {
        this.state = 'ESCALATING';
        this.updateDigitalTwin({
          state: 'ESCALATING',
          prompt: 'Distress confirmed',
          statusMessage: 'Status: Victim acknowledged distress — Immediate dispatch',
          targetZone: this.currentTargetZone,
          confidenceScore: 99,
          postureRatio: 1.42,
        });
        await this.speak('Understood. Dispatching assistance immediately. Stay still.');
        this.onEscalate('User verbally confirmed injury/distress', 'CRITICAL');
        return;
      }

      if (intentMatcher.isAffirmative(transcript)) {
        this.state = 'AWAITING_MOBILITY';
        this.updateDigitalTwin({
          state: 'AWAITING_MOBILITY',
          prompt: 'Can you stand up safely?',
          statusMessage: 'Status: Responsive — Verifying mobility...',
          targetZone: this.currentTargetZone,
          confidenceScore: 88,
          postureRatio: 1.25,
        });
        await this.speak('Can you stand up safely?');

        // 15s timeout for mobility check
        this.armTimeout(15000, () => {
          this.state = 'ESCALATING';
          this.updateDigitalTwin({
            state: 'ESCALATING',
            prompt: 'Mobility check timeout',
            statusMessage: 'Status: User responsive but unable to stand',
            targetZone: this.currentTargetZone,
            confidenceScore: 95,
            postureRatio: 1.35,
          });
          this.speak('Mobility check failed. Contacting emergency services.');
          this.onEscalate('User responsive but failed mobility confirmation', 'HIGH');
        });
        return;
      }
    }

    if (this.state === 'AWAITING_MOBILITY') {
      this.clearTimeout();

      if (intentMatcher.isConfirmedSafe(transcript) || intentMatcher.isAffirmative(transcript)) {
        await this.resolveSafety('Safety code accepted, emergency protocol aborted and no messages dispatched.');
      } else {
        this.state = 'ESCALATING';
        this.updateDigitalTwin({
          state: 'ESCALATING',
          prompt: 'Mobility compromised',
          statusMessage: 'Status: Mobility compromised — Emergency flagged',
          targetZone: this.currentTargetZone,
          confidenceScore: 96,
          postureRatio: 1.36,
        });
        await this.speak('Assistance request flagged. Contacting emergency contacts.');
        this.onEscalate('Mobility check failed: user unable to stand', 'HIGH');
      }
    }
  }

  public async forceResolve() {
    this.clearTimeout();
    await this.resolveSafety('Safety code accepted, emergency protocol aborted and no messages dispatched.');
  }

  public async forceEscalate() {
    this.clearTimeout();
    this.state = 'ESCALATING';
    this.updateDigitalTwin({
      state: 'ESCALATING',
      prompt: 'Manual Emergency Override',
      statusMessage: 'Status: Manual Emergency Override — Full Escalation',
      targetZone: this.currentTargetZone,
      confidenceScore: 100,
      postureRatio: 1.5,
    });
    await this.speak('Emergency override activated. Dispatching rescue team.');
    this.onEscalate('Manual emergency escalation triggered by operator', 'CRITICAL');
  }

  private async resolveSafety(message: string) {
    this.state = 'RESOLVED';
    this.updateDigitalTwin({
      state: 'RESOLVED',
      prompt: 'Protocol Aborted',
      statusMessage: 'Zone Nominal — Assessment cleared',
      targetZone: this.currentTargetZone,
      confidenceScore: 12,
      postureRatio: 0.85,
    });
    await this.speak(message);
    this.onResolved();

    // Standby transition back to IDLE after 4s
    setTimeout(() => {
      this.state = 'IDLE';
      this.updateDigitalTwin({
        state: 'IDLE',
        prompt: 'Standby Monitoring',
        statusMessage: 'System Baseline Nominal',
        targetZone: '',
        confidenceScore: 5,
        postureRatio: 0.8,
      });
    }, 4000);
  }

  private armTimeout(ms: number, callback: () => void) {
    this.clearTimeout();
    this.timer = setTimeout(callback, ms);
  }

  private clearTimeout() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
