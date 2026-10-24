'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Video,
  Activity,
  Zap,
} from 'lucide-react';
import { ReplayService, ReplayFrame } from '@/replay/services/ReplayService';
import { DemoControllerService } from '@/demo/sandbox/DemoControllerService';
import { EmergencyTimeline } from '@/components/dashboard/EmergencyTimeline';

export default function EmergencyReplayPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 12.0 seconds
  const [selectedFrame, setSelectedFrame] = useState<ReplayFrame | null>(null);
  const [injectStatus, setInjectStatus] = useState<string | null>(null);

  // Load ReplayService session
  const replayService = ReplayService.getInstance();

  useEffect(() => {
    const session = replayService.getSession('SESS-2026-FIRE-01') || replayService.getAllSessions()[0];
    if (session && session.frames.length > 0) {
      const targetMs = currentTime * 1000;
      const closest = session.frames.reduce((prev, curr) =>
        Math.abs(curr.timestampMs - targetMs) < Math.abs(prev.timestampMs - targetMs) ? curr : prev
      );
      setSelectedFrame(closest);
    }
  }, [currentTime, replayService]);

  // Handle Play/Pause timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 12.0) {
            setIsPlaying(false);
            return 12.0;
          }
          return Number((prev + 0.2).toFixed(1));
        });
      }, 200);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleInject = (scenario: 'Multi-Room Fire & Gas Leak' | 'Simulate Elderly Unconscious Fall with Power Failure') => {
    DemoControllerService.getInstance().triggerCatastrophe(scenario);
    setInjectStatus(`⚡ INJECTED: ${scenario.toUpperCase()} — All telemetry overridden to DEFCON 1!`);
    setTimeout(() => setInjectStatus(null), 4000);
  };

  const handleResetDemo = () => {
    DemoControllerService.getInstance().resetToSafeState();
    setInjectStatus('✅ SYSTEM WIPED — All edge sensors returned to nominal baseline (<500ms safe wipe).');
    setTimeout(() => setInjectStatus(null), 4000);
  };

  const riskScore = selectedFrame ? selectedFrame.globalRiskScore : 28;
  const statusLabel = riskScore >= 75 ? 'CRITICAL DECLARATION' : riskScore >= 40 ? 'ESCALATION WARNING' : 'NOMINAL EQUILIBRIUM';

  return (
    <div className="space-y-8 pb-14">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#A855F7]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#3B82F6] text-white shadow-lg shadow-[#A855F7]/25">
            <Video className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-[#A855F7]/20 text-[#A855F7] text-[11px] font-mono font-bold flex items-center gap-1.5 border border-[#A855F7]/40">
                <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-ping" />
                FORENSIC REPLAY ENGINE v2.4
              </span>
              <span className="text-xs font-mono text-[#94A3B8] hidden sm:inline">| Session ID: SESS-2026-FIRE-01</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              Post-Incident Forensics & Emergency Scrubbing
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#94A3B8] mt-1">
              Exact sub-second synchronization of multi-camera CCTV feeds, IoT telemetry arrays, and Gemini XAI reasoning logs
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => handleInject('Multi-Room Fire & Gas Leak')}
            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 text-red-400 animate-bounce" />
            Inject Fire Catastrophe
          </button>
          <button
            onClick={() => handleInject('Simulate Elderly Unconscious Fall with Power Failure')}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Inject Medical Fall
          </button>
          <button
            onClick={handleResetDemo}
            className="px-4 py-2 rounded-xl bg-[#22C55E]/20 hover:bg-[#22C55E]/30 border border-[#22C55E]/40 text-[#22C55E] text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Baseline
          </button>
        </div>
      </div>

      {injectStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-red-950/60 border border-purple-500/50 text-white font-mono text-xs flex items-center justify-between shadow-2xl"
        >
          <span className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
            {injectStatus}
          </span>
          <span className="text-[10px] text-[#94A3B8]">JUDGE OVERRIDE ACTIVE</span>
        </motion.div>
      )}

      {/* 2. Forensic Scrubber and Video Playback Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Video Replay Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[440px] sm:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl relative bg-[#020617] border border-white/15 flex flex-col justify-between p-6">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/60 pointer-events-none" />

            {/* Top Video HUD */}
            <div className="flex items-center justify-between relative z-10 font-mono text-xs text-white">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-bold text-red-400">ARCHIVE RECORDING</span>
                <span className="text-white/40">|</span>
                <span>CAM-FIRE-002 (Kitchen Stove Array)</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 font-bold text-[#22D3EE]">
                {selectedFrame?.timeLabel || '00:00.0'} / 00:12.0
              </div>
            </div>

            {/* Simulated AI Vision Annotation Center Box */}
            <div className="flex-1 flex items-center justify-center relative z-10">
              {selectedFrame ? (
                <div className="text-center space-y-4 max-w-xl px-6 relative z-10">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-extrabold border ${
                      riskScore >= 75
                        ? 'bg-red-500/20 border-red-500/60 text-red-400 animate-pulse'
                        : riskScore >= 40
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-400'
                        : 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>RISK SCORE: {riskScore}% | STATUS: {statusLabel}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                    {selectedFrame.cameraEventLabel}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-[#94A3B8] leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    {selectedFrame.aiReasoningSnapshot.conclusionText}
                  </p>
                </div>
              ) : (
                <div className="text-sm font-mono text-[#94A3B8]">Loading synchronized frame index...</div>
              )}

              {/* Bounding Box HUD if dangerous */}
              {riskScore >= 45 && selectedFrame?.cameraBoundingBox && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute w-56 h-56 border-2 border-red-500 rounded-2xl pointer-events-none flex items-start justify-between p-2 shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                >
                  <span className="text-[10px] font-mono bg-red-500 text-black px-1.5 py-0.5 rounded font-bold">
                    FIRE ANOMALY ({riskScore}%)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Scrubbing Bar Controls */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-[#94A3B8] w-12">{currentTime.toFixed(1)}s</span>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.2"
                  value={currentTime}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentTime(Number(e.target.value));
                  }}
                  className="flex-1 accent-[#A855F7] cursor-pointer"
                />
                <span className="text-xs font-mono text-[#94A3B8] w-12 text-right">12.0s</span>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentTime((t) => Math.max(0, t - 1))}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-colors"
                    title="Rewind 1s"
                  >
                    <Rewind className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#3B82F6] hover:from-[#9333EA] hover:to-[#2563EB] text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'PAUSE SCRUB' : 'PLAY FORENSIC REPLAY'}
                  </button>
                  <button
                    onClick={() => setCurrentTime((t) => Math.min(12, t + 1))}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-colors"
                    title="Forward 1s"
                  >
                    <FastForward className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs font-mono text-[#94A3B8]">
                  Frame Rate: <strong className="text-[#22C55E]">30 FPS</strong> | Sync Drift: <strong className="text-[#22D3EE]">&lt;2ms</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Multi-Sensor Timeline Card */}
          <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#22D3EE]" />
                Multi-Sensor Fusion Correlation Graph
              </h3>
              <span className="text-xs font-mono text-[#A855F7]">12.0s Telemetry Window</span>
            </div>
            <EmergencyTimeline />
          </div>
        </div>

        {/* Right Column: Synced Telemetry Breakdown & XAI Reasoning */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#A855F7]" />
                Synchronized Telemetry Snapshot
              </h3>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                T={currentTime.toFixed(1)}s
              </span>
            </div>

            {selectedFrame && (
              <div className="space-y-4 font-mono">
                <div className="p-3.5 rounded-2xl bg-[#020617] border border-white/10 space-y-1">
                  <div className="flex justify-between text-xs text-[#94A3B8]">
                    <span>SMOKE & VOC DENSITY</span>
                    <span className="text-amber-400 font-bold">{selectedFrame.sensorReadings.smokePpm} PPM</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, selectedFrame.sensorReadings.smokePpm * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#020617] border border-white/10 space-y-1">
                  <div className="flex justify-between text-xs text-[#94A3B8]">
                    <span>THERMAL READING</span>
                    <span className="text-red-400 font-bold">{selectedFrame.sensorReadings.tempCelsius}°C</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-400 h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (selectedFrame.sensorReadings.tempCelsius / 100) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#020617] border border-white/10 space-y-1">
                  <div className="flex justify-between text-xs text-[#94A3B8]">
                    <span>MQ2 GAS CONCENTRATION</span>
                    <span className="text-blue-400 font-bold">{selectedFrame.sensorReadings.gasPpm} PPM</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-400 h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (selectedFrame.sensorReadings.gasPpm / 700) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#22D3EE]">
                    <Brain className="w-4 h-4" />
                    <span>AI REASONING STAGE: {selectedFrame.aiReasoningSnapshot.stage.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-white leading-relaxed">
                    At frame <strong className="text-[#22D3EE]">{currentTime.toFixed(1)}s</strong>, Gemini XAI assigned {riskScore}% causal weight with {selectedFrame.aiReasoningSnapshot.confidence}% confidence.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
