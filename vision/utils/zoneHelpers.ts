import { RiskZoneType, Detection, SeverityLevel } from '../types';

export interface ZoneMetadata {
  name: RiskZoneType;
  color: string;
  securityLevel: 'Standard' | 'Elevated' | 'Maximum / Defcon 1';
  description: string;
}

export const RISK_ZONES: Record<RiskZoneType, ZoneMetadata> = {
  Kitchen: {
    name: 'Kitchen',
    color: '#F59E0B',
    securityLevel: 'Standard',
    description: 'Thermal cooking appliances, gas lines, and high-temperature fire monitoring zone.',
  },
  Bedroom: {
    name: 'Bedroom',
    color: '#3B82F6',
    securityLevel: 'Standard',
    description: 'Physiological monitoring, elderly inactivity check-in, and CO2 air quality zone.',
  },
  Garage: {
    name: 'Garage',
    color: '#EF4444',
    securityLevel: 'Elevated',
    description: 'Vehicle exhaust CO tracking, battery charging runaway, and exterior breach gate.',
  },
  Entrance: {
    name: 'Entrance',
    color: '#8B5CF6',
    securityLevel: 'Elevated',
    description: 'Main lobby turnstile, facial recognition, and tailgate intrusion detection zone.',
  },
  Balcony: {
    name: 'Balcony',
    color: '#22D3EE',
    securityLevel: 'Standard',
    description: 'Exterior structural stress, fall hazards, and perimeter drone/bird tracking.',
  },
  'Factory Floor': {
    name: 'Factory Floor',
    color: '#EC4899',
    securityLevel: 'Elevated',
    description: 'Industrial machinery, PPE helmet/vest compliance, and robotic arm safety perimeter.',
  },
  Warehouse: {
    name: 'Warehouse',
    color: '#A78BFA',
    securityLevel: 'Elevated',
    description: 'High-bay inventory racking, forklift motion tracking, and after-hours entry audit.',
  },
  'Restricted Area': {
    name: 'Restricted Area',
    color: '#EF4444',
    securityLevel: 'Maximum / Defcon 1',
    description: 'High-security server vaults, executive chambers, and biometric lock zones.',
  },
};

export function getZoneMetadata(zone: RiskZoneType): ZoneMetadata {
  return RISK_ZONES[zone] || RISK_ZONES['Entrance'];
}

export function computeZoneRiskScore(detections: Detection[]): number {
  if (!detections || detections.length === 0) return 0;
  const maxScore = detections.reduce((acc, d) => Math.max(acc, d.riskContribution), 0);
  return maxScore;
}
