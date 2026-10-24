'use client';

import React from 'react';
import { EmergencyActionPanel } from '@/components/dashboard/EmergencyActionPanel';
import { FamilyEmergencyPanel } from '@/components/dashboard/FamilyEmergencyPanel';
import { IncidentTimeline } from '@/components/dashboard/IncidentTimeline';
import { ShieldAlert, AlertTriangle, CheckCircle2, PhoneCall } from 'lucide-react';
import { useIncidentHistoryStore } from '@/store/useIncidentHistoryStore';

export default function IncidentsPage() {
  const { events } = useIncidentHistoryStore();

  const criticalCount = events.filter((e) => e.severity === 'CRITICAL').length;
  const warnCount = events.filter((e) => e.severity === 'WARN').length;
  const resolvedCount = events.filter((e) => e.severity === 'RESOLVED').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-[#ef4444]" />
            Incident Command, Forensics & Audit Ledger
          </h1>
          <p className="text-sm font-mono text-white/60 mt-1">
            Immediate-action emergency dispatch control bar, direct family SOS notifications, real-time event stream logging, and audit exports.
          </p>
        </div>

        {/* Quick Vitals Badges */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3.5 py-2 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>CRITICAL: {criticalCount}</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-300 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span>WARNINGS: {warnCount}</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>RESOLVED: {resolvedCount}</span>
          </div>
        </div>
      </div>

      {/* 1. Immediate-Action Direct Call SOS Control Bar */}
      <EmergencyActionPanel />

      {/* 2. Direct Family-Only SOS & Targeted Notification Manager */}
      <FamilyEmergencyPanel />

      {/* 3. Main Incident Timeline Ledger */}
      <IncidentTimeline />
    </div>
  );
}

