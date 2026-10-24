'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, HeartPulse, ShieldAlert, PhoneCall, AlertOctagon, Radio, Siren, CheckCircle, BellRing, Heart, Users, MessageSquare } from 'lucide-react';
import { GlobalConfigService } from '@/admin/services/GlobalConfigService';
import { EventBus } from '@/iot/events/EventBus';
import { useFamilyEmergencyStore } from '@/store/useFamilyEmergencyStore';

export interface EmergencyChannel {
  id: string;
  title: string;
  subtitle: string;
  telUri: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  hoverClass: string;
}

export function EmergencyActionPanel() {
  const [sosActivated, setSosActivated] = useState<boolean>(false);
  const [activationFeedback, setActivationFeedback] = useState<string | null>(null);

  const { contacts, dispatchFamilyOnlySOS, openCallModal } = useFamilyEmergencyStore();
  const primaryFamily = contacts.find((c) => c.isPrimary) || contacts[0];

  const directChannels: EmergencyChannel[] = [
    {
      id: 'fire-force',
      title: 'FIRE FORCE',
      subtitle: 'Connect directly to local fire & rescue services (`tel:101`)',
      telUri: 'tel:101',
      icon: Flame,
      colorClass: 'text-[#EF4444]',
      borderClass: 'border-[#EF4444]/50',
      bgClass: 'bg-red-950/40',
      hoverClass: 'hover:bg-red-900/60 hover:border-[#EF4444] shadow-[0_0_20px_rgba(239,68,68,0.25)]',
    },
    {
      id: 'medical-ambulance',
      title: 'MEDICAL / AMBULANCE',
      subtitle: 'Initiates immediate emergency paramedic dispatch (`tel:102`)',
      telUri: 'tel:102',
      icon: HeartPulse,
      colorClass: 'text-[#EC4899]',
      borderClass: 'border-[#EC4899]/50',
      bgClass: 'bg-pink-950/40',
      hoverClass: 'hover:bg-pink-900/60 hover:border-[#EC4899] shadow-[0_0_20px_rgba(236,72,153,0.25)]',
    },
    {
      id: 'police-dispatch',
      title: 'POLICE DEPARTMENT',
      subtitle: 'Direct route to closest tactical dispatch unit (`tel:100`)',
      telUri: 'tel:100',
      icon: ShieldAlert,
      colorClass: 'text-[#3B82F6]',
      borderClass: 'border-[#3B82F6]/50',
      bgClass: 'bg-blue-950/40',
      hoverClass: 'hover:bg-blue-900/60 hover:border-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.25)]',
    },
    {
      id: 'women-safety',
      title: 'WOMEN SAFETY HELPLINE',
      subtitle: 'Dedicated immediate emergency routing (`tel:1091`)',
      telUri: 'tel:1091',
      icon: PhoneCall,
      colorClass: 'text-[#A855F7]',
      borderClass: 'border-[#A855F7]/50',
      bgClass: 'bg-purple-950/40',
      hoverClass: 'hover:bg-purple-900/60 hover:border-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.25)]',
    },
  ];

  /**
   * Master SOS Trigger:
   * Simultaneously opens primary emergency dialer while running fast system background function
   * to flag Universal Risk Engine score to maximum (100+ High Risk) and flash active alarms.
   */
  const handleMasterRescueActivation = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSosActivated(true);
    setActivationFeedback('Universal Risk Score escalated to MAXIMUM (100%). Initiating direct CAD voice trunk (`tel:112`)...');

    // 1. Run fast background system function to flag Risk Score to max and flash active alarms
    try {
      const configService = GlobalConfigService.getInstance();
      configService.logAudit('SOS Control Bar', 'Master "ACTIVATE ALL RESCUE" button triggered by operator.', 'Override Triggered');

      const eventBus = EventBus.getInstance();
      eventBus.publish('FUSION_INCIDENT_TRIGGERED', {
        incidentId: `SOS-MASTER-${Date.now().toString().slice(-6)}`,
        incidentTitle: 'CRITICAL MASTER SOS RESCUE ACTIVATED',
        incidentType: 'Fire & Medical Emergency',
        severity: 'CRITICAL',
        riskScore: 100,
        roomOrZone: 'All Zones (Master Facility Command)',
        triggeredAt: new Date().toISOString(),
      }, 'MASTER-SOS-001', 'critical');

      eventBus.publish('ESCALATION_LEVEL_RAISED', {
        level: 5,
        name: 'Emergency Services',
        contactChannel: 'Direct 911 / 112 CAD Voice Trunk (`tel:112`)',
        triggeredAt: new Date().toISOString(),
      }, undefined, 'critical');
    } catch (err) {
      console.error('Error triggering background SOS pipeline:', err);
    }

    // 2. Open primary emergency dialer instantly
    if (typeof window !== 'undefined') {
      window.location.href = 'tel:112';
    }

    setTimeout(() => setActivationFeedback(null), 6000);
  };

  const handleTriggerFamilySOSDirect = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatchFamilyOnlySOS('Manual SOS button triggered from Control Bar', 'Master Quarters');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-3xl bg-red-950/40 backdrop-blur-2xl border border-red-500/50 shadow-2xl space-y-6 relative overflow-hidden"
    >
      {/* Background Animated Warning Grid & Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 via-[#EF4444]/10 to-red-950/20 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#EF4444]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-500/30 pb-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-red-900/60 border border-red-500/70 text-red-500 shadow-lg shadow-red-500/30">
            <Siren className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-extrabold text-white tracking-tight flex items-center gap-2.5">
              Immediate-Action Direct Call SOS Control Bar
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            </h2>
            <p className="text-xs font-mono text-red-300">
              Native hardware voice trunk redirect pipeline (`tel:` URI protocol) — zero latency emergency dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-red-900/50 border border-red-500/60 text-red-400 text-xs font-mono font-bold flex items-center gap-2">
            <BellRing className="w-3.5 h-3.5 animate-bounce" />
            HARDWARE VOICE TRUNKS ARMED
          </span>
        </div>
      </div>

      {/* Feedback Alert Banner */}
      <AnimatePresence>
        {activationFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-red-900/80 border-2 border-red-400 text-white text-xs font-mono flex items-center justify-between gap-3 shadow-xl relative z-10"
          >
            <div className="flex items-center gap-2.5">
              <AlertOctagon className="w-5 h-5 text-red-300 animate-pulse shrink-0" />
              <span>{activationFeedback}</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-red-950 text-red-300 text-[10px] uppercase font-bold shrink-0">
              100% Risk Escalated
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Master Controls Row: Public 911 Master SOS + Voice AI Trigger */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* "ACTIVATE ALL RESCUE" Master SOS Button */}
        <button
          onClick={handleMasterRescueActivation}
          className="md:col-span-3 w-full p-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-rose-700 hover:from-red-500 hover:to-rose-600 border-2 border-red-400 text-white shadow-[0_0_40px_rgba(239,68,68,0.6)] transition-all duration-300 transform active:scale-[0.99] group flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="p-4 rounded-2xl bg-red-950/80 border border-red-400 text-red-400 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <AlertOctagon className="w-9 h-9 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-white text-red-700 text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                  Master Priority 0
                </span>
                <span className="text-xs font-mono text-red-200">Simultaneous Multi-Tier Escalation</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white drop-shadow-md">
                ACTIVATE ALL RESCUE — MASTER SOS
              </h3>
              <p className="text-xs sm:text-sm font-mono text-red-100/90 mt-1">
                Tap to open primary dialer (`tel:112`) while instantly locking Global Risk Score to 100% High Risk
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-center shrink-0 px-4 py-2.5 rounded-xl bg-red-950/90 border border-red-400/80 text-center sm:text-right">
            <span className="text-xs font-mono text-red-300 font-bold block">INSTANT HARDWARE DIAL</span>
            <span className="text-[11px] font-mono text-red-400">Universal Dispatch Trunk</span>
          </div>
        </button>

        {/* Voice Assistant Manual Trigger Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('VOICE_ASSISTANT_TRIGGER'));
          }}
          className="md:col-span-1 w-full p-6 rounded-2xl bg-[#020617]/80 hover:bg-amber-950/80 border-2 border-amber-500/50 hover:border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300 transform active:scale-[0.99] group flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
        >
          <div className="p-3 rounded-full bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform duration-300">
            <PhoneCall className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-heading font-black text-amber-400">
            TRIGGER VOICE AI
          </h3>
          <p className="text-[10px] font-mono text-amber-200/70">
            Test Audio Protocol
          </p>
        </button>
      </div>

      {/* 2. Direct Family-Only SOS Action Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/80 via-[#020617] to-cyan-950/80 border-2 border-[#22D3EE]/50 shadow-xl space-y-3 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#22D3EE]/20 border border-[#22D3EE]/40 text-[#22D3EE]">
              <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-mono font-bold uppercase border border-[#22C55E]/40">
                  FAMILY ONLY SOS (NO 911 SIRENS)
                </span>
                <span className="text-xs font-mono text-[#94A3B8]">Targeted Family Dispatch</span>
              </div>
              <h4 className="text-lg font-heading font-bold text-white">
                Direct Call Primary Family Contact ({primaryFamily?.name} - {primaryFamily?.relationship})
              </h4>
              <p className="text-xs font-mono text-[#94A3B8]">
                Dispatches private SMS tracking notifications exclusively to your registered family members.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleTriggerFamilySOSDirect}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] hover:opacity-90 text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#22D3EE]/20 transition-all active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              DIRECT CALL FAMILY SOS
            </button>
            <button
              onClick={() => openCallModal(primaryFamily)}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Users className="w-4 h-4 text-[#22D3EE]" />
              View Family ({contacts.length})
            </button>
          </div>
        </div>
      </div>

      {/* 3. Direct Action Triggers Grid (Configurable Placeholders with Universal tel: routing) */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5" /> Direct Hardware Communication Triggers (`tel:` URI protocols)
          </span>
          <span className="text-[11px] font-mono text-red-300">
            Tap to launch immediate voice call device pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {directChannels.map((channel) => {
            const IconComponent = channel.icon;
            return (
              <a
                key={channel.id}
                href={channel.telUri}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer ${channel.bgClass} ${channel.borderClass} ${channel.hoverClass}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`p-3 rounded-xl bg-black/60 border border-white/10 ${channel.colorClass} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 border border-white/10 text-[11px] font-mono font-bold text-white tracking-widest">
                    {channel.telUri.replace('tel:', 'TEL: ')}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-base font-heading font-extrabold text-white tracking-tight group-hover:text-red-400 transition-colors">
                    {channel.title}
                  </h4>
                  <p className="text-xs font-mono text-red-200/80 leading-relaxed">
                    {channel.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-red-400 font-bold group-hover:text-white transition-colors">
                  <span>TAP TO DIAL INSTANTLY</span>
                  <PhoneCall className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Guidance */}
      <div className="p-3.5 rounded-2xl bg-black/60 border border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-red-300 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Universal anchor `tel:` links automatically open native iOS/Android cellular or desktop VoIP dialers.</span>
        </div>
        <span className="text-red-400/80 text-[11px]">Zero Personal User Numbers • 100% Configurable Placeholders</span>
      </div>
    </motion.div>
  );
}
