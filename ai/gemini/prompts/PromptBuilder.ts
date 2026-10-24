// ============================================================================
// Sentinel AI — Gemini Prompt Builder Service
// ============================================================================

import { AIInputContext, AIPromptTemplateType, SupportedIncidentType } from '../types';
import { PROMPT_TEMPLATES } from '../templates';

export class PromptBuilder {
  private context: Partial<AIInputContext> = {};
  private templateType: AIPromptTemplateType = 'Incident Analysis';
  private customInstructions: string[] = [];
  private outputLanguage: string = 'English';

  constructor(initialContext?: Partial<AIInputContext>) {
    if (initialContext) {
      this.context = { ...initialContext };
    }
  }

  public setTemplate(type: AIPromptTemplateType): this {
    this.templateType = type;
    return this;
  }

  public setLanguage(lang: string): this {
    this.outputLanguage = lang;
    return this;
  }

  public addCustomInstruction(instruction: string): this {
    this.customInstructions.push(instruction);
    return this;
  }

  public setRoomAndBuilding(room: string, zone: string, buildingType: string): this {
    this.context.room = room;
    this.context.zone = zone;
    this.context.buildingType = buildingType;
    return this;
  }

  public setRiskTelemetry(riskScore: number, predictionScore: number): this {
    this.context.riskScore = riskScore;
    this.context.predictionScore = predictionScore;
    return this;
  }

  public setSensorAndCameraTelemetry(
    sensors: AIInputContext['sensorValues'],
    cameras: AIInputContext['cameraDetections']
  ): this {
    this.context.sensorValues = sensors;
    this.context.cameraDetections = cameras;
    return this;
  }

  public setEnvironmentalFactors(
    weather: AIInputContext['weather'],
    peopleDetected: number,
    objectsDetected: string[]
  ): this {
    this.context.weather = weather;
    this.context.peopleDetected = peopleDetected;
    this.context.objectsDetected = objectsDetected;
    return this;
  }

  public setEvidenceAndTimeline(
    evidence: string[],
    timeline: AIInputContext['timeline'],
    pastIncidents: AIInputContext['pastIncidents'] = []
  ): this {
    this.context.evidence = evidence;
    this.context.timeline = timeline;
    this.context.pastIncidents = pastIncidents;
    return this;
  }

  public buildCompleteContext(): AIInputContext {
    return {
      cameraDetections: this.context.cameraDetections || [],
      sensorValues: this.context.sensorValues || [],
      riskScore: this.context.riskScore ?? 34,
      timeline: this.context.timeline || [],
      weather: this.context.weather || { temp: '72°F', condition: 'Nominal' },
      room: this.context.room || 'Main Facility',
      buildingType: this.context.buildingType || 'Enterprise Complex',
      pastIncidents: this.context.pastIncidents || [],
      deviceStatus: this.context.deviceStatus || [],
      evidence: this.context.evidence || [],
      peopleDetected: this.context.peopleDetected ?? 1,
      objectsDetected: this.context.objectsDetected || [],
      zone: this.context.zone || 'Zone A',
      predictionScore: this.context.predictionScore ?? 28,
    };
  }

  public buildSystemPrompt(): string {
    const template = PROMPT_TEMPLATES[this.templateType] || PROMPT_TEMPLATES['Incident Analysis'];
    const fullCtx = this.buildCompleteContext();

    let prompt = `${template.systemInstruction}\n\n`;
    prompt += `IMPORTANT MANDATE: Your response MUST be in ${this.outputLanguage}. If requested in Hindi or Tamil, translate explanations while maintaining standard technical terms.\n\n`;
    prompt += template.formatContext(fullCtx);

    if (this.customInstructions.length > 0) {
      prompt += `\n### ADDITIONAL INSTRUCTIONS:\n`;
      this.customInstructions.forEach((inst, idx) => {
        prompt += `${idx + 1}. ${inst}\n`;
      });
    }

    prompt += `\n### REQUIRED JSON SCHEMA OUTPUT:
Respond EXCLUSIVELY with valid JSON matching exactly this TypeScript interface structure without any markdown backticks or extra preamble if calling API directly:
{
  "incidentTitle": "Short descriptive title (e.g., 'Thermal Anomaly & Smoke Escalation in Kitchen')",
  "incidentType": "Must be one of: Fire | Smoke | Gas Leak | Water Leak | Flood | Electrical Fire | Short Circuit | Power Failure | Fall Detection | Medical Emergency | Person Unconscious | Intrusion | Violence | Weapon Detection | Child Safety | Elderly Safety | Chemical Leak | Animal Threat | Earthquake | Cyclone | Storm | Industrial Accident",
  "severity": "CRITICAL | HIGH | MODERATE | LOW",
  "confidence": number between 0 and 100,
  "summary": "Clear executive summary of what happened and why.",
  "evidence": ["list of concrete data points supporting conclusion"],
  "riskAnalysis": "Detailed explanation of why risk is high or low based on sensor fusion.",
  "immediateActions": ["bullet points of immediate life-safety actions"],
  "firstAid": {
    "category": "Burn | Fall | Smoke Inhalation | Bleeding | Electric Shock | Choking | Heat Stroke | Gas Exposure | General",
    "title": "Specific First Aid Triage Title",
    "immediateSteps": ["step 1", "step 2", "step 3"],
    "contraindications": ["what NOT to do"],
    "requiredEquipment": ["required first aid kit items"],
    "medicalDisclaimer": "DISCLAIMER: This guidance is generated by AI for immediate triage support only and does not substitute for professional medical care. CALL 911 / EMERGENCY SERVICES IMMEDIATELY."
  },
  "evacuationPlan": {
    "roomOrZone": "${fullCtx.room}",
    "riskLevel": "CRITICAL | HIGH | MODERATE | LOW",
    "blockedAreas": ["known obstructed exits"],
    "primaryRoute": "Primary escape path description",
    "secondaryRoute": "Backup escape path description",
    "peopleCount": ${fullCtx.peopleDetected},
    "specialNeedsBreakdown": { "children": 0, "elderly": 0, "pets": 0, "mobilityImpaired": 0 },
    "assemblyPoint": "Designated emergency muster area outside",
    "instructions": ["step 1 evacuation instruction", "step 2"]
  },
  "recommendedEmergencyServices": [
    {
      "category": "Fire Service | Police | Medical | Security | Maintenance | Community Volunteers",
      "name": "Service Name or Station",
      "phoneOrChannel": "911 / Local Emergency Channel",
      "dispatchPriority": "IMMEDIATE | HIGH | ROUTINE",
      "notes": "What to inform dispatch",
      "isPlaceholder": true
    }
  ],
  "safetyChecklist": ["Verify all exit routes clear", "Check fire suppression systems", "Confirm emergency contacts updated"],
  "followUpActions": ["Schedule inspection", "Reset smoke vents"],
  "recoverySuggestions": ["Decontaminate surfaces", "Verify air purity before reentry"],
  "insuranceNotes": "Telemetry verification notes for insurance auditor claim filing.",
  "confidenceMetadata": {
    "confidencePercentage": number,
    "reasoning": ["Why the AI reached this exact confidence level"],
    "evidenceUsed": ["Sensors/cameras relied upon"],
    "missingInformation": ["Any data points missing or unverified"],
    "limitations": ["Any limitations of this inference"]
  }
}`;

    return prompt;
  }
}
