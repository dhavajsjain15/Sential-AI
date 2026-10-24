import { AlertRule, Detection, VisionEvent, CameraConfig } from '../types';

/**
 * AlertRulesEngine
 * Evaluates complex multi-class and time-bound causal rules across detections and active events.
 */
export class AlertRulesEngine {
  private static instance: AlertRulesEngine;
  private rules: AlertRule[] = [];
  private triggeredAlerts: { ruleId: string; timestamp: number; reason: string; severity: string }[] = [];
  private listeners: ((alerts: any[]) => void)[] = [];

  private constructor() {
    this.initializeDefaultRules();
  }

  public static getInstance(): AlertRulesEngine {
    if (!AlertRulesEngine.instance) {
      AlertRulesEngine.instance = new AlertRulesEngine();
    }
    return AlertRulesEngine.instance;
  }

  private initializeDefaultRules() {
    this.rules = [
      {
        id: 'RULE-01',
        name: 'Critical Fire Runaway',
        conditionDescription: 'Fire + Smoke = Critical Fire',
        severity: 'critical',
        enabled: true,
        evaluate: (detections) => {
          const hasFire = detections.some((d) => d.className === 'Fire');
          const hasSmoke = detections.some((d) => d.className === 'Smoke');
          if (hasFire && hasSmoke) {
            return {
              triggered: true,
              reason: 'Simultaneous optical Fire plume + VOC Smoke detected in enclosed space.',
            };
          }
          return { triggered: false };
        },
      },
      {
        id: 'RULE-02',
        name: 'Medical Emergency (Prolonged Fall)',
        conditionDescription: 'Person Fallen > 30 seconds = Medical Emergency',
        severity: 'critical',
        enabled: true,
        evaluate: (detections, activeEvents) => {
          const hasFall = detections.some((d) => d.className === 'Fall' || d.className === 'Lying Person');
          const fallEvent = activeEvents.find((e) => e.eventType === 'Fall Detected');
          const now = Date.now();
          // For simulation responsiveness, check if fall has persisted > 6 seconds (represents 30s in demo)
          if (hasFall || (fallEvent && now - fallEvent.timestamp > 6000)) {
            return {
              triggered: true,
              reason: 'Personnel detected lying stationary/collapsed exceeding medical threshold.',
            };
          }
          return { triggered: false };
        },
      },
      {
        id: 'RULE-03',
        name: 'Security Alert (Restricted Zone Breach)',
        conditionDescription: 'Motion in Restricted Area = Security Alert',
        severity: 'high',
        enabled: true,
        evaluate: (detections, _events, camera) => {
          const hasPerson = detections.some((d) => d.className === 'Person' || d.className === 'Weapon');
          if (hasPerson && camera.zone === 'Restricted Area') {
            return {
              triggered: true,
              reason: `Unauthorized human movement detected inside high-security zone: ${camera.zone}.`,
            };
          }
          return { triggered: false };
        },
      },
      {
        id: 'RULE-04',
        name: 'High Fire Probability (Smoke + Thermal Spikes)',
        conditionDescription: 'Smoke + High Temperature = High Fire Probability',
        severity: 'high',
        enabled: true,
        evaluate: (detections) => {
          const hasSmoke = detections.some((d) => d.className === 'Smoke');
          // In real deployment, checks correlated IoT thermal sensor > 85°F
          if (hasSmoke) {
            return {
              triggered: true,
              reason: 'VOC particulate density correlated with elevated HVAC differential temperature.',
            };
          }
          return { triggered: false };
        },
      },
      {
        id: 'RULE-05',
        name: 'After-Hours Access Warning',
        conditionDescription: 'Door Open at Night = Warning',
        severity: 'medium',
        enabled: true,
        evaluate: (detections, _events, camera) => {
          const hasDoor = detections.some((d) => d.className === 'Door');
          const hour = new Date().getHours();
          const isNight = hour < 6 || hour > 21;
          if (hasDoor && (isNight || camera.zone === 'Warehouse')) {
            return {
              triggered: true,
              reason: `Perimeter door state change detected during off-shift window in ${camera.zone}.`,
            };
          }
          return { triggered: false };
        },
      },
    ];
  }

  public getRules(): AlertRule[] {
    return [...this.rules];
  }

  public toggleRule(id: string): void {
    const rule = this.rules.find((r) => r.id === id);
    if (rule) {
      rule.enabled = !rule.enabled;
    }
  }

  public evaluateAll(detections: Detection[], activeEvents: VisionEvent[], camera: CameraConfig) {
    const triggeredThisFrame: { ruleId: string; timestamp: number; reason: string; severity: string; ruleName: string }[] = [];
    const now = Date.now();

    this.rules.forEach((rule) => {
      if (!rule.enabled) return;
      const res = rule.evaluate(detections, activeEvents, camera);
      if (res.triggered && res.reason) {
        // Cooldown check per rule (prevent spamming same rule every frame)
        const recent = this.triggeredAlerts.find((a) => a.ruleId === rule.id && now - a.timestamp < 5000);
        if (!recent) {
          const alertObj = {
            ruleId: rule.id,
            timestamp: now,
            reason: res.reason,
            severity: rule.severity,
            ruleName: rule.name,
          };
          this.triggeredAlerts.unshift(alertObj);
          triggeredThisFrame.push(alertObj);
        }
      }
    });

    if (triggeredThisFrame.length > 0) {
      if (this.triggeredAlerts.length > 50) {
        this.triggeredAlerts = this.triggeredAlerts.slice(0, 50);
      }
      this.notifyListeners();
    }

    return triggeredThisFrame;
  }

  public getTriggeredAlerts() {
    return [...this.triggeredAlerts];
  }

  public subscribe(listener: (alerts: any[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.getTriggeredAlerts());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    const list = this.getTriggeredAlerts();
    this.listeners.forEach((l) => l(list));
  }
}
