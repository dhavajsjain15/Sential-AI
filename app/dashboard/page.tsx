'use client';

import React from 'react';
import Link from 'next/link';
import { MissionControlHeader } from '@/components/dashboard/MissionControlHeader';
import { GlobalRiskCard } from '@/components/dashboard/GlobalRiskCard';
import { LiveIncidentFeed } from '@/components/dashboard/LiveIncidentFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import {
  ShieldAlert,
  Radio,
  Box,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* 1. Mission Control Header */}
      <MissionControlHeader />

      {/* 2. Primary Executive Overview Row: Risk Gauge (Left 1/3) & Live Incident Stream (Right 2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <GlobalRiskCard />
        </div>
        <div className="lg:col-span-2">
          <LiveIncidentFeed />
        </div>
      </div>

      {/* 3. Dedicated Command Portals Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heading font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#22D3EE]" />
              Dedicated Intelligence & Operations Portals
            </h2>
            <p className="text-xs font-mono text-[#94A3B8] mt-0.5">
              Access focused sub-systems for active triage, 3D spatial matrix, decision forensics, and live camera feeds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Immediate SOS & Incidents */}
          <Link
            href="/dashboard/incidents"
            className="group p-5 rounded-3xl bg-gradient-to-br from-red-950/40 via-white/5 to-transparent border border-red-500/30 hover:border-red-500/60 transition-all duration-300 shadow-xl hover:shadow-red-500/10 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold uppercase border border-red-500/40">
                  SOS Armed
                </span>
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-white group-hover:text-red-300 transition-colors">
                  Incident Command & SOS
                </h3>
                <p className="text-xs font-sans text-[#94A3B8] mt-1 leading-relaxed">
                  Direct call 911 dispatch bar, active incident triage, and chronological forensics ledger.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-red-400 group-hover:translate-x-1 transition-transform">
              <span>Open Ledger</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Risk Intelligence & XAI */}
          <Link
            href="/dashboard/risk-intelligence"
            className="group p-5 rounded-3xl bg-gradient-to-br from-blue-950/40 via-white/5 to-transparent border border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold uppercase border border-blue-500/40">
                  12 Layers
                </span>
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-white group-hover:text-blue-300 transition-colors">
                  Risk Intelligence & XAI
                </h3>
                <p className="text-xs font-sans text-[#94A3B8] mt-1 leading-relaxed">
                  Bayesian risk attribution breakdown, factor weightings, and explainable neural decision trees.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Analyze Threat Graph</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: 3D Digital Twin Command */}
          <Link
            href="/dashboard/digital-twin"
            className="group p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-white/5 to-transparent border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 group-hover:scale-110 transition-transform">
                  <Box className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase border border-emerald-500/40">
                  3D Matrix
                </span>
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Active 3D Digital Twin
                </h3>
                <p className="text-xs font-sans text-[#94A3B8] mt-1 leading-relaxed">
                  Interactive room hazard pulse beacons, 3D spatial canvas, and camera auto-tweening.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Launch 3D Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 4: Live Monitoring & WebCam */}
          <Link
            href="/dashboard/live-monitoring"
            className="group p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-white/5 to-transparent border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 group-hover:scale-110 transition-transform">
                  <Radio className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold uppercase border border-purple-500/40">
                  Real-time
                </span>
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-[#FFFFFF] group-hover:text-purple-300 transition-colors">
                  Live Monitoring & Vision
                </h3>
                <p className="text-xs font-sans text-[#94A3B8] mt-1 leading-relaxed">
                  Multi-feed edge camera surveillance, optical flow telemetry, and hardware webcam overlay.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>View Live Feeds</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>

      {/* Floating Quick Action HUD */}
      <QuickActions />
    </div>
  );
}
