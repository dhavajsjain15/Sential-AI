// ============================================================================
// Sentinel AI — Executive Analytics & System Efficacy Metrics
// ============================================================================

export interface EfficacyMetricsSummary {
  mttdSeconds: number; // Mean Time to Detect
  mtteSeconds: number; // Mean Time to Escalate
  falseAlarmRatePercentage: number;
  systemUptimePercentage: number;
  totalIncidentsAnalyzed: number;
  incidentBreakdownBySeverity: {
    CRITICAL: number;
    HIGH: number;
    MODERATE: number;
    LOW: number;
  };
  incidentBreakdownByType: Record<string, number>;
  incidentBreakdownByZone: Record<string, number>;
  responderEfficacy: Array<{
    responderType: 'Security Personnel' | 'Community Volunteers' | 'Municipal Emergency Services';
    averageResponseTimeSeconds: number;
    successRatePercentage: number;
  }>;
}

export class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public getGlobalEfficacyMetrics(): EfficacyMetricsSummary {
    return {
      mttdSeconds: 4.2, // Ultra-low 4.2 second AI detection window
      mtteSeconds: 18.5, // 18.5 seconds automated multi-tier escalation
      falseAlarmRatePercentage: 0.4, // Sub-1% false alarm rate via multi-sensor fusion
      systemUptimePercentage: 99.98,
      totalIncidentsAnalyzed: 148,
      incidentBreakdownBySeverity: {
        CRITICAL: 12,
        HIGH: 28,
        MODERATE: 44,
        LOW: 64,
      },
      incidentBreakdownByType: {
        'Fire & Smoke': 38,
        'Gas & Chemical Leak': 22,
        'Medical & Fall Emergency': 34,
        'Security Intrusion': 26,
        'Water Leak & Flood': 18,
        'Electrical & Power Anomaly': 10,
      },
      incidentBreakdownByZone: {
        'Main Kitchen & Dining': 42,
        'Executive Suite & Foyer': 28,
        'Server Room B1': 24,
        'Logistics Warehouse Bay 4': 32,
        'Underground Parking Garage': 22,
      },
      responderEfficacy: [
        {
          responderType: 'Security Personnel',
          averageResponseTimeSeconds: 85,
          successRatePercentage: 98.2,
        },
        {
          responderType: 'Community Volunteers',
          averageResponseTimeSeconds: 140,
          successRatePercentage: 94.5,
        },
        {
          responderType: 'Municipal Emergency Services',
          averageResponseTimeSeconds: 320,
          successRatePercentage: 99.4,
        },
      ],
    };
  }

  public getHeatmapZoneData(): Array<{ zone: string; riskIntensity: number; activeSensors: number; lastAlert: string }> {
    return [
      { zone: 'Main Kitchen & Dining', riskIntensity: 68, activeSensors: 6, lastAlert: 'Smoke Anomaly (+0.08 %/ft)' },
      { zone: 'Server Room B1', riskIntensity: 42, activeSensors: 4, lastAlert: 'Thermal Gradient Warning (+31.8°C)' },
      { zone: 'Underground Parking Garage', riskIntensity: 74, activeSensors: 5, lastAlert: 'CO Concentration Peak (380 ppm)' },
      { zone: 'Logistics Warehouse Bay 4', riskIntensity: 35, activeSensors: 8, lastAlert: 'Nominal Surveillance' },
      { zone: 'Executive Suite & Foyer', riskIntensity: 22, activeSensors: 4, lastAlert: 'Window Contact Closed Nominal' },
    ];
  }
}
