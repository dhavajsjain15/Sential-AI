# Product Requirements Document (PRD)
## Sentinel AI — Autonomous Universal Risk & Emergency Intelligence Platform

---

## 1. Executive Overview & Product Vision

### 1.1 Product Vision
**Sentinel AI** is an enterprise-grade, autonomous risk intelligence and emergency response platform designed for real-time threat detection, multi-modal sensor fusion, deterministic voice triage, and 3D spatial incident command. By combining edge computer vision (optical flow), ambient telemetry, explainable AI (XAI) attribution, and web-based 3D digital twins, Sentinel AI reduces emergency response latency from minutes to milliseconds while providing total decision transparency.

### 1.2 Core Value Proposition
- **Predictive Risk Intelligence**: Continuous 12-layer threat classification across physical, environmental, health, and cyber vectors.
- **Deterministic Voice Triage**: Finite State Machine (FSM) voice protocol that verifies subject status before triggering high-cost emergency dispatch.
- **Explainable Decision Forensics**: Transparent XAI engine calculating weighted causal factor contributions (velocity, aspect ratio, immobility, acoustics, sector prior).
- **3D Incident Command Center**: WebGL digital twin with automatic room camera tweening and translucent red warning beacons.
- **High-Precision Audit Ledger**: Append-only, millisecond-timestamped forensic event log for medical, security, and insurance audits.

---

## 2. Target Personas & Use Cases

### 2.1 Personas
1. **Incident Commander / Security Director**: Needs macro situational awareness, real-time 3D spatial mapping, and immediate SOS dispatch overrides.
2. **First Responder / Medical Operator**: Requires rapid diagnostic summaries, XAI cause attribution, and exact room/zone coordinates.
3. **Facility Manager / Smart Building Operator**: Focuses on environmental sensors (gas, smoke, HVAC thermal anomalies) and hardware asset health.
4. **Resident / Care Recipient**: Interacts with the multi-turn voice assistant when a slip, fall, or anomaly is detected.

---

## 3. Key Feature Specifications

### 3.1 Active Incident Command Center (3D Digital Twin)
- **Interactive 3D Matrix**: WebGL canvas rendering building floor plans and room meshes (Bedroom, Bathroom, Living Room, Kitchen, Server Room).
- **Hazard Pulse Shader**: Dynamic translucent red warning beacon (`#ef4444`) applied to meshes matching active `zoneId`.
- **Dynamic Camera Tweening**: Smooth camera position and target interpolation lerping directly to affected zones upon incident trigger.

### 3.2 Adaptive Triage Engine & FSM Voice Assistant
- **Confidence-Weighted Escalation**:
  - Low (50–69%): 60s verification window, gentle audio check.
  - High (70–89%): 25s verification window, urgent audio prompt.
  - Critical (≥90% or zero movement >45s): Instant tripwire (5s failsafe or direct dispatch).
- **Multi-Turn Deterministic Dialogue States**:
  - `PROMPT_STATUS` ("Are you okay?")
  - `PROMPT_MOBILITY` ("Can you stand or reach a phone?")
  - `PROMPT_SEVERITY` ("Do you require an ambulance or emergency contact?")
  - `DISPATCH_EMERGENCY` (SOS dispatch locked)
  - `ABORT_STANDBY` (Incident resolved / false positive)

### 3.3 Explainable AI (XAI) Decision Forensics
- **Attribution Breakdown**: Human-auditable score (0–100%) computed for:
  - Vertical Velocity Delta (Centroid downward drop)
  - Geometric Aspect Ratio ($W > 1.15 \times H$)
  - Immobility / Inertia Duration (Post-fall pixel variance)
  - Acoustic / Distress Keyword State
  - Sector Prior Multiplier (Bathroom/Staircase vs Living Room)
- **Evidence Graph Summary**: Natural language narrative generation detailing the top contributing vectors.

### 3.4 Hardware Webcam & 1-Second Optical Flow Telemetry
- **Live Optical Flow HUD**: 1-second ticking telemetry displaying motion multiplier, delta deviation %, fall risk index %, and posture state.
- **Scenario Simulation Injector**: Ability to inject synthetic scenarios ('Person Fallen', 'Critical Fire & Smoke', 'Intrusion Breach') into live webcam stream for training and validation.
- **Interactive Side Action Controls**: Direct side buttons to focus optical tracking on specific threat categories.

---

## 4. Non-Functional Requirements

### 4.1 Reliability & Latency
- **Sub-Second Processing**: Local optical flow and FSM state updates must evaluate in $<100\text{ ms}$.
- **Zero Silent Failures**: Fallback circuit breakers to instant 911 dispatch if speech API times out or fails.
- **Deterministic State Safety**: FSM transitions must be immutable and logged to the central event store.

### 4.2 Security & Compliance
- **Local-First Privacy**: Optical processing occurs on client-side canvas without streaming raw video to third-party cloud servers.
- **Audit Compliance**: Millisecond-accurate ISO 8601 timestamps for all state transitions and user overrides.
