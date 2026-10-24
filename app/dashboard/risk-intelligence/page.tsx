'use client';

import React from 'react';
import { RiskCategoriesGrid } from '@/components/dashboard/RiskCategoriesGrid';
import { GlobalRiskCard } from '@/components/dashboard/GlobalRiskCard';
import { ExplainableTriggerPanel } from '@/components/dashboard/ExplainableTriggerPanel';
import { ShieldAlert, Sparkles, Brain } from 'lucide-react';

export default function RiskIntelligencePage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#3B82F6]/20 via-[#8B5CF6]/10 to-transparent border border-[#3B82F6]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#22D3EE] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            Explainable AI Risk Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-[#3B82F6]" />
            Global Risk Intelligence & Decision Forensics
          </h1>
          <p className="text-sm font-sans text-[#94A3B8] mt-1 max-w-2xl">
            Autonomous synthesis of physical, environmental, physiological, and cyber vectors using real-time Bayesian updating, attribution metrics, and causal evidence graphs.
          </p>
        </div>
        <div className="px-4 py-3 rounded-2xl bg-[#020617]/80 border border-white/10 flex items-center gap-3 shrink-0">
          <Brain className="w-6 h-6 text-[#8B5CF6]" />
          <div>
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">AI Model Active</span>
            <span className="text-xs font-heading font-bold text-white">Gemini 1.5 Pro Telemetry</span>
          </div>
        </div>
      </div>

      {/* Global Risk Overview & XAI Decision Forensics Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <GlobalRiskCard />
        </div>
        <div className="lg:col-span-2">
          <ExplainableTriggerPanel />
        </div>
      </div>

      {/* 12-Layer Threat Categories Grid */}
      <RiskCategoriesGrid />
    </div>
  );
}
