'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, CloudSun, Cpu, Activity, ShieldCheck, Zap } from 'lucide-react';
import { useCurrentTime } from '@/hooks';
import { formatDate } from '@/lib/utils';

export function MissionControlHeader() {
  const currentTime = useCurrentTime();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-4 md:p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-[#22D3EE] uppercase font-semibold">
              TESLA / PALANTIR MISSION CONTROL v2.4.1
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight mt-1">
            Autonomous Risk Command Center
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#22C55E] animate-bounce" />
            <span className="text-xs font-mono font-bold text-[#22C55E]">DEFCON 5 — NORMAL</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-xs font-mono font-bold text-[#3B82F6]">AI SYNC 99.9%</span>
          </div>
        </div>
      </div>

      {/* Grid of 6 Status Cells */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {/* Cell 1: Live Time */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3B82F6]/40 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-heading uppercase">Live Time</span>
            <Clock className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-lg md:text-xl font-mono font-bold text-white mt-2">
            {currentTime.toLocaleTimeString()}
          </div>
          <span className="text-[10px] font-mono text-[#22D3EE]">UTC+0 / SYNCED</span>
        </div>

        {/* Cell 2: Date */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3B82F6]/40 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-heading uppercase">System Date</span>
            <Calendar className="w-4 h-4 text-[#22D3EE]" />
          </div>
          <div className="text-base md:text-lg font-mono font-bold text-white mt-2 truncate">
            {formatDate(currentTime).split(',')[0]}
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8]">CYBER CYCLE 2026</span>
        </div>

        {/* Cell 3: Weather */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3B82F6]/40 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-heading uppercase">Environment</span>
            <CloudSun className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-lg md:text-xl font-mono font-bold text-white mt-2">
            28°C
          </div>
          <span className="text-[10px] font-mono text-[#F59E0B] truncate">Partly Cloudy | 64% RH</span>
        </div>

        {/* Cell 4: Connected Devices */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3B82F6]/40 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-heading uppercase">IoT Nodes</span>
            <Cpu className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-lg md:text-xl font-mono font-bold text-white mt-2 flex items-center gap-2">
            142 / 156
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
          </div>
          <span className="text-[10px] font-mono text-[#22C55E]">91% ONLINE</span>
        </div>

        {/* Cell 5: System Status */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3B82F6]/40 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-heading uppercase">AI Vitals</span>
            <Activity className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="text-base md:text-lg font-mono font-bold text-[#22C55E] mt-2 flex items-center gap-1.5">
            OPERATIONAL
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8]">0 Critical Outages</span>
        </div>

        {/* Cell 6: Global Risk Level */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#22D3EE]/10 border border-[#3B82F6]/40 flex flex-col justify-between shadow-lg shadow-[#3B82F6]/10">
          <div className="flex items-center justify-between text-[#22D3EE] text-xs font-semibold">
            <span className="font-heading uppercase">Global Risk</span>
            <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-lg md:text-xl font-mono font-bold text-white mt-2">
            LOW — 34%
          </div>
          <span className="text-[10px] font-mono text-[#22D3EE] font-medium">↓ 12% Trend Improvement</span>
        </div>
      </div>
    </motion.div>
  );
}
