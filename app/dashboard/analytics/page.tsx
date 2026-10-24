'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { BarChart3, Download, RefreshCw, CheckCircle2, Sliders, Brain, Activity, Clock, Zap } from 'lucide-react';

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '30D' | '1Y'>('24H');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);

  const handleSyncModels = () => {
    setIsSyncing(true);
    setSyncSuccess(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess('✅ BAYESIAN CAUSAL WEIGHTS & TELEMETRY MODELS SYNCHRONIZED ACROSS ALL 142 NODES!');
      setTimeout(() => setSyncSuccess(null), 4000);
    }, 1200);
  };

  const handleExport = () => {
    setSyncSuccess('📊 ANALYTICS PACKAGE EXPORTED: downloaded Sentinel_AI_Predictive_Analytics_v2.4.csv');
    setTimeout(() => setSyncSuccess(null), 4000);
  };

  return (
    <div className="space-y-8 pb-14">
      {/* 1. Header & Interactive Controls */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#020617] to-cyan-950/40 border border-[#3B82F6]/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#3B82F6] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            Telemetry & Deep Learning Insights
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
            Comprehensive Predictive Analytics
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#94A3B8] mt-1">
            Real-time Bayesian causal graph trends, false-alarm reduction metrics, and response velocity heatmaps
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSyncModels}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-mono font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#22D3EE] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Weights...' : 'Sync AI Models'}</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:opacity-95 text-xs text-white font-heading font-bold transition-all shadow-lg shadow-[#3B82F6]/30 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {syncSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-[#020617]/90 border border-[#3B82F6]/50 text-[#22D3EE] text-xs font-mono font-bold flex items-center gap-2 shadow-xl"
          >
            <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>{syncSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Timeframe Selector & Model Status Bar */}
      <div className="p-4 rounded-2xl bg-[#020617] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <Clock className="w-4 h-4 text-[#22D3EE]" />
          <span className="font-bold uppercase tracking-wider text-white">Select Telemetry Horizon Window:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(['1H', '24H', '7D', '30D', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                timeframe === tf
                  ? 'bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/30'
                  : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {tf === '1H' && '⚡ 1 Hour Live'}
              {tf === '24H' && '📊 24 Hours'}
              {tf === '7D' && '📈 7 Days'}
              {tf === '30D' && '📅 30 Days'}
              {tf === '1Y' && '🌟 Annual Audit'}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Analytics Charts Container */}
      <div className="pt-2">
        <AnalyticsCharts />
      </div>
    </div>
  );
}
