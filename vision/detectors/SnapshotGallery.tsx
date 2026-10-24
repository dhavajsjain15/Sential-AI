'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoSnapshot } from '../types';
import { Camera, Clock, ShieldAlert, Download, Trash2, CheckCircle2 } from 'lucide-react';

interface SnapshotGalleryProps {
  snapshots: VideoSnapshot[];
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
}

export function SnapshotGallery({ snapshots, onDelete, onClearAll }: SnapshotGalleryProps) {
  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#94A3B8]">
          <Camera className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-base text-white">No Forensic Snapshots Captured</h3>
        <p className="text-xs font-sans text-[#94A3B8] max-w-sm mx-auto">
          Snapshots are automatically captured during critical incidents (Fire, Fall, Weapon) or when manually triggered by the operator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#22D3EE] flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Captured Forensic Evidence Vault ({snapshots.length})
        </h3>
        {onClearAll && (
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#EF4444]/20 border border-white/10 hover:border-[#EF4444]/50 text-xs font-mono text-[#94A3B8] hover:text-[#EF4444] flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Vault
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <AnimatePresence>
          {snapshots.map((snap) => (
            <motion.div
              key={snap.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3 rounded-2xl bg-[#020617] border border-white/10 hover:border-white/20 transition-all group space-y-2.5 shadow-xl relative overflow-hidden"
            >
              {/* Simulated Image Box with Gradient Overlay */}
              <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] relative flex items-center justify-center border border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold uppercase text-[#22D3EE] border border-white/10">
                  {snap.cameraName}
                </div>
                <div
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase ${
                    snap.triggerType === 'Critical Incident'
                      ? 'bg-[#EF4444] text-white'
                      : 'bg-[#3B82F6] text-white'
                  }`}
                >
                  {snap.triggerType}
                </div>
                <span className="text-xs font-mono text-[#94A3B8] z-10 flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  {snap.detectionsCount} Detections Logged
                </span>
              </div>

              {/* Snapshot Metadata */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="truncate">
                  <span className="text-white font-bold block truncate">{snap.zone} Zone</span>
                  <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#3B82F6]" />
                    {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-1 rounded bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] font-bold text-[10px]">
                    Risk {snap.riskScore}%
                  </span>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(snap.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                      title="Delete Snapshot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
