# Brain Architecture & Intelligence Engines
## Sentinel AI — AI Core, Multi-Modal Sensor Fusion & Neural Attribution

---

## 1. Executive Summary & Brain Concept

The **Sentinel AI Brain** is the central intelligence core of the platform. It handles real-time data ingestion, multi-modal sensor fusion, computer vision optical flow tracking, explainable AI (XAI) causal factor attribution, deterministic voice state machine triage, and WebGL 3D spatial mapping.

Instead of treating emergency detection as a single black-box neural network call, the Sentinel Brain operates as a **deterministic, multi-stage decision pipeline**:

```
[ Ambient Sensors / Camera / Audio ]
                │
                ▼
   [ Optical Flow & Frame Diff ]
                │
                ▼
   [ XAI Attribution Engine ]  ──► (Calculates velocity, aspect ratio, immobility)
                │
                ▼
   [ Central Emergency Store ] ──► (Synchronizes 3D Twin & UI state)
                │
                ▼
  [ Deterministic Voice FSM ]  ──► (Verification dialog before dispatch)
                │
                ▼
  [ Forensic Ledger Stream ]  ──► (Append-only timestamped audit log)
```

---

## 2. Core Neural & Algorithmic Engines

### 2.1 Multi-Modal Sensor Fusion Engine (`store/useEmergencyStore.ts`)
Synthesizes telemetry inputs across 4 primary vectors:
1. **Optical Vector**: Centroid position, vertical drop velocity, posture aspect ratio ($W/H$).
2. **Acoustic Vector**: Speech energy, distress keywords ("help", "pain", "can't move"), acoustic silence duration.
3. **Environmental Vector**: Thermal readings (°F), smoke particulate density (%/ft), carbon monoxide (ppm), water leakage sensors.
4. **Spatial Vector**: Room prior hazards (e.g., Bathroom has a $1.35\times$ risk multiplier vs Living Room $1.00\times$).

### 2.2 Adaptive Voice Triage FSM (`engine/triageEngine.ts`)
Replaces dangerous open-ended chat with a deterministic state machine:
- **Low Confidence Mode (50–69%)**: 60-second verification window, soft check-in audio.
- **High Confidence Mode (70–89%)**: 25-second window, urgent status check.
- **Critical Mode (≥90%)**: Direct emergency tripwire bypass or 5s failsafe countdown.

```
State Flow:
IDLE ──► PROMPT_STATUS ──► PROMPT_MOBILITY ──► PROMPT_SEVERITY ──► DISPATCH_EMERGENCY
   │          │                  │                   │
   └──────────┴──────────────────┴───────────────────┴──► ABORT_STANDBY
```

### 2.3 Explainable AI (XAI) Attribution Engine (`engine/evalTriggerAttribution.ts`)
Generates human-auditable causal factor breakdowns during alerts:

$$S_{\text{total}} = w_v \cdot \Delta V + w_a \cdot A_r + w_m \cdot I_d + w_s \cdot S_a + w_p \cdot P_r$$

Where:
- $\Delta V$ = Downward centroid velocity delta
- $A_r$ = Geometric aspect ratio ($W > 1.15 \times H$)
- $I_d$ = Post-fall immobility duration
- $S_a$ = Speech distress state
- $P_r$ = Sector prior hazard weight

---

## 3. State Management Architecture

- **`useEmergencyStore`**: Reactive Zustand store holding current active incident, room zone, overall risk score, and active triage state.
- **`useIncidentHistoryStore`**: High-precision, append-only event log capturing millisecond timestamps (`HH:mm:ss.SSS`) for every FSM transition, sensor anomaly, and operator action.
- **`EventBus`**: Singleton pub-sub bus decoupling UI components from engine logic via standardized event channels:
  - `VOICE_ASSISTANT_TRIGGER`
  - `VOICE_FSM_STATE_CHANGE`
  - `FUSION_INCIDENT_TRIGGERED`
  - `FORCE_RESET_RISK_SCORE`

---

## 4. Safety Fail-Safes & Circuit Breakers

1. **Silence Failsafe**: If a subject is unresponsive for >25 seconds during a High-Confidence prompt, the FSM automatically escalates to `DISPATCH_EMERGENCY`.
2. **Instant Tripwire**: Immobility >45 seconds post-fall bypasses dialog entirely and triggers immediate dispatch.
3. **Manual Operator Override**: Emergency Action Panel permits instant SOS call or immediate standby abort.
