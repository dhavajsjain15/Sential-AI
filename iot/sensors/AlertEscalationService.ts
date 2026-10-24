// ============================================================================
// Sentinel AI — Alert Escalation Service
// ============================================================================

import { IoTEscalationLevel } from '../models';
import { EventBus } from '../events/EventBus';

export class AlertEscalationService {
  private static instance: AlertEscalationService;
  private escalationLevels: IoTEscalationLevel[] = [
    { level: 1, name: 'Owner', delaySeconds: 0, notified: false, contactChannel: 'Push Notification & In-App Alarm' },
    { level: 2, name: 'Family', delaySeconds: 30, notified: false, contactChannel: 'SMS Alert & Automated Voice Call' },
    { level: 3, name: 'Security', delaySeconds: 60, notified: false, contactChannel: 'Facility SOC Radio & Priority Ticket' },
    { level: 4, name: 'Community', delaySeconds: 120, notified: false, contactChannel: 'Floor Warden Broadcast Network' },
    { level: 5, name: 'Emergency Services', delaySeconds: 180, notified: false, contactChannel: 'Direct 911 / EMS CAD Dispatch Trunk' },
  ];
  private eventBus: EventBus = EventBus.getInstance();
  private activeTimers: Map<number, any> = new Map();

  private constructor() {}

  public static getInstance(): AlertEscalationService {
    if (!AlertEscalationService.instance) {
      AlertEscalationService.instance = new AlertEscalationService();
    }
    return AlertEscalationService.instance;
  }

  public startEscalation(incidentId: string, severity: string): void {
    this.resetEscalation();

    // Immediately trigger Level 1
    this.triggerLevel(1, incidentId);

    if (severity === 'CRITICAL') {
      // For critical events, schedule progressive escalation
      this.escalationLevels.slice(1).forEach((lvl) => {
        const timer = setTimeout(() => {
          this.triggerLevel(lvl.level, incidentId);
        }, lvl.delaySeconds * 1000);
        this.activeTimers.set(lvl.level, timer);
      });
    }
  }

  public triggerLevel(levelNum: number, incidentId: string): boolean {
    const target = this.escalationLevels.find((l) => l.level === levelNum);
    if (!target || target.notified) return false;

    target.notified = true;
    target.timestamp = new Date().toISOString();

    this.eventBus.publish('ESCALATION_LEVEL_RAISED', {
      incidentId,
      level: target.level,
      name: target.name,
      contactChannel: target.contactChannel,
      triggeredAt: target.timestamp,
    }, undefined, 'critical');

    return true;
  }

  public acknowledgeIncident(incidentId: string, acknowledgedBy: string): void {
    // Stop pending timers when operator acknowledges
    this.activeTimers.forEach((timer) => clearTimeout(timer));
    this.activeTimers.clear();

    this.eventBus.publish('TELEMETRY_UPDATED', {
      incidentId,
      status: 'ACKNOWLEDGED',
      acknowledgedBy,
      timestamp: new Date().toISOString(),
    }, undefined, 'normal');
  }

  public resetEscalation(): void {
    this.activeTimers.forEach((timer) => clearTimeout(timer));
    this.activeTimers.clear();
    this.escalationLevels.forEach((l) => {
      l.notified = false;
      l.timestamp = undefined;
    });
  }

  public getEscalationStatus(): IoTEscalationLevel[] {
    return [...this.escalationLevels];
  }
}
