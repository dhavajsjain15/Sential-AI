// ============================================================================
// Sentinel AI — Configurable Emergency Contact Suggestions
// ============================================================================

import { AIEmergencyContact, SupportedIncidentType } from '../types';

export class EmergencyContactsManager {
  private static defaultContacts: Record<AIEmergencyContact['category'], AIEmergencyContact> = {
    'Fire Service': {
      category: 'Fire Service',
      name: 'Municipal Fire & Rescue Dispatch (Station 12)',
      phoneOrChannel: '911 / Direct Fire Priority Trunk #841',
      dispatchPriority: 'IMMEDIATE',
      notes: 'Inform dispatch of exact chemical/gas hazard status and active thermal array telemetry.',
      isPlaceholder: true,
    },
    'Police': {
      category: 'Police',
      name: 'Metropolitan Police Tactical Response Unit',
      phoneOrChannel: '911 / Dispatch Channel Alpha-3',
      dispatchPriority: 'IMMEDIATE',
      notes: 'Provide live CCTV perimeter feed links and optical subject tracking coordinates.',
      isPlaceholder: true,
    },
    'Medical': {
      category: 'Medical',
      name: 'Rapid EMS Advanced Life Support (ALS) Ambulance',
      phoneOrChannel: '911 / EMS Dedicated Corridor Line',
      dispatchPriority: 'IMMEDIATE',
      notes: 'Report number of casualties, unresponsiveness status, and suspected smoke inhalation/burn severity.',
      isPlaceholder: true,
    },
    'Security': {
      category: 'Security',
      name: 'Facility Security Operations Center (SOC)',
      phoneOrChannel: 'Ext. 4400 / Radio Channel 1',
      dispatchPriority: 'HIGH',
      notes: 'Order immediate perimeter lockdown or designated fire door release.',
      isPlaceholder: true,
    },
    'Maintenance': {
      category: 'Maintenance',
      name: 'On-Call Chief Facilities & HVAC Engineer',
      phoneOrChannel: 'Ext. 2210 / Mobile Urgent Alert',
      dispatchPriority: 'HIGH',
      notes: 'Shut off main emergency gas valve and disconnect high-voltage transformer feed B2.',
      isPlaceholder: true,
    },
    'Community Volunteers': {
      category: 'Community Volunteers',
      name: 'Floor Warden & First Aid Certified Response Team',
      phoneOrChannel: 'Internal Broadcast PA & SMS Alert Group',
      dispatchPriority: 'ROUTINE',
      notes: 'Coordinate stairwell muster check and assist mobility-impaired occupants.',
      isPlaceholder: true,
    },
  };

  public static getRecommendationsForIncident(incidentType: SupportedIncidentType): AIEmergencyContact[] {
    const contacts: AIEmergencyContact[] = [];

    switch (incidentType) {
      case 'Fire':
      case 'Smoke':
      case 'Electrical Fire':
      case 'Explosion' as any:
      case 'Chemical Leak':
        contacts.push(this.defaultContacts['Fire Service']);
        contacts.push(this.defaultContacts['Medical']);
        contacts.push(this.defaultContacts['Security']);
        contacts.push(this.defaultContacts['Maintenance']);
        break;

      case 'Gas Leak':
      case 'Water Leak':
      case 'Flood':
      case 'Short Circuit':
      case 'Power Failure':
      case 'Industrial Accident':
        contacts.push(this.defaultContacts['Fire Service']);
        contacts.push(this.defaultContacts['Maintenance']);
        contacts.push(this.defaultContacts['Security']);
        break;

      case 'Fall Detection':
      case 'Medical Emergency':
      case 'Heart Attack (placeholder)':
      case 'Person Unconscious':
        contacts.push(this.defaultContacts['Medical']);
        contacts.push(this.defaultContacts['Security']);
        contacts.push(this.defaultContacts['Community Volunteers']);
        break;

      case 'Intrusion':
      case 'Violence':
      case 'Weapon Detection':
        contacts.push(this.defaultContacts['Police']);
        contacts.push(this.defaultContacts['Security']);
        contacts.push(this.defaultContacts['Medical']);
        break;

      case 'Child Safety':
      case 'Elderly Safety':
      case 'Animal Threat':
        contacts.push(this.defaultContacts['Security']);
        contacts.push(this.defaultContacts['Community Volunteers']);
        contacts.push(this.defaultContacts['Medical']);
        break;

      case 'Earthquake':
      case 'Cyclone':
      case 'Storm':
      default:
        contacts.push(this.defaultContacts['Fire Service']);
        contacts.push(this.defaultContacts['Medical']);
        contacts.push(this.defaultContacts['Police']);
        contacts.push(this.defaultContacts['Security']);
        contacts.push(this.defaultContacts['Maintenance']);
        contacts.push(this.defaultContacts['Community Volunteers']);
        break;
    }

    return contacts;
  }

  public static updateContactPlaceholder(category: AIEmergencyContact['category'], updated: Partial<AIEmergencyContact>): void {
    if (this.defaultContacts[category]) {
      this.defaultContacts[category] = {
        ...this.defaultContacts[category],
        ...updated,
        isPlaceholder: false,
      };
    }
  }

  public static getAllContacts(): AIEmergencyContact[] {
    return Object.values(this.defaultContacts);
  }
}
