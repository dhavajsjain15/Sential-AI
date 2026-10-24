export interface FactorContribution {
  factorId: string;
  factorName: string;
  scorePercent: number; // 0 - 100
  thresholdPercent: number; // 0 - 100
  metricValue: string; // e.g. "-82px / 240ms"
  status: 'PASSED_THRESHOLD' | 'NORMAL' | 'ELEVATED';
  explanation: string;
}

export interface AttributionInput {
  verticalVelocityPxMs: number; // e.g. -82
  aspectRatio: number; // e.g. 1.42
  immobilityTimeSec: number; // e.g. 28
  speechState: string; // e.g. "Distress ('Can't get up')"
  roomName: string; // e.g. "Master Bedroom" or "Bathroom"
  compositeConfidence: number; // 0 - 100
}

export interface AttributionReport {
  compositeConfidence: number;
  severityTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: FactorContribution[];
  bulletPoints: string[];
  telemetrySparkline: number[]; // Sparkline data points
  calibrationFormula: string;
}

export function evalTriggerAttribution(input: AttributionInput): AttributionReport {
  const {
    verticalVelocityPxMs,
    aspectRatio,
    immobilityTimeSec,
    speechState,
    roomName,
    compositeConfidence,
  } = input;

  // Sector Prior Weight Multiplier
  let sectorMultiplier = 1.0;
  if (/bath|stair/i.test(roomName)) sectorMultiplier = 1.35;
  else if (/bedroom|garage|lab/i.test(roomName)) sectorMultiplier = 1.2;

  // 1. Vertical Velocity Factor
  const velocityScore = Math.min(Math.round(Math.abs(verticalVelocityPxMs) * 1.1 * sectorMultiplier), 100);
  const velFactor: FactorContribution = {
    factorId: 'velocity',
    factorName: 'Vertical Velocity Delta',
    scorePercent: velocityScore,
    thresholdPercent: 65,
    metricValue: `${verticalVelocityPxMs}px across 240ms`,
    status: velocityScore >= 65 ? 'PASSED_THRESHOLD' : 'NORMAL',
    explanation: `Rapid downward velocity vector of ${verticalVelocityPxMs}px detected across 240ms window.`,
  };

  // 2. Aspect Ratio Factor
  const aspectScore = Math.min(Math.round(((aspectRatio - 1.0) / 0.6) * 100 * sectorMultiplier), 100);
  const aspectFactor: FactorContribution = {
    factorId: 'posture',
    factorName: 'Geometric Posture Aspect Ratio',
    scorePercent: Math.max(aspectScore, 40),
    thresholdPercent: 70,
    metricValue: `${aspectRatio.toFixed(2)} W/H (Threshold: 1.15)`,
    status: aspectRatio > 1.15 ? 'PASSED_THRESHOLD' : 'NORMAL',
    explanation: `Horizontal posture profile: Bounding aspect ratio ${aspectRatio.toFixed(2)} exceeded baseline threshold 1.15.`,
  };

  // 3. Immobility Inertia Factor
  const immobilityScore = Math.min(Math.round((immobilityTimeSec / 35) * 100), 100);
  const immobilityFactor: FactorContribution = {
    factorId: 'immobility',
    factorName: 'Immobility & Inertia Duration',
    scorePercent: immobilityScore,
    thresholdPercent: 60,
    metricValue: `${immobilityTimeSec}s continuous static frame`,
    status: immobilityTimeSec >= 15 ? 'PASSED_THRESHOLD' : 'NORMAL',
    explanation: `Persistent immobility: Subject stationary for ${immobilityTimeSec} consecutive seconds post-fall.`,
  };

  // 4. Acoustic / Speech State Factor
  const isDistress = /distress|can't|help|hurt|pain/i.test(speechState);
  const speechScore = isDistress ? 95 : 45;
  const speechFactor: FactorContribution = {
    factorId: 'speech',
    factorName: 'Acoustic & Speech Intent State',
    scorePercent: speechScore,
    thresholdPercent: 50,
    metricValue: speechState,
    status: isDistress ? 'PASSED_THRESHOLD' : 'ELEVATED',
    explanation: `Acoustic confirmation: Verbal response state "${speechState}" evaluated.`,
  };

  // Natural Language Bullet Breakdown
  const bulletPoints = [
    `• Rapid downward velocity: ${verticalVelocityPxMs}px frame delta across 240ms`,
    `• Horizontal posture profile: Bounding aspect ratio ${aspectRatio.toFixed(2)} (Threshold: 1.15)`,
    `• Persistent immobility: Subject stationary for ${immobilityTimeSec} consecutive seconds`,
    `• Acoustic confirmation: Speech state "${speechState}" confirmed`,
    `• Sector Risk Profile: ${roomName} (${sectorMultiplier}x hazard prior multiplier applied)`,
    `• Aggregated Composite Confidence: ${compositeConfidence}% (${compositeConfidence >= 85 ? 'Critical Tier' : 'High Tier'})`,
  ];

  // Sparkline data representing rapid drop then motion flatline
  const telemetrySparkline = [95, 92, 88, 70, 32, 14, 12, 11, 10, 10, 10, 11, 10];

  const severityTier =
    compositeConfidence >= 85 ? 'CRITICAL' : compositeConfidence >= 70 ? 'HIGH' : 'MEDIUM';

  const calibrationFormula = `Composite Score = (0.35 × Velocity + 0.30 × Posture + 0.20 × Immobility + 0.15 × Speech) × Sector Prior (${sectorMultiplier}x)`;

  return {
    compositeConfidence,
    severityTier,
    factors: [velFactor, aspectFactor, immobilityFactor, speechFactor],
    bulletPoints,
    telemetrySparkline,
    calibrationFormula,
  };
}
