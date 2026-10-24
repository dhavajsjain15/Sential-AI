// ============================================================================
// Sentinel AI — Admin & Operator Global Configuration Service
// ============================================================================

import { EventBus } from '../../iot/events/EventBus';

export interface RiskThresholdConfig {
  lowRiskMax: number; // e.g. 30 (Range 1-lowRiskMax: Background telemetry only)
  mediumRiskMax: number; // e.g. 70 (Range lowRiskMax+1 to mediumRiskMax: Owner/Dashboard warning)
  highRiskMin: number; // e.g. 71 (Range highRiskMin to 100+: Full emergency & Gemini escalation)
}

export interface MasterIntegrationToggles {
  liveIoTWebSocketsEnabled: boolean;
  geminiAutonomousTriageEnabled: boolean;
  communityTierEscalationEnabled: boolean;
  municipal911DispatchArmed: boolean;
  opticalYOLOPipelineEnabled: boolean;
}

export type AdminUserRole = 'System Admin' | 'Response Team' | 'Building Manager' | 'Standard User';

export interface AdminUserProfile {
  userId: string;
  fullName: string;
  role: AdminUserRole;
  email: string;
  assignedZones: string[];
  lastLogin: string;
}

export interface AdminAuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: 'Configuration Change' | 'Override Triggered' | 'Firmware Update' | 'Escalation Abort';
  details: string;
}

export class GlobalConfigService {
  private static instance: GlobalConfigService;
  private eventBus: EventBus = EventBus.getInstance();

  private thresholds: RiskThresholdConfig = {
    lowRiskMax: 30,
    mediumRiskMax: 70,
    highRiskMin: 71,
  };

  private toggles: MasterIntegrationToggles = {
    liveIoTWebSocketsEnabled: true,
    geminiAutonomousTriageEnabled: true,
    communityTierEscalationEnabled: true,
    municipal911DispatchArmed: false, // Default unarmed for presentation safety
    opticalYOLOPipelineEnabled: true,
  };

  private users: AdminUserProfile[] = [
    { userId: 'USR-001', fullName: 'Dr. Evelyn Vance', role: 'System Admin', email: 'vance@sentinel-ai.org', assignedZones: ['All Zones'], lastLogin: new Date().toISOString() },
    { userId: 'USR-002', fullName: 'Capt. Marcus Brody', role: 'Response Team', email: 'brody@sentinel-ai.org', assignedZones: ['Atrium', 'Kitchen', 'Server Room'], lastLogin: new Date().toISOString() },
    { userId: 'USR-003', fullName: 'Sarah Jenkins', role: 'Building Manager', email: 'jenkins@sentinel-ai.org', assignedZones: ['Logistics Bay 4', 'Parking Garage'], lastLogin: new Date().toISOString() },
    { userId: 'USR-004', fullName: 'David Miller', role: 'Standard User', email: 'miller@sentinel-ai.org', assignedZones: ['Executive Suite'], lastLogin: new Date().toISOString() },
  ];

  private auditLogs: AdminAuditLogEntry[] = [];

  private constructor() {
    this.logAudit('System Boot', 'GlobalConfigService initialized with baseline risk thresholds.', 'Configuration Change');
  }

  public static getInstance(): GlobalConfigService {
    if (!GlobalConfigService.instance) {
      GlobalConfigService.instance = new GlobalConfigService();
    }
    return GlobalConfigService.instance;
  }

  public getRiskThresholds(): RiskThresholdConfig {
    return { ...this.thresholds };
  }

  public updateRiskThresholds(lowMax: number, mediumMax: number, actor: string = 'System Admin'): RiskThresholdConfig {
    const safeLow = Math.max(5, Math.min(45, lowMax));
    const safeMedium = Math.max(safeLow + 10, Math.min(85, mediumMax));

    this.thresholds = {
      lowRiskMax: safeLow,
      mediumRiskMax: safeMedium,
      highRiskMin: safeMedium + 1,
    };

    this.logAudit(actor, `Updated risk thresholds: Low <= ${safeLow}%, Medium <= ${safeMedium}%, High >= ${safeMedium + 1}%`, 'Configuration Change');
    this.eventBus.publish('SIMULATION_SCENARIO_CHANGED', { thresholds: this.thresholds }, undefined, 'warning');
    return this.getRiskThresholds();
  }

  /**
   * Evaluates score against custom boundary overrides.
   */
  public evaluateRiskStatus(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score > Math.max(85, this.thresholds.highRiskMin + 14)) return 'CRITICAL';
    if (score >= this.thresholds.highRiskMin) return 'HIGH';
    if (score > this.thresholds.lowRiskMax) return 'MEDIUM';
    return 'LOW';
  }

  public getMasterToggles(): MasterIntegrationToggles {
    return { ...this.toggles };
  }

  public updateToggle(key: keyof MasterIntegrationToggles, value: boolean, actor: string = 'System Admin'): MasterIntegrationToggles {
    this.toggles[key] = value;
    this.logAudit(actor, `Toggled integration key "${key}" to ${value.toString().toUpperCase()}`, 'Configuration Change');
    return this.getMasterToggles();
  }

  public getUsers(): AdminUserProfile[] {
    return [...this.users];
  }

  public getAuditLogs(): AdminAuditLogEntry[] {
    return [...this.auditLogs];
  }

  public logAudit(actor: string, details: string, category: AdminAuditLogEntry['category'] = 'Configuration Change'): void {
    this.auditLogs.unshift({
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor,
      action: details,
      category,
      details,
    });
    if (this.auditLogs.length > 500) this.auditLogs.pop();
  }
}
