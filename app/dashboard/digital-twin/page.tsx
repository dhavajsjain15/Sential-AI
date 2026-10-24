'use client';

import React from 'react';
import { DigitalTwinView } from '@/components/dashboard/DigitalTwinView';
import { Box, Sparkles, Layers } from 'lucide-react';

export default function DigitalTwinPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#22C55E]/15 via-[#3B82F6]/10 to-transparent border border-[#22C55E]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#22C55E] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            3D Spatial Command Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <Box className="w-8 h-8 text-[#22C55E]" />
            Active Incident Command Center 3D Matrix
          </h1>
          <p className="text-sm font-sans text-[#94A3B8] mt-1 max-w-2xl">
            Real-time digital twin spatial telemetry, dynamic room hazard pulse beacons, camera auto-tweening, and interactive room selector.
          </p>
        </div>
        <div className="px-4 py-3 rounded-2xl bg-[#020617]/80 border border-white/10 flex items-center gap-3 shrink-0">
          <Layers className="w-6 h-6 text-[#22D3EE]" />
          <div>
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Spatial Engine</span>
            <span className="text-xs font-heading font-bold text-white">Three.js / React Three Fiber</span>
          </div>
        </div>
      </div>

      {/* Main 3D Digital Twin View */}
      <DigitalTwinView />
    </div>
  );
}
