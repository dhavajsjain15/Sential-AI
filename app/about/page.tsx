'use client';

import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Shield, Users, Globe, Award, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col pt-24">
      <PublicNavbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 lg:px-12 py-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#22D3EE] text-xs font-mono font-semibold uppercase">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            Our Mission & Origin Story
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight">
            Building the World's Digital Shield
          </h1>
          <p className="text-base font-sans text-[#94A3B8] leading-relaxed">
            Founded by veteran AI researchers and infrastructure architects, Sentinel AI was built to solve a critical flaw in modern physical security: isolated alarms create chaos, not clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2 text-center">
            <Globe className="w-8 h-8 text-[#3B82F6] mx-auto mb-2" />
            <h3 className="font-heading font-bold text-lg text-white">Universal Protection</h3>
            <p className="text-xs font-sans text-[#94A3B8]">Deployable across enterprise data centers, hospitals, schools, and high-security industrial facilities worldwide.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2 text-center">
            <Shield className="w-8 h-8 text-[#22D3EE] mx-auto mb-2" />
            <h3 className="font-heading font-bold text-lg text-white">Palantir-Grade Forensics</h3>
            <p className="text-xs font-sans text-[#94A3B8]">Every telemetry spike and containment decision is logged into an immutable ledger for verified post-incident audits.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2 text-center">
            <Award className="w-8 h-8 text-[#8B5CF6] mx-auto mb-2" />
            <h3 className="font-heading font-bold text-lg text-white">DeepMind XAI Synthesis</h3>
            <p className="text-xs font-sans text-[#94A3B8]">Pioneering the use of large multimodal reasoning models to replace static threshold bells with human-readable intelligence.</p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
