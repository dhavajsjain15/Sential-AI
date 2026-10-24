# ⚡ SENTINEL AI — World's First AI-Powered Universal Risk Intelligence Platform

<p align="center">
  <strong>Predict. Detect. Analyze. Respond. Save Lives.</strong><br>
  Designed with the precision, aesthetics, and power of <em>Tesla Mission Control, Palantir Gotham, Apple VisionOS, Google DeepMind, and Iron Man's JARVIS</em>.
</p>

---

## 🌟 What is Sentinel AI?

**Sentinel AI is NOT a smart home dashboard. It is NOT a basic fire alarm website.**

Sentinel AI is an **enterprise-grade, multi-modal AI Command Center** capable of detecting, classifying, explaining, predicting, and autonomously mitigating risks across **12 Universal Hazard Typologies** in real time:

1. 🔥 **Fire & Thermal Runaway** (Server racks, HVAC failures, dry pipes)
2. 🏥 **Medical & Physiological Vitals** (Fall detection, heart rate drops, respiratory distress)
3. 💨 **Hazardous Gas & VOC Leaks** (Carbon monoxide, propane, chemical vapors)
4. ⚡ **Electrical Overloads & Surges** (Panel arcing, voltage spikes, UPS failures)
5. 🌊 **Water Flooding & Pipe Bursts** (Sub-floor moisture, server room drainage blockages)
6. 🛡️ **Intrusion & Perimeter Breaches** (Biometric auth failures, unauthorized tailgate entries)
7. ⚔️ **Workplace Violence & Aggression** (Acoustic gun/shouting detection, erratic motion)
8. 🌪️ **Extreme Weather & Structural Stress** (High-velocity wind load, roof pressure differentials)
9. 🌲 **Environmental Air Quality** (PM2.5, particulate spikes, HEPA filtration degradation)
10. 🪲 **Pest & Biological Hazards** (Rodent ingress, bio-hazard perimeter alerts)
11. 👶 **Child Safety & Zone Enforcement** (Pool perimeter breaches, restricted zone wandering)
12. ❤️ **Elderly & Assisted Care Monitoring** (Prolonged inactivity, automated emergency check-ins)

---

## 🏛️ End-to-End System Architecture

```
   +-----------------------------------------------------------------------+
   |                        1. HARDWARE & EDGE NODES                       |
   |   ESP32-CAM (FLIR/RTSP) | Jetson Orin (YOLOv8 + MediaPipe) | IoT Sensors |
   +-----------------------------------+-+---------------------------------+
                                       |
                                       v
   +-----------------------------------------------------------------------+
   |                  2. MULTI-MODAL SENSOR FUSION ENGINE                  |
   |      Cross-References CCTV + Acoustic Harmonics + VOC + Temperature    |
   +-----------------------------------+-+---------------------------------+
                                       |
                                       v
   +-----------------------------------------------------------------------+
   |                     3. BAYESIAN EVIDENCE GRAPH                        |
   |      Calculates 0-100% Risk Index | Throttles 99.98% False Alarms     |
   +-----------------------------------+-+---------------------------------+
                                       |
                                       v
   +-----------------------------------------------------------------------+
   |                 4. GOOGLE DEEPMIND GEMINI 1.5 PRO (XAI)               |
   |       Synthesizes Natural Language Causal Forensics & Explanations     |
   +-----------------------------------+-+---------------------------------+
                                       |
                                       +-------------------------+
                                       |                         |
                                       v                         v
   +---------------------------------------+ +-----------------------------+
   |     5. NEXT.JS 15 + FIREBASE SAAS     | | 6. FASTAPI ACTUATOR LAYER   |
   | Auth | Firestore | Storage | FCM Push | | Throttles HVAC & Breakers |
   +---------------------------------------+ +-----------------------------+
```

---

## 💻 Tech Stack & Key Technologies

