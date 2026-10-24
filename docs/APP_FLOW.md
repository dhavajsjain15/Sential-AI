# Application Flow & Navigation Architecture
## Sentinel AI — Routing Sitemap & User Journeys

---

## 1. Application Sitemap Hierarchy

```
Sentinel AI Platform
│
├── Public Landing & Marketing Pages
│   ├── / (Home / Landing Page)
│   ├── /features (Features & Capabilities Overview)
│   ├── /technology (AI & Sensor Fusion Architecture)
│   ├── /about (Mission & Executive Team)
│   └── /contact (Enterprise Inquiries & Support)
│
└── Dashboard Application (/dashboard)
    ├── Overview (/dashboard) [Executive Command Center]
    ├── Risk Intelligence (/dashboard/risk-intelligence) [XAI & 12-Layer Threat Grid]
    ├── Live Monitoring (/dashboard/live-monitoring) [Vision Analytics & Sensor Grid]
    ├── Live Web Camera (/dashboard/live-webcam) [1s Optical Flow Telemetry Stream]
    ├── 3D Digital Twin (/dashboard/digital-twin) [Active 3D Spatial Canvas]
    ├── Incidents (/dashboard/incidents) [SOS Dispatch & Forensic Audit Ledger]
    ├── Analytics (/dashboard/analytics) [Historical Visualizations & Trends]
    ├── Devices (/dashboard/devices) [Hardware Asset Management]
    ├── Reports (/dashboard/reports) [Automated AI Intelligence Briefings]
    ├── Emergency Replay (/dashboard/emergency-replay) [Timeline Playback & AAR]
    ├── Notifications (/dashboard/notifications) [Smart Alert Center]
    ├── AI Assistant (/dashboard/ai-assistant) [Interactive Copilot & Chat]
    ├── Settings (/dashboard/settings) [System Configuration & Rules]
    └── Profile (/dashboard/profile) [User Profile & Access Credentials]
```

---

## 2. Emergency Escalation User Journey

```mermaid
sequenceDiagram
    autonumber
    actor Resident as Resident / Subject
    participant Cam as Hardware WebCam / Sensor
    participant Fusion as Fusion Engine (Store)
    participant XAI as XAI Attribution Engine
    participant FSM as Voice Triage FSM Protocol
    participant Twin as 3D Digital Twin Matrix
    participant Dispatch as Emergency Control SOS

    Cam->>Fusion: Optical Flow Anomaly (Downward Velocity > Threshold)
    Fusion->>XAI: Ingest Frame, Aspect Ratio, Immobility Data
    XAI-->>Fusion: Return Attribution Score (88% Fall Confidence)
    Fusion->>Twin: Trigger Incident in 'Bedroom' Zone (Pulse Shader + Camera Tween)
    Fusion->>FSM: Launch Voice Protocol (High Confidence: 25s window)
    FSM->>Resident: TTS Audio: "Incident detected. Are you injured?"
    alt Speech Response: "No, I'm fine"
        Resident-->>FSM: Intent Matched: "FINE" / "CANCEL"
        FSM->>Fusion: Abort Incident -> Set State to ABORT_STANDBY
        Fusion->>Twin: Reset Room Shader to Nominal
    else Speech Response: "Help" OR Silence (25s Timeout)
        Resident-->>FSM: Intent Matched: "HELP" OR Timeout Failsafe
        FSM->>Dispatch: Tripwire Triggered -> Set State to DISPATCH_EMERGENCY
        Dispatch->>Dispatch: Execute 911 SOS Auto-Call & Dispatch Push
        FSM->>Fusion: Append Event to Forensic Audit Ledger
    end
```

---

## 3. Navigation Scenarios

### Scenario A: Executive Review
1. User logs onto `/dashboard`.
2. Reviews global risk score (34%) and active status badges.
3. Clicks **Risk Intelligence & XAI** card to navigate to `/dashboard/risk-intelligence`.
4. Inspects Bayesian factor attribution and narrative evidence graph.

### Scenario B: Active Incident Response
1. Alert banner appears or user navigates to `/dashboard/digital-twin`.
2. 3D canvas automatically smooth-tweens camera to the affected room mesh with translucent red warning beacon pulsing.
3. User navigates to `/dashboard/incidents` to review the millisecond-timestamped audit ledger or trigger immediate SOS dispatch override.
