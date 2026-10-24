'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  Tag,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { evalTriggerAttribution, AttributionReport } from '@/engine/evalTriggerAttribution';
import { useEmergencyStore } from '@/store/useEmergencyStore';

export function ExplainableTriggerPanel() {
  const { activeIncident, resolveIncident } = useEmergencyStore();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isOverridden, setIsOverridden] = useState<boolean>(false);
  const [overrideTag, setOverrideTag] = useState<string>('Exercise Routine');
  const [showTagSelector, setShowTagSelector] = useState<boolean>(false);

  // Evaluate XAI attribution based on active incident telemetry or default fallback
  const report: AttributionReport = evalTriggerAttribution({
    verticalVelocityPxMs: -82,
    aspectRatio: 1.42,
    immobilityTimeSec: 28,
    speechState: "Distress ('Can't get up')",
    roomName: activeIncident?.zoneName || 'Master Bedroom',
    compositeConfidence: activeIncident?.confidence || 91,
  });

  const handleOverride = (tag: string) => {
    setOverrideTag(tag);
    setIsOverridden(true);
    setShowTagSelector(false);
    setTimeout(() => {
      resolveIncident();
    }, 2500);
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-b from-white/5 to-black/30 backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-[10px] font-bold tracking-widest uppercase">
                NEURAL DECISION FORENSICS
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {report.compositeConfidence}% CONFIDENCE
              </span>
            </div>
            <h2 className="text-xl font-heading font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
              Decision Forensics & Explainability Engine (XAI)
            </h2>
          </div>
        </div>

        {/* Confidence Formula Tooltip Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-white flex items-center gap-2 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-[#38bdf8]" />
            <span>CALIBRATION FORMULA</span>
          </button>

          {/* Formula Tooltip Modal */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 z-50 w-80 p-4 rounded-2xl bg-black/90 backdrop-blur-2xl border border-[#38bdf8]/50 shadow-2xl text-xs font-mono space-y-2 text-white"
              >
                <span className="text-[#38bdf8] font-bold block border-b border-white/10 pb-1">
                  📐 FUSION CALIBRATION FORMULA
                </span>
                <p className="text-white/80 leading-relaxed text-[11px]">
                  {report.calibrationFormula}
                </p>
                <div className="text-[10px] text-white/50 pt-1 border-t border-white/10">
                  Combines optical flow kinematics, posture geometry, and acoustic NLP into an aggregated confidence score.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Grid: Factor Weight Bars (Left) & Telemetry Sparkline + Plain English Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start relative z-10">
        {/* Left Column: Factor Weight Bars */}
        <div className="space-y-4 p-5 rounded-2xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              CONTRIBUTING FACTOR WEIGHTS
            </span>
            <span className="text-[10px] font-mono text-white/50">THRESHOLD MARKERS</span>
          </div>

          <div className="space-y-4">
            {report.factors.map((factor, idx) => (
              <div key={factor.factorId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    {factor.status === 'PASSED_THRESHOLD' && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    )}
                    {factor.factorName}
                  </span>
                  <span className="text-amber-300 font-bold">{factor.metricValue}</span>
                </div>

                {/* Progress Bar Container with Threshold Line Marker */}
                <div className="relative w-full h-3 rounded-full bg-black/60 overflow-hidden border border-white/10">
                  {/* Threshold Line Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-20 shadow-[0_0_5px_#f59e0b]"
                    style={{ left: `${factor.thresholdPercent}%` }}
                  />

                  {/* Animated Progress Fill Bar */}
                  <motion.div
                    className={`h-full ${
                      factor.status === 'PASSED_THRESHOLD'
                        ? 'bg-gradient-to-r from-red-600 to-red-500'
                        : 'bg-gradient-to-r from-sky-600 to-sky-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.scorePercent}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.15 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Telemetry Sparkline & Plain-English Bullet Breakdown */}
        <div className="space-y-4 p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                MOTION KINEMATICS SPARKLINE
              </span>
              <span className="text-[10px] font-mono text-red-400 font-bold">
                DROP DETECTED (-82px)
              </span>
            </div>

            {/* SVG Micro-Graph Sparkline */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 h-20 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 130 40" preserveAspectRatio="none">
                <path
                  d="M 0 5 L 10 7 L 20 10 L 30 15 L 40 35 L 50 38 L 60 38 L 70 38 L 80 39 L 90 38 L 100 39 L 110 38 L 120 39 L 130 38"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 5 L 10 7 L 20 10 L 30 15 L 40 35 L 50 38 L 60 38 L 70 38 L 80 39 L 90 38 L 100 39 L 110 38 L 120 39 L 130 38 L 130 40 L 0 40 Z"
                  fill="rgba(239, 68, 68, 0.15)"
                />
              </svg>
            </div>

            {/* Plain English Attribution Bullet Points */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-mono font-bold text-white/70 block uppercase">
                HUMAN-AUDITABLE CAUSAL ATTRIBUTION:
              </span>
              <div className="space-y-1 text-xs font-mono text-white/90 leading-relaxed bg-[#020617] p-3 rounded-xl border border-white/10">
                {report.bulletPoints.map((bullet, idx) => (
                  <p key={`bullet-${idx}`} className={idx === 4 ? 'text-amber-300 font-bold' : ''}>
                    {bullet}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* False Positive Override Control */}
          <div className="pt-3 border-t border-white/10 relative">
            {isOverridden ? (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  FALSE POSITIVE OVERRIDDEN ({overrideTag.toUpperCase()})
                </span>
                <span className="text-[10px] text-emerald-400/80">Feedback logged for tuning</span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowTagSelector(!showTagSelector)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  <span>VERIFIED FALSE POSITIVE / OVERRIDE</span>
                  {showTagSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Reason Tag Dropdown */}
            <AnimatePresence>
              {showTagSelector && !isOverridden && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-14 left-0 right-0 z-30 p-3 rounded-2xl bg-black/95 backdrop-blur-2xl border border-amber-500/60 shadow-2xl space-y-2 text-xs font-mono text-white"
                >
                  <span className="text-amber-300 font-bold block border-b border-white/10 pb-1">
                    SELECT SYSTEM TUNING TAG:
                  </span>
                  {[
                    'Exercise Routine',
                    'Lighting / Shadow Artifact',
                    'User Picking Up Dropped Item',
                    'Pet Movement',
                    'Camera Calibration',
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleOverride(tag)}
                      className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-white hover:text-amber-300 transition-colors block"
                    >
                      • {tag}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
