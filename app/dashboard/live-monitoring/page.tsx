'use client';

import React from 'react';
import Link from 'next/link';
import { LiveCameraPanel } from '@/components/dashboard/LiveCameraPanel';
import { SensorGrid } from '@/components/dashboard/SensorGrid';
import { Radio, Eye, Camera, ArrowRight, Activity } from 'lucide-react';

export default function LiveMonitoringPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Page Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-white/5 to-emerald-950/40 border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-[#22C55E] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            Live Edge Telemetry Stream
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-[#22D3EE]" />
            Live Vision Analytics & Sensor Grid
          </h1>
          <p className="text-sm font-sans text-[#94A3B8] mt-1 max-w-2xl">
            Real-time computer vision stream analysis, pose estimation confidence, bounding box tracking, and environmental sensor telemetry.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] font-mono text-xs font-bold flex items-center gap-2 shrink-0">
            <Eye className="w-4 h-4" />
            4 EDGE CAMERAS ONLINE
          </span>
          <Link
            href="/dashboard/live-webcam"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] text-black font-heading font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-[#22D3EE]/20 shrink-0"
          >
            <Camera className="w-4 h-4" />
            Launch Live Webcam Feed
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Vision Analytics Multi-Feed Camera Grid */}
      <LiveCameraPanel />

      {/* Real-time Hardware Sensor Grid */}
      <SensorGrid />
    </div>
  );
}
