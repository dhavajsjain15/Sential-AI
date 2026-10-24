// ============================================================================
// Sentinel AI — Evacuation Engine & Route Planning Service
// ============================================================================

import { AIEvacuationPlan, AIInputContext } from '../types';

export class EvacuationEngine {
  public static generateEvacuationPlan(context: AIInputContext): AIEvacuationPlan {
    const room = context.room || 'Main Facility';
    const risk = context.riskScore || 34;
    const peopleCount = context.peopleDetected || 1;
    const buildingType = context.buildingType || 'Enterprise Complex';

    let riskLevel: AIEvacuationPlan['riskLevel'] = 'LOW';
    if (risk > 80) riskLevel = 'CRITICAL';
    else if (risk > 50) riskLevel = 'HIGH';
    else if (risk > 30) riskLevel = 'MODERATE';

    // Determine blocked areas based on active sensor warnings or camera detections
    const blockedAreas: string[] = [];
    context.sensorValues.forEach((s) => {
      if (s.status === 'critical' || s.status === 'warning') {
        blockedAreas.push(`Zone surrounding ${s.type} Node (${s.sensorId})`);
      }
    });

    if (context.cameraDetections.some((d) => d.label.toLowerCase().includes('fire') || d.label.toLowerCase().includes('smoke'))) {
      blockedAreas.push('Primary Central Corridor & Main Atrium Stairwell');
    }

    if (blockedAreas.length === 0) {
      blockedAreas.push('No blocked corridors currently detected by optical or thermal sensors.');
    }

    // Determine primary and secondary routes based on room
    let primaryRoute = `Exit ${room} via primary doorway, proceed along South Corridor to Emergency Exit stairwell A.`;
    let secondaryRoute = `If South Corridor is compromised, proceed via North Emergency Fire Door to Exterior Fire Escape B.`;

    if (room.toLowerCase().includes('kitchen')) {
      primaryRoute = 'Exit immediately through Rear Kitchen Service Door directly to Exterior Loading Dock.';
      secondaryRoute = 'If rear door is obstructed, move through Dining Hall emergency side exit (DO NOT use kitchen elevator).';
    } else if (room.toLowerCase().includes('server') || room.toLowerCase().includes('garage')) {
      primaryRoute = 'Exit via Fire-Rated Blast Door to Level B1 North Stairwell and ascend to ground level.';
      secondaryRoute = 'Use Emergency Ventilation Access Hatch corridor directly to Exterior Parking Ramp.';
    }

    // Estimate special needs breakdown from population
    const children = Math.max(0, Math.floor(peopleCount * (buildingType.toLowerCase().includes('school') ? 0.8 : 0.1)));
    const elderly = Math.max(0, Math.floor(peopleCount * (buildingType.toLowerCase().includes('elderly') ? 0.9 : 0.05)));
    const pets = Math.max(0, Math.floor(peopleCount * (buildingType.toLowerCase().includes('house') || buildingType.toLowerCase().includes('apartment') ? 0.3 : 0)));
    const mobilityImpaired = Math.max(0, Math.ceil(peopleCount * 0.05));

    const assemblyPoint = `Exterior Muster Station Alpha — North Parking Lot (150m clear of ${buildingType} perimeter).`;

    const instructions = [
      `IMMEDIATE ALARM: Alert all ${peopleCount} occupants in ${room} to evacuate calmly and swiftly without gathering personal items.`,
      `ROUTE VERIFICATION: Follow ${primaryRoute}. Verify door handles with back of hand before opening to check for backdraft heat.`,
      `OBSTRUCTION BYPASS: If encountering smoke or blocked zones (${blockedAreas.join(', ')}), drop low to the floor where air is clearest and divert to: ${secondaryRoute}.`,
      `SPECIAL ASSISTANCE: Assign able-bodied occupants to assist ${mobilityImpaired + elderly + children} vulnerable individuals (Children: ${children}, Elderly: ${elderly}, Mobility Impaired: ${mobilityImpaired}).`,
      `MUSTER ACCOUNTING: Proceed directly to ${assemblyPoint}. Do not re-enter the facility until Municipal Fire Command issues an explicit all-clear certificate.`,
    ];

    return {
      roomOrZone: room,
      riskLevel,
      blockedAreas,
      primaryRoute,
      secondaryRoute,
      peopleCount,
      specialNeedsBreakdown: {
        children,
        elderly,
        pets,
        mobilityImpaired,
      },
      assemblyPoint,
      instructions,
    };
  }
}