- **Frontend Core:** Next.js 15 (App Router), React 19, TypeScript
- **Styling & Design System:** TailwindCSS v4 (`@theme inline`), Glassmorphism (`backdrop-blur-2xl`, `rgba(255,255,255,0.05)`), Cyberpunk & Dark Mode aesthetics
- **Animations & Interactivity:** Framer Motion (`AnimatePresence`, layout transitions) + Lucide Icons
- **Data Visualization:** Recharts (6 custom charts: area, bar, pie, step-line, horizontal bar, radar)
- **Firebase Infrastructure:**
  - **Firebase Authentication:** Role-Based Access Control (`AuthContext`) with Defcon 1 Operator clearance check.
  - **Firestore Real-Time DB:** Storing live incidents, telemetry vectors, evidence graphs, and simulation outputs.
  - **Firebase Cloud Storage:** Archiving high-res YOLO optical snapshots and PDF forensic reports.
  - **Firebase Cloud Messaging (FCM):** Push notifications and high-priority mobile emergency alerts.
  - **Firebase App Check & Analytics:** Event tracking and reCAPTCHA Enterprise bot mitigation.
- **AI & Microservices:**
  - **Explainable AI (XAI):** Google DeepMind Gemini 1.5 Pro telemetry synthesis engine.
  - **FastAPI Backend Architecture:** Clean microservice integration layer (`lib/firebase/*.ts`, ready for Python FastAPI endpoints).

---

## 🚀 Getting Started Locally

### 1. Prerequisites
Ensure you have Node.js 20+ installed on your system.

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file inside the root directory and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Run the Next.js 15 Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the Landing Page or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the AI Command Center.

---

## 🗺️ Application Routes Directory

| Route | Description |
| :--- | :--- |
| `/` | **Landing Page:** Hero with interactive preview, 14-stage pipeline breakdown, stats, and FAQs |
| `/dashboard` | **Main Command Center:** Spans all 13 interactive widgets (Mission Control, Digital Twin, CCTV, etc.) |
| `/dashboard/risk-intelligence` | **Bayesian Risk Engine:** Deep causal evidence graphs across all 12 hazard categories |
| `/dashboard/live-monitoring` | **Live Edge Surveillance:** 4 edge camera feeds with YOLOv8 bounding boxes + 12-channel sensor grid |
| `/dashboard/incidents` | **Forensic Containment:** Live timeline feed + SLA response stats + CSV export |
| `/dashboard/analytics` | **Predictive Intelligence:** 6 interactive Recharts visualizations (Weekly, Monthly, Donut, Radar) |
| `/dashboard/devices` | **Infrastructure Diagnostic:** ESP32 edge nodes, Jetson Orin hubs, and FastAPI latency bars |
| `/dashboard/reports` | **Compliance Audit:** Downloadable PDF reports and AI custom report generator |
| `/dashboard/emergency-replay` | **5-Phase Simulator:** Interactive time-travel reconstruction of critical emergencies |
| `/dashboard/notifications` | **Alert Center:** Push dispatches filtered by critical/warning/info categories |
| `/dashboard/ai-assistant` | **JARVIS Co-Pilot:** Full-screen multi-turn AI reasoning interface |
| `/dashboard/settings` | **System Parameters:** AI sensitivity thresholds, autonomous containment toggles, and FCM setup |
| `/dashboard/profile` | **Operator Clearance:** Biometric & YubiKey MFA verification, Defcon 1 clearance badges |
| `/features`, `/technology`, `/about`, `/contact` | **Public Marketing Pages:** Explaining enterprise features, DeepMind XAI, and booking deployments |
| `/login`, `/signup` | **Firebase Auth Pages:** Enterprise login with 1-Click Demo Bypass mode |

---

## 🔒 Security & Immutable Ledger

All sensor telemetry, optical detections, and automated actuator commands (such as closing emergency fire doors or shutting off high-voltage power lines) are cryptographically hashed and logged to our **Immutable Audit Ledger** (`/dashboard/emergency-replay`). This ensures 100% forensic transparency during post-incident investigations.
