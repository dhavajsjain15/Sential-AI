# UI/UX Design System & Specification
## Sentinel AI — Mission Control Aesthetic & Design System

---

## 1. Design Philosophy

Sentinel AI adheres to a **Dark-Mode First, Cyberpunk Mission Control Design Language**. The interface prioritizes high situational awareness, immediate visual hierarchy, low eye-strain in control room environments, and glassmorphic elevation.

### Core Principles
1. **Zero-Latency Visual Hierarchy**: High-risk items use saturated warning colors (`#EF4444`, `#F59E0B`), while nominal status uses deep translucent dark tones (`#020617`, `bg-white/5`).
2. **Glassmorphism & Depth**: Multi-layered backdrop blurs (`backdrop-blur-2xl`), subtle glowing borders (`border-white/10`, `border-[#3B82F6]/30`), and soft radial gradients.
3. **Data-Dense Monospaced Telemetry**: All numbers, timestamps, coordinates, and confidence percentages use monospaced fonts (`font-mono`) to emulate military and aviation HUD displays.

---

## 2. Color System & Tokens

### 2.1 Base Theme Colors
- **Void Background**: `#020617` (Deep Obsidian Slate)
- **Glass Panel Surface**: `rgba(255, 255, 255, 0.05)` with `border-white/10`
- **Text Primary**: `#FFFFFF` (Pure White)
- **Text Secondary / Muted**: `#94A3B8` (Cool Slate Gray)

### 2.2 Functional Status Tokens
- **Critical / Emergency**: `#EF4444` (Crimson Red) | Glow: `shadow-[#EF4444]/30`
- **Warning / Elevated**: `#F59E0B` (Amber Gold) | Glow: `shadow-[#F59E0B]/30`
- **Nominal / Safe**: `#22C55E` (Emerald Green) | Glow: `shadow-[#22C55E]/30`
- **Cyan Cyber Accent**: `#22D3EE` (Electric Cyan) | Glow: `shadow-[#22D3EE]/30`
- **AI / Telemetry Accent**: `#8B5CF6` (Deep Violet) | Glow: `shadow-[#8B5CF6]/30`
- **Primary Action**: `#3B82F6` (Royal Blue) | Glow: `shadow-[#3B82F6]/30`

---

## 3. Typography & Font Hierarchy

- **Display & Headings**: Space Grotesk / Inter (`font-heading`, `font-bold`, `tracking-tight`)
- **Body & Labels**: Inter / System Sans (`font-sans`, `text-sm`, `text-xs`)
- **Telemetry & Timestamps**: JetBrains Mono / Fira Code (`font-mono`, `uppercase`, `tracking-wider`)

---

## 4. Key Component Layout Specs

### 4.1 Mission Control Header
- Full-width glass container at top of Overview page.
- Live updating digital clock with seconds, date formatting, weather telemetry, connected device ratio (e.g., `142 / 156`), and pulsing green mesh status dot.

### 4.2 Emergency Direct Call SOS Bar (`EmergencyActionPanel`)
- High-priority red-accented banner mounted on `/dashboard/incidents`.
- Features an immediate `CALL 911 / DISPATCH EMERGENCY` button, countdown ring, manual abort trigger, and dispatch status logs.

### 4.3 3D Spatial Canvas (`ThreeDigitalTwin`)
- Dark ambient canvas background (`#020617`).
- Translucent room wireframes with floor plane grid.
- Dynamic red pulse beacon shader orbiting active incident room mesh (`#EF4444`).
- Interactive room selector pills allowing manual camera focus override.

### 4.4 XAI Decision Forensics Panel (`ExplainableTriggerPanel`)
- Visual progress bars representing factor contributions (Velocity, Aspect Ratio, Immobility, Acoustic, Sector Prior).
- Interactive sliders allowing real-time parameter simulation.
- Generated plain-English narrative explainability block.

### 4.5 Chronological Timeline Ledger (`IncidentTimeline`)
- Vertical audit line connecting timestamped event nodes.
- Severity-coded badges (`CRITICAL`, `WARN`, `INFO`, `RESOLVED`).
- Filter tabs (`ALL`, `CRITICAL`, `VOICE FSM`, `DISPATCH`) and CSV export functionality.
