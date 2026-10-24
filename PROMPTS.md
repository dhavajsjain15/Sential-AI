# AI Prompt Specification & Voice Protocol Trees
## Sentinel AI — Voice Assistant TTS Prompts, System Prompts & Intent Specs

---

## 1. System Prompt Specification

### 1.1 Sentinel Assistant System Prompt (`AIAssistantPanel.tsx` & Copilot)
```text
You are Sentinel AI, an autonomous emergency intelligence copilot. Your primary mission is to protect human life, monitor spatial telemetry, evaluate environmental/medical risk vectors, and assist emergency commanders during active incidents.

Core Directives:
1. Maintain extreme clarity, objective tone, and rapid actionable briefings.
2. Structure responses using bullet points, bold key metrics, and precise timestamps.
3. Highlight high-severity items with clear alerts (CRITICAL, WARNING, NOMINAL).
4. Never assume ambiguous data; rely on fused telemetry from optical flow, gas sensors, and the XAI attribution engine.
```

---

## 2. Deterministic Voice Triage Prompt Tree (`VoiceAssistantProtocol.tsx`)

The Web Speech API Text-to-Speech (TTS) engine speaks structured, calibrated prompts depending on the active FSM state and escalation level.

### 2.1 Prompt Catalog by State

#### State 1: `PROMPT_STATUS`
- **Low Confidence Prompt (50–69%)**:
  > *"Sentinel AI checking in: An anomaly was detected in your room. Are you okay or do you need assistance?"*
- **High Confidence Prompt (70–89%)**:
  > *"Incident detected. Position change matches a possible fall. Are you injured? Please say Yes or No."*
- **Critical Event Prompt (≥90%)**:
  > *"Critical hazard detected! Initiating emergency protocol in 5 seconds. Say Cancel to abort."*

#### State 2: `PROMPT_MOBILITY`
- **TTS Text**:
  > *"Can you stand up or reach a telephone, or do you need us to notify emergency services immediately?"*

#### State 3: `PROMPT_SEVERITY`
- **TTS Text**:
  > *"Understood. Dispatching emergency response now. Please stay calm. Medical services are being notified."*

#### State 4: `DISPATCH_EMERGENCY`
- **TTS Text**:
  > *"Emergency dispatch confirmed. First responders have been notified with your exact room location and vitals."*

#### State 5: `FAMILY_DISPATCH`
- **TTS Text**:
  > *"Family SOS confirmed. Directly calling your primary contact Sarah and sending private SMS alerts to your family members."*

#### State 6: `ABORT_STANDBY`
- **TTS Text**:
  > *"Emergency standby cancelled. System returning to nominal surveillance mode."*

---

## 3. Semantic Speech Intent Matching Rules

The speech recognition handler (`webkitSpeechRecognition`) maps transcript text into strict intent categories:

### 3.1 Family-Only SOS Intents -> Direct Family Call & Targeted Notifications
- **Keywords**: `"call family"`, `"call my family"`, `"family sos"`, `"notify family"`, `"notify my family"`, `"alert family"`, `"call daughter"`, `"call my daughter"`, `"call son"`, `"call my son"`, `"call wife"`, `"call husband"`, `"family help"`, `"family only"`, `"call sarah"`, `"call michael"`
- **FSM Action**: Transition to `FAMILY_DISPATCH` -> Trigger `useFamilyEmergencyStore.dispatchFamilyOnlySOS()` (Suppresses 911 sirens).

### 3.2 Affirmative / Distress Intents -> Escalate or Confirm EMS Dispatch
- **Keywords**: `"yes"`, `"yeah"`, `"help"`, `"i'm hurt"`, `"pain"`, `"can't get up"`, `"ambulance"`, `"emergency"`, `"send help"`, `"i fell"`, `"bad"`
- **FSM Action**: Transition to `PROMPT_MOBILITY` or `DISPATCH_EMERGENCY`.

### 3.3 Negative / False Alarm Intents -> Abort Incident
- **Keywords**: `"no"`, `"fine"`, `"i'm fine"`, `"cancel"`, `"stop"`, `"false alarm"`, `"i'm ok"`, `"okay"`, `"mistake"`, `"abort"`
- **FSM Action**: Transition to `ABORT_STANDBY` & reset room hazard shader.

### 3.4 Speech Silence / Timeout Handling
- If speech recognition returns no text within `verificationWindowSec` (e.g. 25 seconds):
- **FSM Action**: Trigger `VERIFICATION_TIMED_OUT` event -> Transition to `DISPATCH_EMERGENCY`.

---

## 4. XAI Narrative Generation Prompt Template

When generating plain-English incident summaries for first responders and commanders:

```text
TEMPLATE:
"Incident [INCIDENT_ID] classified as [SEVERITY] at [TIMESTAMP]. Primary causal factor: [TOP_FACTOR_NAME] contributing [TOP_FACTOR_SCORE]% to total attribution. Secondary vectors include [FACTOR_2] ([SCORE_2]%) and [FACTOR_3] ([SCORE_3]%). Voice protocol state: [FSM_STATE]. Active zone: [ZONE_NAME]."

EXAMPLE OUTPUT:
"Incident FALL-84920 classified as CRITICAL at 14:32:05.892. Primary causal factor: Vertical Velocity Delta contributing 38% to total attribution. Secondary vectors include Posture Aspect Ratio (26%) and Immobility Duration (22%). Voice protocol state: DISPATCH_EMERGENCY. Active zone: Bedroom."
```
