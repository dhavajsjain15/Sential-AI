'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Detection, SeverityLevel } from '../types';
import { Eye, Cpu, Clock, Activity, ShieldAlert } from 'lucide-react';

interface DetectionOverlayProps {
  detections: Detection[];
  fps: number;
  inferenceTimeMs: number;
  isAIActive: boolean;
  showLabels?: boolean;
}

export function DetectionOverlay({
  detections,
  fps,
  inferenceTimeMs,
  isAIActive,
  showLabels = true,
}: DetectionOverlayProps) {
  const getSeverityColor = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return {
          border: 'border-[#EF4444]',
          bg: 'bg-[#EF4444]/15',
          badgeBg: 'bg-[#EF4444]',
          text: 'text-white',
          glow: 'shadow-[0_0_25px_rgba(239,68,68,0.45)]',
          dot: 'bg-[#EF4444]',
        };
      case 'high':
        return {
          border: 'border-[#F59E0B]',
          bg: 'bg-[#F59E0B]/15',
          badgeBg: 'bg-[#F59E0B]',
          text: 'text-[#020617]',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
          dot: 'bg-[#F59E0B]',
        };
      case 'medium':
        return {
          border: 'border-[#22D3EE]',
          bg: 'bg-[#22D3EE]/15',
          badgeBg: 'bg-[#22D3EE]',
          text: 'text-[#020617]',
          glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]',
          dot: 'bg-[#22D3EE]',
        };
      default:
        return {
          border: 'border-[#22C55E]',
          bg: 'bg-[#22C55E]/10',
          badgeBg: 'bg-[#22C55E]',
          text: 'text-[#020617]',
          glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]',
          dot: 'bg-[#22C55E]',
        };
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Top Telemetry HUD Bar */}
      <div className="absolute top-3 right-3 flex flex-wrap items-center gap-2 z-20">
        {/* Inference Latency */}
        <div className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[11px] font-mono text-[#94A3B8]">
          <Cpu className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Inference: </span>
          <span className="text-white font-bold">{inferenceTimeMs} ms</span>
        </div>

        {/* FPS Counter */}
        <div className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[11px] font-mono text-[#94A3B8]">
          <Activity className="w-3.5 h-3.5 text-[#22C55E]" />
          <span className="text-[#22C55E] font-bold">{fps} FPS</span>
        </div>

        {/* AI Active Status */}
        <div
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[11px] font-mono font-bold border backdrop-blur-md shadow-md ${
            isAIActive
              ? 'bg-[#22C55E]/20 border-[#22C55E]/50 text-[#22C55E]'
              : 'bg-black/80 border-white/20 text-[#94A3B8]'
          }`}
        >
          <Eye className="w-3.5 h-3.5 animate-pulse" />
          <span>{isAIActive ? 'YOLOv8 XAI ON' : 'AI BYPASSED'}</span>
        </div>
      </div>

      {/* Bounding Box Overlays */}
      <AnimatePresence>
        {isAIActive &&
          detections.map((det) => {
            const styles = getSeverityColor(det.severity);
            const leftPct = `${det.box.x * 100}%`;
            const topPct = `${det.box.y * 100}%`;
            const widthPct = `${det.box.width * 100}%`;
            const heightPct = `${det.box.height * 100}%`;

            return (
              <motion.div
                key={det.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  left: leftPct,
                  top: topPct,
                  width: widthPct,
                  height: heightPct,
                }}
                className={`absolute border-2 border-dashed rounded-xl p-1 flex flex-col justify-between transition-all ${styles.border} ${styles.bg} ${styles.glow}`}
              >
                {/* Top Label & Confidence */}
                {showLabels && (
                  <div className="flex items-center justify-between gap-1 -mt-6">
                    <span
                      className={`px-2 py-0.5 rounded-t-md text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1 ${styles.badgeBg} ${styles.text} shadow-md`}
                    >
                      {det.severity === 'critical' && <ShieldAlert className="w-3 h-3" />}
                      {det.className} — {det.confidence}%
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] font-mono border border-white/10">
                      Risk: {det.riskContribution}
                    </span>
                  </div>
                )}

                {/* Bottom Tracking ID & Timestamp */}
                {showLabels && (
                  <div className="flex items-center justify-between gap-1 -mb-6">
                    <span className="px-1.5 py-0.5 rounded bg-black/85 text-[#22D3EE] text-[9px] font-mono font-bold border border-[#22D3EE]/40">
                      ID: {det.trackingId}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-black/85 text-[#94A3B8] text-[9px] font-mono flex items-center gap-1 border border-white/10">
                      <Clock className="w-2.5 h-2.5 text-[#22C55E]" />
                      {new Date(det.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}
