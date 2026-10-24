'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CameraConfig, Detection, ObjectTrackingData } from '../types';
import { DetectionOverlay } from '../detectors/DetectionOverlay';
import { ObjectTracker } from '../detectors/ObjectTracker';
import { ConnectionBadge } from './ConnectionBadge';
import { X, Maximize2, ShieldAlert, Activity, Radio, Clock, MapPin } from 'lucide-react';

interface FullscreenCameraProps {
  isOpen: boolean;
  onClose: () => void;
  camera: CameraConfig | null;
  detections: Detection[];
  trackingHistory: ObjectTrackingData[];
  fps: number;
  inferenceTimeMs: number;
  isAIActive: boolean;
}

export function FullscreenCamera({
  isOpen,
  onClose,
  camera,
  detections,
  trackingHistory,
  fps,
  inferenceTimeMs,
  isAIActive,
}: FullscreenCameraProps) {
  if (!isOpen || !camera) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-8"
      >
        <div className="w-full max-w-7xl h-full max-h-[90vh] flex flex-col rounded-3xl bg-[#020617] border border-white/20 overflow-hidden shadow-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444]">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-white tracking-tight flex items-center gap-2">
                  FULLSCREEN TELEMETRY INSPECTION — {camera.name}
                </h3>
                <p className="text-xs font-mono text-[#94A3B8]">
                  ID: {camera.id} | Zone: {camera.zone} | Protocol: {camera.type.toUpperCase()} | {camera.streamUrl}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ConnectionBadge status={camera.status} bitrateKbps={camera.bitrateKbps} />
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-[#EF4444]/20 text-white hover:text-[#EF4444] transition-colors"
                title="Exit Fullscreen Inspection"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Fullscreen Stream Canvas */}
          <div className="flex-1 relative w-full h-full bg-[#020617] overflow-hidden flex items-center justify-center">
            {/* Dark background grid and simulated scanline */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0b1329] to-[#020617]" />
            <div className="absolute inset-0 bg-grid opacity-50" />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#22D3EE]/80 to-transparent animate-scan" />
            </div>

            {/* AI Overlays and Object Tracking Trails */}
            <ObjectTracker tracks={trackingHistory} showTrails={true} />
            <DetectionOverlay
              detections={detections}
              fps={fps}
              inferenceTimeMs={inferenceTimeMs}
              isAIActive={isAIActive}
              showLabels={true}
            />

            {/* Bottom Telemetry Bar inside Fullscreen */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between p-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 text-xs font-mono text-[#94A3B8] select-none z-20">
              <div className="flex items-center gap-4">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                  4K STREAM ENCRYPTED (AES-256)
                </span>
                <span>•</span>
                <span>Uptime: {(camera.uptimeSeconds / 3600).toFixed(1)} hrs</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#F59E0B]">
                  <MapPin className="w-3.5 h-3.5" /> Zone: {camera.zone}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#22D3EE] font-bold">
                  Active Detections: {detections.length}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white">
                  {camera.resolution}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
