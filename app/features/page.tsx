'use client';

import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { RiskCategoriesGrid } from '@/components/dashboard/RiskCategoriesGrid';
import { ShieldAlert, Sparkles, Brain, Radio, Eye, Lock } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col pt-24">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#22D3EE] text-xs font-mono font-semibold uppercase">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            12 Universal Hazard Typologies
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight">
            Multi-Modal Risk Intelligence
          </h1>
          <p className="text-base font-sans text-[#94A3B8] leading-relaxed">
            From thermal anomalies and VOC gas leaks to perimeter access breaches and elderly physiological monitoring, Sentinel AI classifies and mitigates risks across 12 distinct vectors simultaneously.
          </p>
        </div>

        {/* The 12 Risk Categories Grid */}
        <RiskCategoriesGrid />

        {/* Feature Deep Dive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <div className="p-3 rounded-2xl bg-[#3B82F6]/20 text-[#3B82F6] w-fit">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">YOLOv8 Edge Computer Vision</h3>
            <p className="text-xs font-sans text-[#94A3B8] leading-relaxed">
              Processes 30 frames per second on local edge AI nodes without sending raw video feeds to the cloud, guaranteeing low latency and 100% GDPR privacy compliance.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <div className="p-3 rounded-2xl bg-[#8B5CF6]/20 text-[#8B5CF6] w-fit">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Bayesian Evidence Graph</h3>
            <p className="text-xs font-sans text-[#94A3B8] leading-relaxed">
              Eliminates false alarms by cross-referencing acoustic signatures, temperature differentials, and VOC ppm before triggering emergency containment workflows.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <div className="p-3 rounded-2xl bg-[#22C55E]/20 text-[#22C55E] w-fit">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Autonomous Microservice Isolation</h3>
            <p className="text-xs font-sans text-[#94A3B8] leading-relaxed">
              Directly integrates with building HVAC chillers and high-voltage power breakers to isolate server rack fires in milliseconds without human intervention.
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
