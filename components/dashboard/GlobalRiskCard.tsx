'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, TrendingDown, CheckCircle2, BrainCircuit, AlertOctagon } from 'lucide-react';
import { useAnimatedCounter } from '@/hooks';

export function GlobalRiskCard() {
  const riskScore = useAnimatedCounter(34, 1500, 0);
  const confidence = useAnimatedCounter(97, 1500, 50);

  // SVG Ring calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-6 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-[#3B82F6]/30 shadow-2xl shadow-black relative overflow-hidden flex flex-col justify-between"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#3B82F6]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#22D3EE]">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-white tracking-tight">
              Global Risk Intelligence
            </h2>
            <p className="text-xs font-mono text-[#94A3B8]">
              Continuous Multi-Layer Threat Synthesis
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
          LOW RISK
        </span>
      </div>

      {/* Center Circular Progress Ring */}
      <div className="my-6 flex flex-col items-center justify-center relative">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Ring */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="14"
              fill="transparent"
            />
            {/* Animated Risk Ring */}
            <motion.circle
              cx="88"
              cy="88"
              r={radius}
              stroke="#22C55E"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300 drop-shadow-[0_0_12px_#22C55E]"
            />
          </svg>

          {/* Inner Number Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl md:text-5xl font-mono font-black text-white tracking-tighter">
              {riskScore}
              <span className="text-2xl text-[#22C55E]">%</span>
            </span>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#94A3B8] mt-1">
              RISK INDEX
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="flex items-center justify-center gap-1 text-[#22C55E] text-xs font-mono font-bold">
            <TrendingDown className="w-3.5 h-3.5" />
            ↓ 12%
          </div>
          <span className="text-[10px] text-[#94A3B8] block mt-1">7-Day Trend</span>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="flex items-center justify-center gap-1 text-[#22D3EE] text-xs font-mono font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {confidence}.3%
          </div>
          <span className="text-[10px] text-[#94A3B8] block mt-1">AI Confidence</span>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="flex items-center justify-center gap-1 text-[#3B82F6] text-xs font-mono font-bold">
            <BrainCircuit className="w-3.5 h-3.5" />
            24h Stable
          </div>
          <span className="text-[10px] text-[#94A3B8] block mt-1">Prediction</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-center">
          <div className="flex items-center justify-center gap-1 text-[#22C55E] text-xs font-mono font-bold">
            <AlertOctagon className="w-3.5 h-3.5" />
            LEVEL 1
          </div>
          <span className="text-[10px] text-[#22C55E] block mt-1">Severity Badge</span>
        </div>
      </div>
    </motion.div>
  );
}
