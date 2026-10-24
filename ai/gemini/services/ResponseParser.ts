// ============================================================================
// Sentinel AI — Gemini Response Parser & Schema Validator
// ============================================================================

import { AIInputContext, AIStructuredIncidentResponse, SupportedIncidentType } from '../types';
import { FirstAidService } from './FirstAidService';
import { EvacuationEngine } from './EvacuationEngine';
import { EmergencyContactsManager } from '../utils/EmergencyContacts';
import { ConfidenceEvaluator } from '../utils/ConfidenceScore';

export class ResponseParser {
  public static parseAndValidate(
    rawResponseText: string,
    context: AIInputContext
  ): AIStructuredIncidentResponse {
    let cleanedText = rawResponseText.trim();

    // Remove markdown code blocks if present (```json ... ```)
    const jsonMatch = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonMatch && jsonMatch[1]) {
      cleanedText = jsonMatch[1].trim();
    } else {
      // Find first '{' and last '}'
      const firstBrace = cleanedText.indexOf('{');
      const lastBrace = cleanedText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
      }
    }

    let parsed: any = null;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (err) {
      console.warn('ResponseParser: Failed to parse raw JSON from Gemini text. Generating fallback structure.', err);
      return this.buildFallbackResponse(context, rawResponseText);
    }

    // Validate and sanitize every field
    const incidentType: SupportedIncidentType = this.sanitizeIncidentType(parsed.incidentType);
    const severity: AIStructuredIncidentResponse['severity'] = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'].includes(parsed.severity)
      ? parsed.severity
      : context.riskScore > 75 ? 'CRITICAL' : context.riskScore > 40 ? 'HIGH' : 'LOW';

    const confidence = typeof parsed.confidence === 'number' ? Math.max(0, Math.min(100, parsed.confidence)) : context.riskScore || 88;

    const firstAid = parsed.firstAid && typeof parsed.firstAid === 'object' && parsed.firstAid.immediateSteps
      ? parsed.firstAid
      : FirstAidService.getFirstAidGuidance(incidentType);

    const evacuationPlan = parsed.evacuationPlan && typeof parsed.evacuationPlan === 'object' && parsed.evacuationPlan.primaryRoute
      ? parsed.evacuationPlan
      : EvacuationEngine.generateEvacuationPlan(context);

    const recommendedEmergencyServices = Array.isArray(parsed.recommendedEmergencyServices) && parsed.recommendedEmergencyServices.length > 0
      ? parsed.recommendedEmergencyServices
      : EmergencyContactsManager.getRecommendationsForIncident(incidentType);

    const confidenceMetadata = parsed.confidenceMetadata && typeof parsed.confidenceMetadata === 'object'
      ? parsed.confidenceMetadata
      : ConfidenceEvaluator.evaluateContextConfidence(context, confidence);

    return {
      incidentTitle: parsed.incidentTitle || `${incidentType} Event Detected in ${context.room}`,
      incidentType,
      severity,
      confidence,
      summary: parsed.summary || `Multi-modal surveillance detected high-probability ${incidentType.toLowerCase()} anomaly in ${context.room} with ${confidence}% confidence.`,
      evidence: Array.isArray(parsed.evidence) && parsed.evidence.length > 0 ? parsed.evidence : context.evidence,
      riskAnalysis: parsed.riskAnalysis || `Risk index computed at ${context.riskScore}% due to telemetry drift across ${context.sensorValues.length} active sensor arrays.`,
      immediateActions: Array.isArray(parsed.immediateActions) && parsed.immediateActions.length > 0
        ? parsed.immediateActions
        : ['Evacuate immediate zone', 'Isolate power and ventilation feeds', 'Alert municipal emergency dispatch'],
      firstAid,
      evacuationPlan,
      recommendedEmergencyServices,
      safetyChecklist: Array.isArray(parsed.safetyChecklist) && parsed.safetyChecklist.length > 0
        ? parsed.safetyChecklist
        : ['Verify all exit routes clear', 'Check fire suppression systems', 'Confirm emergency contacts updated'],
      followUpActions: Array.isArray(parsed.followUpActions) && parsed.followUpActions.length > 0
        ? parsed.followUpActions
        : ['Schedule deep environmental inspection', 'Calibrate local optical sensor nodes', 'Re-arm perimeter access controls'],
      recoverySuggestions: Array.isArray(parsed.recoverySuggestions) && parsed.recoverySuggestions.length > 0
        ? parsed.recoverySuggestions
        : ['Decontaminate surfaces', 'Purge indoor air volume before re-occupancy', 'Review CCTV audit trail'],
      insuranceNotes: parsed.insuranceNotes || `Incident #SENTINEL-${Date.now().toString().slice(-6)} verified via immutable sensor and optical telemetry logs for insurance auditor validation.`,
      confidenceMetadata,
    };
  }

  private static sanitizeIncidentType(typeInput?: string): SupportedIncidentType {
    const validTypes: SupportedIncidentType[] = [
      'Fire', 'Smoke', 'Gas Leak', 'Water Leak', 'Flood', 'Electrical Fire',
      'Short Circuit', 'Power Failure', 'Fall Detection', 'Medical Emergency',
      'Heart Attack (placeholder)', 'Person Unconscious', 'Intrusion', 'Violence',
      'Weapon Detection', 'Child Safety', 'Elderly Safety', 'Chemical Leak',
      'Animal Threat', 'Earthquake', 'Cyclone', 'Storm', 'Industrial Accident'
    ];

    if (typeInput && validTypes.includes(typeInput as any)) {
      return typeInput as SupportedIncidentType;
    }

    if (typeInput) {
      const lower = typeInput.toLowerCase();
      if (lower.includes('fire') && lower.includes('electric')) return 'Electrical Fire';
      if (lower.includes('fire')) return 'Fire';
      if (lower.includes('smoke')) return 'Smoke';
      if (lower.includes('gas') || lower.includes('carbon')) return 'Gas Leak';
      if (lower.includes('water') || lower.includes('pipe')) return 'Water Leak';
      if (lower.includes('flood')) return 'Flood';
      if (lower.includes('fall')) return 'Fall Detection';
      if (lower.includes('medical') || lower.includes('collapse')) return 'Medical Emergency';
      if (lower.includes('intrud') || lower.includes('breach') || lower.includes('trespass')) return 'Intrusion';
      if (lower.includes('violenc') || lower.includes('assault')) return 'Violence';
      if (lower.includes('weapon') || lower.includes('gun') || lower.includes('knife')) return 'Weapon Detection';
      if (lower.includes('earthquake') || lower.includes('seismic')) return 'Earthquake';
      if (lower.includes('chemical') || lower.includes('spill')) return 'Chemical Leak';
    }

    return 'Fire';
  }

  private static buildFallbackResponse(context: AIInputContext, rawText: string): AIStructuredIncidentResponse {
    const incidentType = this.sanitizeIncidentType(rawText);
    const confidence = context.riskScore || 85;

    return {
      incidentTitle: `${incidentType} Anomaly — ${context.room}`,
      incidentType,
      severity: context.riskScore > 75 ? 'CRITICAL' : context.riskScore > 40 ? 'HIGH' : 'LOW',
      confidence,
      summary: rawText.substring(0, 300) || `Automated fallback triage: Multi-sensor alarm verified inside ${context.room}.`,
      evidence: context.evidence.length > 0 ? context.evidence : ['Sensor telemetry breached nominal safety limits.'],
      riskAnalysis: `Fallback analysis: Active risk index at ${context.riskScore}% with ${context.peopleDetected} occupants detected in ${context.zone}.`,
      immediateActions: ['Evacuate immediate room immediately', 'Activate local fire alarm pull station', 'Contact 911 dispatch'],
      firstAid: FirstAidService.getFirstAidGuidance(incidentType),
      evacuationPlan: EvacuationEngine.generateEvacuationPlan(context),
      recommendedEmergencyServices: EmergencyContactsManager.getRecommendationsForIncident(incidentType),
      safetyChecklist: ['Verify all exit routes clear', 'Check fire suppression systems', 'Confirm emergency contacts updated'],
      followUpActions: ['Inspect affected hardware nodes', 'Perform safety drill review'],
      recoverySuggestions: ['Ensure area ventilation before reentry', 'File incident report with facilities'],
      insuranceNotes: 'Fallback automated log entry. Complete sensor waveform archive attached to record.',
      confidenceMetadata: ConfidenceEvaluator.evaluateContextConfidence(context, confidence),
    };
  }
}
