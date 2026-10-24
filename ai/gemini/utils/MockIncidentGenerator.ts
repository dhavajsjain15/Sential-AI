// ============================================================================
// Sentinel AI — Mock Realistic Incident Generator
// ============================================================================

import { AIInputContext, SupportedIncidentType } from '../types';

export interface MockIncidentPreset {
  id: string;
  name: string;
  type: SupportedIncidentType;
  description: string;
  context: AIInputContext;
}

export class MockIncidentGenerator {
  private static presets: Record<string, MockIncidentPreset> = {
    'kitchen-fire': {
      id: 'mock-kitchen-fire',
      name: 'Kitchen Fire (Residential/Commercial)',
      type: 'Fire',
      description: 'Thermal anomaly and optical smoke detection in kitchen cooking zone during peak operation.',
      context: {
        cameraDetections: [
          { cameraId: 'CAM-003', label: 'Smoke Cloud', confidence: 0.94, timestamp: new Date().toLocaleTimeString() },
          { cameraId: 'CAM-003', label: 'Open Flame / Stove Flare', confidence: 0.91, timestamp: new Date().toLocaleTimeString() },
        ],
        sensorValues: [
          { sensorId: 'SEN-003', type: 'Smoke Density', value: '0.12 %/ft', status: 'warning' },
          { sensorId: 'SEN-001', type: 'Thermal Array', value: '142.8°F', status: 'critical' },
        ],
        riskScore: 92,
        timeline: [
          { timestamp: '10:21', event: 'Optical smoke sensor SEN-003 registered 0.04 %/ft increase.' },
          { timestamp: '10:22', event: 'Thermal array registered rapid +18°F gradient rise over stove top.' },
          { timestamp: '10:24', event: 'YOLOv8 vision pipeline confirmed open flame bounding box overlap.' },
          { timestamp: '10:25', event: 'Kitchen automated fire containment armed. Risk score reached 92%.' },
        ],
        weather: { temp: '76°F', condition: 'Clear', humidity: '45%' },
        room: 'Commercial Kitchen Section 2',
        buildingType: 'Restaurant / Dining Facility',
        pastIncidents: [
          { id: 'INC-104', type: 'Smoke Alarm', timestamp: '2 weeks ago', resolution: 'Exhaust hood grease cleaning' }
        ],
        deviceStatus: [
          { deviceId: 'CAM-003', status: 'online' },
          { deviceId: 'SEN-003', status: 'online' },
          { deviceId: 'SEN-001', status: 'online' },
        ],
        evidence: [
          'Thermal array spiked from 82°F to 142.8°F in under 4 minutes.',
          'Optical smoke detector particulate density exceeded 0.10 %/ft threshold.',
          'Visual camera feed CAM-003 verified stove flare and spreading smoke plume.'
        ],
        peopleDetected: 2,
        objectsDetected: ['Stove', 'Cooking Oil Pan', 'Exhaust Hood', 'Personnel'],
        zone: 'Zone B - Food Prep',
        predictionScore: 96,
      },
    },

    'bathroom-fall': {
      id: 'mock-bathroom-fall',
      name: 'Bathroom Fall (Elderly/Medical)',
      type: 'Fall Detection',
      description: 'Sudden accelerometer and acoustic impact in bathroom with lack of motion after 60 seconds.',
      context: {
        cameraDetections: [
          { cameraId: 'CAM-005', label: 'Fallen Person (Privacy Silhouette)', confidence: 0.89, timestamp: new Date().toLocaleTimeString() }
        ],
        sensorValues: [
          { sensorId: 'SEN-010', type: 'Acoustic / Floor Impact', value: '74 dB Spike', status: 'warning' },
          { sensorId: 'SEN-011', type: 'mmWave Motion Radar', value: '0.0 m/s (Static > 60s)', status: 'critical' }
        ],
        riskScore: 84,
        timeline: [
          { timestamp: '14:12', event: 'Subject entered Master Bathroom.' },
          { timestamp: '14:15', event: 'Acoustic sensor SEN-010 registered 74 dB blunt floor impact.' },
          { timestamp: '14:16', event: 'mmWave radar SEN-011 verified zero respiratory/limb movement for 60 consecutive seconds.' },
        ],
        weather: { temp: '72°F', condition: 'Indoor Nominal' },
        room: 'Master Bathroom',
        buildingType: 'Elderly Care / Residential Apartment',
        pastIncidents: [],
        deviceStatus: [
          { deviceId: 'CAM-005', status: 'online' },
          { deviceId: 'SEN-010', status: 'online' },
          { deviceId: 'SEN-011', status: 'online' },
        ],
        evidence: [
          'Acoustic signature matched human fall profile (sharp transient followed by silence).',
          'Radar motion node confirmed stationary posture on tile floor > 60s.',
          'Privacy-preserving thermal silhouette confirms recumbent form near shower.'
        ],
        peopleDetected: 1,
        objectsDetected: ['Tile Floor', 'Shower Enclosure', 'Recumbent Subject'],
        zone: 'Residential Suite 402',
        predictionScore: 88,
      },
    },

    'garage-gas-leak': {
      id: 'mock-garage-gas-leak',
      name: 'Garage Gas Leak (CO/Methane)',
      type: 'Gas Leak',
      description: 'Elevated carbon monoxide and methane buildup detected near enclosed basement garage.',
      context: {
        cameraDetections: [],
        sensorValues: [
          { sensorId: 'SEN-002', type: 'CO / Methane Gas Array', value: '1,420 ppm', status: 'critical' },
          { sensorId: 'SEN-014', type: 'Airflow Velocity', value: '0.1 m/s (Stagnant)', status: 'warning' }
        ],
        riskScore: 95,
        timeline: [
          { timestamp: '03:40', event: 'Gas array SEN-002 crossed 400 ppm early warning threshold.' },
          { timestamp: '03:45', event: 'Gas concentration accelerated to 1,420 ppm in stagnant air pocket.' },
          { timestamp: '03:46', event: 'Automated ventilation fan failed to engage due to breaker trip.' },
        ],
        weather: { temp: '58°F', condition: 'Calm / High Humidity' },
        room: 'Basement Parking Garage B1',
        buildingType: 'Multi-Level Apartment Complex',
        pastIncidents: [
          { id: 'INC-089', type: 'Exhaust Fume Buildup', timestamp: '1 month ago', resolution: 'Manual vent purge' }
        ],
        deviceStatus: [
          { deviceId: 'SEN-002', status: 'online' },
          { deviceId: 'SEN-014', status: 'warning' },
        ],
        evidence: [
          'Gas concentration (1,420 ppm) is 3.5x IDLH dangerous exposure threshold.',
          'Stagnant airflow prevents natural atmospheric dissipation.',
          'Combustion risk elevated due to nearby electrical charging relay.'
        ],
        peopleDetected: 0,
        objectsDetected: ['Parked Vehicles', 'EV Charger', 'HVAC Duct'],
        zone: 'Sub-Level B1 Garage',
        predictionScore: 98,
      },
    },

    'warehouse-smoke': {
      id: 'mock-warehouse-smoke',
      name: 'Warehouse Smoke (Industrial Storage)',
      type: 'Smoke',
      description: 'Smoldering pallet insulation creating dense smoke layer before open flame ignition.',
      context: {
        cameraDetections: [
          { cameraId: 'CAM-012', label: 'Haze / Particulate Cloud', confidence: 0.88, timestamp: new Date().toLocaleTimeString() }
        ],
        sensorValues: [
          { sensorId: 'SEN-022', type: 'Beam Smoke Detector', value: '38% Obscuration', status: 'critical' },
          { sensorId: 'SEN-023', type: 'Infrared Thermal Scanner', value: '118°F (Hotspot A4)', status: 'warning' }
        ],
        riskScore: 81,
        timeline: [
          { timestamp: '19:10', event: 'Beam smoke detector SEN-022 registered 15% light obscuration.' },
          { timestamp: '19:18', event: 'Obscuration increased to 38%. IR thermal scanner localized 118°F hotspot in rack A4.' },
        ],
        weather: { temp: '68°F', condition: 'Dry / Windy Outside' },
        room: 'Logistics Bay 4',
        buildingType: 'Industrial Warehouse & Distribution Center',
        pastIncidents: [],
        deviceStatus: [
          { deviceId: 'CAM-012', status: 'online' },
          { deviceId: 'SEN-022', status: 'online' },
          { deviceId: 'SEN-023', status: 'online' },
        ],
        evidence: [
          'Optical beam attenuation reached 38% obscuration across 100m aisle path.',
          'IR hotspot localized exactly in Pallet Rack Section A4.',
          'Absence of rapid temperature spike indicates deep smoldering combustion.'
        ],
        peopleDetected: 4,
        objectsDetected: ['Cardboard Pallets', 'Forklift', 'Storage Racks'],
        zone: 'Bay 4 — High-Bay Storage',
        predictionScore: 89,
      },
    },

    'school-medical': {
      id: 'mock-school-medical',
      name: 'School Medical Emergency (Gymnasium)',
      type: 'Medical Emergency',
      description: 'Student collapsed during athletic training requiring immediate AED / medical triage.',
      context: {
        cameraDetections: [
          { cameraId: 'CAM-008', label: 'Crowd Gathering / Collapsed Student', confidence: 0.93, timestamp: new Date().toLocaleTimeString() }
        ],
        sensorValues: [
          { sensorId: 'SEN-030', type: 'Occupancy / Motion Array', value: 'High Rapid Cluster', status: 'warning' }
        ],
        riskScore: 78,
        timeline: [
          { timestamp: '11:05', event: 'Routine physical education activity ongoing.' },
          { timestamp: '11:14', event: 'CAM-008 detected sudden collapse of individual on basketball court.' },
          { timestamp: '11:15', event: 'Surrounding occupants rapidly converged into dense cluster.' },
        ],
        weather: { temp: '78°F', condition: 'Indoor High Activity' },
        room: 'Main Gymnasium',
        buildingType: 'Educational School Campus',
        pastIncidents: [],
        deviceStatus: [
          { deviceId: 'CAM-008', status: 'online' },
          { deviceId: 'SEN-030', status: 'online' },
        ],
        evidence: [
          'Visual AI confirmed individual lying motionless on gym floor.',
          'Rapid crowd clustering pattern indicative of acute medical crisis.',
          'No external environmental hazard (fire/gas) detected; isolated medical event.'
        ],
        peopleDetected: 24,
        objectsDetected: ['Basketball Court', 'Bleachers', 'AED Wall Cabinet (15m away)'],
        zone: 'Athletic Wing - Gym 1',
        predictionScore: 82,
      },
    },

    'apartment-intrusion': {
      id: 'mock-apartment-intrusion',
      name: 'Apartment Intrusion (After-Hours Breach)',
      type: 'Intrusion',
      description: 'Forced window entry detected at 02:15 AM with unauthorized movement in restricted executive foyer.',
      context: {
        cameraDetections: [
          { cameraId: 'CAM-002', label: 'Unauthorized Person (Masked)', confidence: 0.96, timestamp: new Date().toLocaleTimeString() },
          { cameraId: 'CAM-002', label: 'Crowbar / Hand Tool', confidence: 0.87, timestamp: new Date().toLocaleTimeString() }
        ],
        sensorValues: [
          { sensorId: 'SEN-005', type: 'Acoustic Glass Break', value: '42 dB Shatter Profile', status: 'critical' },
          { sensorId: 'SEN-033', type: 'Magnetic Window Contact', value: 'OPEN (BREACHED)', status: 'critical' }
        ],
        riskScore: 91,
        timeline: [
          { timestamp: '02:14', event: 'All executive security perimeters armed and nominal.' },
          { timestamp: '02:15', event: 'Acoustic sensor SEN-005 detected high-frequency glass shatter at North Balcony.' },
          { timestamp: '02:15:30', event: 'Magnetic contact SEN-033 triggered forced separation.' },
          { timestamp: '02:16', event: 'YOLOv8 confirmed masked subject carrying metallic tool moving towards foyer.' },
        ],
        weather: { temp: '54°F', condition: 'Rain / Low Visibility' },
        room: 'Executive Penthouse Foyer',
        buildingType: 'Luxury Apartment Tower',
        pastIncidents: [],
        deviceStatus: [
          { deviceId: 'CAM-002', status: 'online' },
          { deviceId: 'SEN-005', status: 'online' },
          { deviceId: 'SEN-033', status: 'online' },
        ],
        evidence: [
          'Exact acoustic frequency match for double-pane tempered glass fracture.',
          'Visual bounding box identified masked intruder and metallic pry tool.',
          'Event occurred at 02:15 AM during zero-occupancy lockdown schedule.'
        ],
        peopleDetected: 1,
        objectsDetected: ['Intruder Subject', 'Hand Tool / Crowbar', 'Shattered Window'],
        zone: 'Penthouse Level 40 — North Wing',
        predictionScore: 94,
      },
    },
  };

  public static getPreset(presetKey: string): MockIncidentPreset {
    return this.presets[presetKey] || this.presets['kitchen-fire'];
  }

  public static getAllPresets(): MockIncidentPreset[] {
    return Object.values(this.presets);
  }

  public static generateRandomContext(): AIInputContext {
    const keys = Object.keys(this.presets);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return { ...this.presets[randomKey].context };
  }
}
