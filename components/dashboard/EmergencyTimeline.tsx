'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Download, Maximize2, ShieldAlert, History, CheckCircle, Flame, Users, AlertTriangle } from 'lucide-react';
import { MOCK_INCIDENTS } from '@/constants';

export function EmergencyTimeline() {
  const [selectedIncident, setSelectedIncident] = useState(MOCK_INCIDENTS[0]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStep, setReplayStep] = useState(0);

  const handleReplay = () => {
    setIsReplaying(true);
    setReplayStep(1);
    const steps = [1, 2, 3, 4, 5];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setReplayStep(step);
        if (step === 5) setTimeout(() => setIsReplaying(false), 1200);
      }, (idx + 1) * 800);
    });
  };

  return (
    <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6]">
            <History className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-white tracking-tight flex items-center gap-2">
              Autonomous Emergency Incident Replay & Timeline
            </h2>
            <p className="text-xs font-mono text-[#94A3B8]">
              Millisecond-accurate reconstruction across AI vision, audio signatures, and sensor fusion
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReplay}
            disabled={isReplaying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] disabled:opacity-50 text-white font-heading font-semibold text-xs shadow-lg shadow-[#8B5CF6]/20 transition-all"
          >
            <Play className={`w-3.5 h-3.5 ${isReplaying ? 'animate-spin' : ''}`} />
            {isReplaying ? `Replaying Phase ${replayStep}/5...` : 'Replay Incident'}
          </button>

          <button
            onClick={() => alert('Downloading Comprehensive AI Forensics PDF Report...')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-heading font-semibold text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#22D3EE]" />
            Download Forensics
          </button>

          <button
            onClick={() => alert('Expanding full-screen interactive telemetry ledger...')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#94A3B8] hover:text-white transition-colors"
            title="Expand Details"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Horizontal Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
          <span>Selected Event: <strong className="text-white">{selectedIncident.title}</strong></span>
          <span className="text-[#22D3EE]">{selectedIncident.time} | {selectedIncident.location}</span>
        </div>

        {/* Timeline bar with interactive nodes */}
        <div className="relative py-8 flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
          <div className="absolute left-0 right-0 h-1 bg-white/10 top-1/2 -translate-y-1/2 rounded-full" />
          {isReplaying && (
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${(replayStep / 5) * 100}%` }}
              className="absolute left-0 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 shadow-md shadow-[#8B5CF6]"
            />
          )}

          {MOCK_INCIDENTS.slice(0, 6).map((item, idx) => {
            const isSelected = selectedIncident.id === item.id;
            const isCritical = item.priority === 'critical';

            return (
              <motion.div
                key={item.id}
                onClick={() => setSelectedIncident(item)}
                whileHover={{ scale: 1.1 }}
                className="relative flex flex-col items-center cursor-pointer shrink-0 z-10 group"
              >
                {/* Top time label */}
                <span className="text-[10px] font-mono text-[#94A3B8] group-hover:text-white mb-2 transition-colors">
                  {item.time}
                </span>

                {/* Node Circle */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/50 ring-4 ring-[#3B82F6]/30'
                      : isCritical
                      ? 'bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444]'
                      : 'bg-[#020617] border border-white/20 text-[#94A3B8]'
                  }`}
                >
                  <span className="text-xs font-mono font-bold">{idx + 1}</span>
                </div>

                {/* Bottom title label */}
                <span className="text-xs font-heading font-medium text-white/80 group-hover:text-white mt-2 max-w-[110px] text-center truncate">
                  {item.title}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Replay Synthesis Phase Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedIncident.id + replayStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-2xl bg-[#020617]/80 border border-white/10 space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#22D3EE] font-bold uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              AI Reconstruction Phase {isReplaying ? replayStep : 5}/5: {
                isReplaying && replayStep === 1 ? 'Optical Bounding Box Capture' :
                isReplaying && replayStep === 2 ? 'Thermal & VOC Gas Sensor Cross-Check' :
                isReplaying && replayStep === 3 ? 'Evidence Graph Causal Node Synthesis' :
                isReplaying && replayStep === 4 ? 'Predictive Escalation Horizon Modeling' :
                'Autonomous Containment & Immutable Log Confirmed'
              }
            </span>
            <span className="text-[#94A3B8]">Risk Index: 84% (High Confidence)</span>
          </div>
          <p className="text-xs text-white/90 leading-relaxed font-sans">
            At {selectedIncident.time}, Sentinel AI multi-modal edge nodes in {selectedIncident.location} detected abnormal telemetry spikes. Within 14 milliseconds, our Universal Risk Engine cross-referenced CCTV feeds with HVAC pressure drops to confirm {selectedIncident.title}. Emergency protocols were executed autonomously.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
