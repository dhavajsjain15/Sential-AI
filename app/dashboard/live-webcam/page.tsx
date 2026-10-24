'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Activity,
  ShieldAlert,
  Radio,
  Sliders,
  AlertTriangle,
  Eye,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Crosshair,
  Flame,
  HeartPulse,
  Video,
  Download,
  BellRing,
  Zap,
} from 'lucide-react';
import { HardwareWebcamOverlay, LiveCameraTelemetry } from '@/vision/streams/HardwareWebcamOverlay';
import { SimulationScenario } from '@/vision/models/SimulatedYoloModel';
import { EventBus } from '@/iot/events/EventBus';

interface MotionLogItem {
  id: string;
  timestamp: string;
  type: 'MOTION_SPIKE' | 'SAFETY_WARNING' | 'CRITICAL_HAZARD' | 'NOMINAL_TRACKING';
  message: string;
  riskScore: number;
  zone: string;
}

export default function LiveWebcamPage() {
  const [isAIActive, setIsAIActive] = useState<boolean>(true);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>('Normal Surveillance');
  const [motionSensitivity, setMotionSensitivity] = useState<number>(75);
  const [isRecordingSnapshot, setIsRecordingSnapshot] = useState<boolean>(false);
  const [snapshotCount, setSnapshotCount] = useState<number>(4);

  // Real-time 1-second live telemetry state from HardwareWebcamOverlay
  const [liveTelemetry, setLiveTelemetry] = useState<LiveCameraTelemetry>({
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    totalRiskPercentage: 24,
    fallRiskScore: 8,
    motionScore: 1.4,
    motionMultiplier: '1.4x',
    deltaDeviation: '12%',
    smokeRiskScore: 12,
    intrusionScore: 14,
    statusLabel: 'NOMINAL SURVEILLANCE',
    activeZone: 'Sector Alpha (Live Command Arena)',
  });

  // Derive risk score from active scenario or live telemetry
  const currentRiskScore =
    activeScenario === 'Critical Fire & Smoke'
      ? 92
      : activeScenario === 'Person Fallen (Medical)'
      ? 78
      : activeScenario === 'Intrusion & Weapon Alert'
      ? 85
      : liveTelemetry.totalRiskPercentage;

  const currentStatusLabel =
    currentRiskScore >= 71 ? 'CRITICAL RISK ARMED' : currentRiskScore >= 31 ? 'ELEVATED WARNING' : 'NOMINAL SURVEILLANCE';

  const currentStatusColor =
    currentRiskScore >= 71
      ? 'text-[#EF4444] bg-[#EF4444]/20 border-[#EF4444]/50'
      : currentRiskScore >= 31
      ? 'text-[#F59E0B] bg-[#F59E0B]/20 border-[#F59E0B]/50'
      : 'text-[#22C55E] bg-[#22C55E]/20 border-[#22C55E]/50';

  const [motionLogs, setMotionLogs] = useState<MotionLogItem[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 45000).toLocaleTimeString(),
      type: 'NOMINAL_TRACKING',
      message: 'Optical Flow Vector nominal. No unauthorized boundary violations.',
      riskScore: 22,
      zone: 'Sector Alpha (Host WebCam)',
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      type: 'MOTION_SPIKE',
      message: 'Rapid movement deviation detected in upper-left quadrant (Multiplier: 1.6x).',
      riskScore: 48,
      zone: 'Sector Alpha (Host WebCam)',
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 240000).toLocaleTimeString(),
      type: 'SAFETY_WARNING',
      message: 'Zone crossing warning — Subject lingering near restricted perimeter line.',
      riskScore: 64,
      zone: 'Sector Alpha (Host WebCam)',
    },
  ]);

  // Simulate incoming motion logs when scenario changes
  useEffect(() => {
    if (activeScenario !== 'Normal Surveillance') {
      const newLog: MotionLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: activeScenario === 'Critical Fire & Smoke' || activeScenario === 'Intrusion & Weapon Alert' ? 'CRITICAL_HAZARD' : 'SAFETY_WARNING',
        message:
          activeScenario === 'Critical Fire & Smoke'
            ? 'HIGH-TEMPERATURE & SMOKE PLUME DETECTED IN OPTICAL FEED!'
            : activeScenario === 'Person Fallen (Medical)'
            ? 'FALL RISK INTEGRATION ALERT: Subject detected motionless & prone on floor surface!'
            : 'INTRUSION ALERT: Unrecognized subject in restricted command zone!',
        riskScore: currentRiskScore,
        zone: 'Sector Alpha (Host WebCam)',
      };
      setMotionLogs((prev) => [newLog, ...prev.slice(0, 15)]);

      try {
        EventBus.getInstance().publish(
          'FUSION_INCIDENT_TRIGGERED',
          {
            incidentId: `WEBCAM-${Date.now().toString().slice(-5)}`,
            incidentTitle: `LIVE WEBCAM: ${activeScenario.toUpperCase()}`,
            incidentType: activeScenario,
            severity: currentRiskScore >= 71 ? 'CRITICAL' : 'WARNING',
            riskScore: currentRiskScore,
            roomOrZone: 'Host WebCam Command Arena',
            triggeredAt: new Date().toISOString(),
          },
          'CAM-LOCAL-001',
          currentRiskScore >= 71 ? 'critical' : 'warning'
        );
      } catch (e) {
        console.error('Failed publishing webcam event:', e);
      }
    }
  }, [activeScenario, currentRiskScore]);

  const handleCaptureSnapshot = () => {
    setIsRecordingSnapshot(true);
    setSnapshotCount((c) => c + 1);
    setTimeout(() => {
      setIsRecordingSnapshot(false);
    }, 1200);
  };

  // Interactive Quick-Focus Side Button Click Handlers
  const handleQuickFocusSideButton = (targetScenario: SimulationScenario, reason: string) => {
    setActiveScenario(targetScenario);
    const focusLog: MotionLogItem = {
      id: `focus-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'SAFETY_WARNING',
      message: `OPERATOR SIDE BUTTON ACTION: Focused live camera analysis on [${reason}]. Motion sensor and fall risk synchronized.`,
      riskScore: targetScenario === 'Person Fallen (Medical)' ? 78 : targetScenario === 'Critical Fire & Smoke' ? 92 : 85,
      zone: 'Sector Alpha (Host WebCam)',
    };
    setMotionLogs((prev) => [focusLog, ...prev.slice(0, 15)]);
  };

  return (
    <div className="space-y-8 pb-14">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#22D3EE] to-[#3B82F6] text-white shadow-lg shadow-[#22D3EE]/25">
            <Camera className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-[#22C55E]/20 text-[#22C55E] text-[11px] font-mono font-bold flex items-center gap-1.5 border border-[#22C55E]/40">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                HARDWARE WEBCAM & FALL RISK INTEGRATED
              </span>
              <span className="text-xs font-mono text-[#94A3B8] hidden sm:inline">| Resolution: 1280x720p (HD)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              Live Web Camera — 1s Motion Sensor & Fall Risk Telemetry
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#94A3B8] mt-1">
              Real-time 1-second motion sensor updates, integrated slip/fall risk percentage HUD, and interactive quick-action side buttons
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setIsAIActive(!isAIActive)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
              isAIActive
                ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25'
                : 'bg-white/5 border-white/10 text-[#94A3B8] hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            AI OVERLAY: {isAIActive ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleCaptureSnapshot}
            disabled={isRecordingSnapshot}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-[#22D3EE]" />
            {isRecordingSnapshot ? 'Capturing Snapshot...' : `Capture Snapshot (${snapshotCount})`}
          </button>

          <div className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-extrabold flex items-center gap-2 ${currentStatusColor}`}>
            <AlertTriangle className="w-4 h-4" />
            <span>{currentStatusLabel}</span>
          </div>
        </div>
      </div>

      {/* 2. Scenario Test Switcher Bar */}
      <div className="p-4 rounded-2xl bg-[#020617] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#22D3EE]">
          <Sliders className="w-4 h-4" />
          <span className="font-bold uppercase tracking-wider">Inject Safety Scenario into Webcam Feed:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['Normal Surveillance', 'Person Fallen (Medical)', 'Critical Fire & Smoke', 'Intrusion & Weapon Alert'] as SimulationScenario[]).map(
            (scen) => (
              <button
                key={scen}
                onClick={() => setActiveScenario(scen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  activeScenario === scen
                    ? scen === 'Critical Fire & Smoke' || scen === 'Intrusion & Weapon Alert'
                      ? 'bg-[#EF4444] text-white shadow-md shadow-[#EF4444]/30'
                      : scen === 'Person Fallen (Medical)'
                      ? 'bg-[#F59E0B] text-black font-bold shadow-md'
                      : 'bg-[#22C55E] text-black font-bold shadow-md'
                    : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {scen === 'Normal Surveillance' && '🟢 Nominal Status'}
                {scen === 'Person Fallen (Medical)' && '🟡 Fall / Medical Risk (Integrated)'}
                {scen === 'Critical Fire & Smoke' && '🔴 Fire & Smoke Hazard'}
                {scen === 'Intrusion & Weapon Alert' && '🟣 Intrusion Breach'}
              </button>
            )
          )}
        </div>
      </div>

      {/* 3. Real-Time 1-Second Ticking Telemetry Bar */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#020617] to-amber-950/40 border border-[#22D3EE]/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#22D3EE]/20 border border-[#22D3EE]/40 text-[#22D3EE]">
            <Zap className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">MOTION SENSOR & FALL RISK TELEMETRY</span>
              <span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] font-bold text-[10px] animate-pulse">
                ⚡ UPDATED EVERY 1s ({liveTelemetry.timestamp})
              </span>
            </div>
            <span className="text-[#94A3B8] text-[11px]">
              Continuous optical flow, posture aspect ratio, and floor-level differential tracking
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center sm:text-right w-full sm:w-auto">
          <div className="p-2.5 rounded-xl bg-[#020617] border border-white/10">
            <span className="text-[10px] text-[#94A3B8] block">RISK PERCENTAGE</span>
            <span className={`text-base font-extrabold ${liveTelemetry.totalRiskPercentage >= 71 ? 'text-[#EF4444]' : liveTelemetry.totalRiskPercentage >= 31 ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>
              {liveTelemetry.totalRiskPercentage}%
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#020617] border border-[#F59E0B]/30">
            <span className="text-[10px] text-[#94A3B8] block">FALL RISK INDEX</span>
            <span className="text-base font-extrabold text-[#F59E0B]">
              {liveTelemetry.fallRiskScore}%
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#020617] border border-[#22D3EE]/30">
            <span className="text-[10px] text-[#94A3B8] block">MOTION VECTOR</span>
            <span className="text-base font-extrabold text-[#22D3EE]">
              {liveTelemetry.motionMultiplier}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Main Split View: Webcam Stream & Overlays (Left 2/3) + Interactive Side Buttons & Breakdown (Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Webcam Video View + Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[480px] sm:h-[560px] w-full rounded-3xl overflow-hidden shadow-2xl relative">
            <HardwareWebcamOverlay
              isAIActive={isAIActive}
              activeScenario={activeScenario}
              riskScore={currentRiskScore}
              cameraName="CAM-LOCAL-001 | Host WebCam Unit"
              zoneName="Sector Alpha (Live Command Arena)"
              onLiveTelemetryUpdate={setLiveTelemetry}
            />
          </div>

          {/* Bottom Controls & Sensitivity Adjuster */}
          <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-sm font-heading font-bold text-white">
                <Crosshair className="w-4 h-4 text-[#22D3EE]" />
                <span>Motion Detection Sensitivity & Vector Parameters</span>
              </div>
              <span className="text-xs font-mono text-[#22D3EE] font-bold">{motionSensitivity}% Threshold</span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="10"
                max="100"
                value={motionSensitivity}
                onChange={(e) => setMotionSensitivity(Number(e.target.value))}
                className="w-full accent-[#22D3EE] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#94A3B8]">
                <span>Low Sensitivity (Filter Micro-Movements)</span>
                <span>Optimum XAI Tracking (75%)</span>
                <span>Hyper-Sensitive (Max Pixel Diff)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#020617] border border-white/10 text-center">
                <span className="text-[10px] text-[#94A3B8] block">TRACKED OBJECTS</span>
                <span className="text-base font-bold text-white">2 Targets</span>
              </div>
              <div className="p-3 rounded-xl bg-[#020617] border border-white/10 text-center">
                <span className="text-[10px] text-[#94A3B8] block">FRAME LATENCY</span>
                <span className="text-base font-bold text-[#22C55E]">4.1 ms</span>
              </div>
              <div className="p-3 rounded-xl bg-[#020617] border border-white/10 text-center">
                <span className="text-[10px] text-[#94A3B8] block">MOTION VECTOR</span>
                <span className="text-base font-bold text-[#22D3EE]">{liveTelemetry.motionMultiplier}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#020617] border border-white/10 text-center">
                <span className="text-[10px] text-[#94A3B8] block">AI CONFIDENCE</span>
                <span className="text-base font-bold text-[#A855F7]">96.8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Side Action Buttons & Triage */}
        <div className="lg:col-span-1 space-y-6">
          {/* A. Safety Risk Breakdown Panel (Now Fully Clickable Side Buttons!) */}
          <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#EF4444]" />
                Interactive Side Controls & Triage
              </h3>
              <span className="text-xs font-mono font-bold text-[#22D3EE]">CLICK TO FOCUS</span>
            </div>

            <p className="text-[11px] font-mono text-[#94A3B8] leading-relaxed">
              Click any side button below to instantly focus camera tracking, trigger fall/motion updates, and lock live telemetry:
            </p>

            {/* Side Button 1: Slip, Trip & Fall (Medical) - Integrated */}
            <button
              onClick={() => handleQuickFocusSideButton('Person Fallen (Medical)', 'Slip, Fall & Posture Safety')}
              className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer space-y-2.5 active:scale-98 shadow-lg ${
                activeScenario === 'Person Fallen (Medical)'
                  ? 'bg-amber-950/60 border-[#F59E0B] ring-2 ring-[#F59E0B]/50'
                  : 'bg-[#020617] hover:bg-white/10 border-[#F59E0B]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#F59E0B]" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Slip, Fall & Posture Safety</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] text-[11px] font-mono font-bold">
                  {liveTelemetry.fallRiskScore}% RISK
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F59E0B] transition-all duration-500"
                  style={{ width: `${liveTelemetry.fallRiskScore}%` }}
                />
              </div>
              <p className="text-[11px] font-mono text-[#F59E0B]">
                ⚡ Click to focus Fall Risk & Prone Posture integration (Updates every 1s).
              </p>
            </button>

            {/* Side Button 2: Intrusion & Perimeter */}
            <button
              onClick={() => handleQuickFocusSideButton('Intrusion & Weapon Alert', 'Intrusion & Perimeter Risk')}
              className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer space-y-2.5 active:scale-98 shadow-lg ${
                activeScenario === 'Intrusion & Weapon Alert'
                  ? 'bg-red-950/60 border-[#EF4444] ring-2 ring-[#EF4444]/50'
                  : 'bg-[#020617] hover:bg-white/10 border-white/15'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Intrusion & Perimeter Risk</span>
                </div>
                <span className={`text-[11px] font-mono font-bold ${activeScenario === 'Intrusion & Weapon Alert' ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                  {liveTelemetry.intrusionScore}% RISK
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${activeScenario === 'Intrusion & Weapon Alert' ? 'bg-[#EF4444]' : 'bg-[#22C55E]'}`}
                  style={{ width: `${liveTelemetry.intrusionScore}%` }}
                />
              </div>
              <p className="text-[11px] font-mono text-[#94A3B8]">
                ⚡ Click to focus perimeter boundaries and unauthorized human tracking.
              </p>
            </button>

            {/* Side Button 3: Environmental & Smoke */}
            <button
              onClick={() => handleQuickFocusSideButton('Critical Fire & Smoke', 'Optical Smoke & Fire Risk')}
              className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer space-y-2.5 active:scale-98 shadow-lg ${
                activeScenario === 'Critical Fire & Smoke'
                  ? 'bg-red-950/60 border-[#EF4444] ring-2 ring-[#EF4444]/50'
                  : 'bg-[#020617] hover:bg-white/10 border-white/15'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#F97316]" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Optical Smoke & Fire Risk</span>
                </div>
                <span className={`text-[11px] font-mono font-bold ${activeScenario === 'Critical Fire & Smoke' ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                  {liveTelemetry.smokeRiskScore}% RISK
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${activeScenario === 'Critical Fire & Smoke' ? 'bg-[#EF4444]' : 'bg-[#22C55E]'}`}
                  style={{ width: `${liveTelemetry.smokeRiskScore}%` }}
                />
              </div>
              <p className="text-[11px] font-mono text-[#94A3B8]">
                ⚡ Click to focus thermal particulate plumes and VOC anomalies.
              </p>
            </button>

            {/* Side Button 4: Reset Nominal */}
            <button
              onClick={() => handleQuickFocusSideButton('Normal Surveillance', 'Nominal Status')}
              className="w-full py-2.5 rounded-xl bg-[#22C55E]/20 hover:bg-[#22C55E]/30 border border-[#22C55E]/40 text-[#22C55E] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset All Side Buttons to Nominal
            </button>
          </div>

          {/* B. Live Motion Event Log */}
          <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <BellRing className="w-4 h-4 text-[#22D3EE]" />
                Motion & Safety Event Log
              </h3>
              <span className="px-2 py-0.5 rounded bg-[#22D3EE]/20 text-[#22D3EE] text-[10px] font-mono font-bold">
                {motionLogs.length} Events
              </span>
            </div>

            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {motionLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border text-xs font-mono flex flex-col space-y-1 ${
                    log.type === 'CRITICAL_HAZARD'
                      ? 'bg-red-950/50 border-red-500/50 text-red-200'
                      : log.type === 'SAFETY_WARNING'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      : 'bg-[#020617] border-white/10 text-[#94A3B8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{log.type.replace('_', ' ')}</span>
                    <span className="text-[10px] opacity-70">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{log.message}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] opacity-80 border-t border-white/5">
                    <span>{log.zone}</span>
                    <span>Risk Level: {log.riskScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
