'use client';

import React from 'react';
import { CameraStatus } from '../types';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

interface ConnectionBadgeProps {
  status: CameraStatus;
  bitrateKbps?: number;
}

export function ConnectionBadge({ status, bitrateKbps = 8400 }: ConnectionBadgeProps) {
  switch (status) {
    case 'online':
      return (
        <span className="px-2.5 py-1 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
          <Wifi className="w-3 h-3" />
          ONLINE {(bitrateKbps / 1000).toFixed(1)} Mbps
        </span>
      );
    case 'connecting':
    case 'reconnecting':
      return (
        <span className="px-2.5 py-1 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 animate-pulse">
          <RefreshCw className="w-3 h-3 animate-spin" />
          RECONNECTING STREAM...
        </span>
      );
    case 'error':
      return (
        <span className="px-2.5 py-1 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-[10px] font-mono font-bold uppercase flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" />
          STREAM ERROR / BITRATE DROP
        </span>
      );
    case 'offline':
    default:
      return (
        <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-[#94A3B8] text-[10px] font-mono font-bold uppercase flex items-center gap-1.5">
          <WifiOff className="w-3 h-3" />
          OFFLINE (CHECK POWER)
        </span>
      );
  }
}
