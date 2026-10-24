'use client';

import React from 'react';
import { CameraConfig } from '../types';
import { ConnectionBadge } from './ConnectionBadge';
import { Radio, ShieldCheck, MapPin } from 'lucide-react';

interface StreamStatusProps {
  camera: CameraConfig;
  activeDetectionsCount: number;
}

export function StreamStatus({ camera, activeDetectionsCount }: StreamStatusProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#020617]/90 backdrop-blur-xl border border-white/10 text-xs font-mono select-none">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#22D3EE] flex items-center justify-center shrink-0">
          <Radio className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <span className="font-heading font-bold text-white block text-sm">
            {camera.name}
          </span>
          <span className="text-[11px] text-[#94A3B8] flex items-center gap-2">
            <span>ID: {camera.id}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#F59E0B]">
              <MapPin className="w-3 h-3" /> {camera.zone} Zone
            </span>
            <span>•</span>
            <span>{camera.resolution}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="px-2.5 py-1 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#22D3EE] text-[10px] font-bold uppercase flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          {activeDetectionsCount} Active Detections
        </span>
        <ConnectionBadge status={camera.status} bitrateKbps={camera.bitrateKbps} />
      </div>
    </div>
  );
}
