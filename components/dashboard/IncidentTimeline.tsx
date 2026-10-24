'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Mic,
  PhoneCall,
  CheckCircle2,
  FileText,
  Download,
  Info,
  ChevronRight,
  Clock,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import {
  useIncidentHistoryStore,
  IncidentEvent,
  EventSeverity,
} from '@/store/useIncidentHistoryStore';

export function IncidentTimeline({ isWidget = false }: { isWidget?: boolean }) {
  const {
    events,
    selectedEvent,
    activeFilter,
    selectEvent,
    setFilter,
    exportAuditJson,
    exportAuditText,
  } = useIncidentHistoryStore();

  // Filter logic
  const filteredEvents = events.filter((evt) => {
    if (activeFilter === 'CRITICAL') return evt.severity === 'CRITICAL';
    if (activeFilter === 'VOICE')
      return (
        evt.eventType === 'VOICE_VERIFICATION_STARTED' ||
        evt.eventType === 'SPEECH_INTENT_CAPTURED'
      );
    if (activeFilter === 'ESCALATION')
      return (
        evt.eventType === 'ESCALATION_INITIATED' ||
        evt.eventType === 'DISPATCH_TRIGGERED'
      );
    return true; // ALL
  });

  const getSeverityStyle = (severity: EventSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          nodeBg: 'bg-[#ef4444]',
          nodeGlow: 'shadow-[0_0_15px_#ef4444]',
          border: 'border-[#ef4444]/50',
          badge: 'bg-red-950 text-red-300 border-red-500',
          text: 'text-red-400',
        };
      case 'WARN':
        return {
          nodeBg: 'bg-[#f59e0b]',
          nodeGlow: 'shadow-[0_0_15px_#f59e0b]',
          border: 'border-[#f59e0b]/50',
          badge: 'bg-amber-950 text-amber-300 border-amber-500',
          text: 'text-amber-400',
        };
      case 'RESOLVED':
        return {
          nodeBg: 'bg-[#22c55e]',
          nodeGlow: 'shadow-[0_0_15px_#22c55e]',
          border: 'border-[#22c55e]/50',
          badge: 'bg-emerald-950 text-emerald-300 border-emerald-500',
          text: 'text-emerald-400',
        };
      default: // INFO
        return {
          nodeBg: 'bg-[#38bdf8]',
          nodeGlow: 'shadow-[0_0_15px_#38bdf8]',
          border: 'border-[#38bdf8]/50',
          badge: 'bg-sky-950 text-sky-300 border-sky-500',
          text: 'text-sky-400',
        };
    }
  };

  const getEventIcon = (eventType: IncidentEvent['eventType']) => {
    switch (eventType) {
      case 'MOTION_ANOMALY':
        return Activity;
      case 'FALL_CLASSIFIED':
        return AlertTriangle;
      case 'VOICE_VERIFICATION_STARTED':
      case 'SPEECH_INTENT_CAPTURED':
        return Mic;
      case 'ESCALATION_INITIATED':
      case 'DISPATCH_TRIGGERED':
        return PhoneCall;
      case 'ABORT_ACKNOWLEDGED':
        return CheckCircle2;
      default:
        return Info;
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-b from-white/5 to-black/30 backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

      {/* Header & Export Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#38bdf8]/20 border border-[#38bdf8]/50 text-[#38bdf8]">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-black text-white tracking-tight flex items-center gap-2">
              Incident Forensics & Timeline Ledger
            </h2>
            <p className="text-xs font-mono text-[#38bdf8]/80 mt-0.5">
              High-precision append-only chronological event streaming & sensor telemetry
            </p>
          </div>
        </div>

        {!isWidget && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportAuditJson()}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-white flex items-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#38bdf8]" />
              JSON Audit
            </button>
            <button
              onClick={() => exportAuditText()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-xs font-mono font-bold text-white flex items-center gap-2 shadow-lg shadow-[#38bdf8]/20 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              Export Medical/Insurance Log
            </button>
          </div>
        )}
      </div>

      {/* Quick Filter Chips */}
      {!isWidget && (
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <span className="text-xs font-mono text-white/50 flex items-center gap-1.5 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#38bdf8]" /> FILTER:
          </span>
          {[
            { id: 'ALL', label: 'All Lifecycle Events' },
            { id: 'CRITICAL', label: 'Critical Path Only' },
            { id: 'VOICE', label: 'Voice Interactions' },
            { id: 'ESCALATION', label: 'Escalations & Calls' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilter(chip.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeFilter === chip.id
                  ? 'bg-[#38bdf8] text-black shadow-md shadow-[#38bdf8]/30 font-extrabold'
                  : 'bg-black/40 hover:bg-white/10 text-white/70 border border-white/10'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Timeline & Detail Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start relative z-10">
        {/* Left Side: Vertical Trace-Line Timeline */}
        <div className={`${isWidget ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-4`}>
          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#38bdf8] via-[#ef4444] to-[#22c55e]">
            <AnimatePresence>
              {filteredEvents.map((evt, idx) => {
                const style = getSeverityStyle(evt.severity);
                const IconComponent = getEventIcon(evt.eventType);
                const isSelected = selectedEvent?.id === evt.id;

                return (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    onClick={() => selectEvent(evt)}
                    className={`relative cursor-pointer group p-4 rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? `bg-black/80 ${style.border} shadow-xl ring-1 ring-[#38bdf8]`
                        : 'bg-black/40 hover:bg-white/5 border-white/10'
                    }`}
                  >
                    {/* Illuminated Pulsating SVG Node Marker */}
                    <div
                      className={`absolute -left-[30px] top-5 w-4 h-4 rounded-full ${style.nodeBg} ${style.nodeGlow} flex items-center justify-center`}
                    >
                      <span className={`w-2 h-2 rounded-full bg-white ${evt.severity === 'CRITICAL' ? 'animate-ping' : ''}`} />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-black/60 border ${style.border} ${style.text}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${style.badge}`}>
                              {evt.eventType}
                            </span>
                            <span className="text-xs font-mono text-white/50">
                              +{evt.relativeOffsetSec.toFixed(2)}s
                            </span>
                          </div>
                          <h4 className="text-sm font-heading font-bold text-white mt-1 group-hover:text-[#38bdf8] transition-colors">
                            {evt.description}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <span className="text-xs font-mono text-white/60 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                          {evt.timestamp}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-[#38bdf8]' : 'text-white/30'}`} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Interactive Payload Inspection Drawer */}
        {!isWidget && (
          <div className="lg:col-span-1 p-5 rounded-3xl bg-black/60 border border-white/10 space-y-4 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-black text-[#38bdf8] uppercase tracking-widest flex items-center gap-2">
                PAYLOAD & SENSOR DRAWER
              </span>
              <ShieldAlert className="w-4 h-4 text-[#38bdf8]" />
            </div>

            <AnimatePresence mode="wait">
              {selectedEvent ? (
                <motion.div
                  key={selectedEvent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <span className="text-[10px] font-mono text-white/50 block">INCIDENT ID</span>
                    <span className="text-sm font-mono font-bold text-white">{selectedEvent.incidentId}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#020617] border border-white/10 space-y-1 text-xs font-mono">
                    <span className="text-[#38bdf8] font-bold block mb-1">EVENT SUMMARY</span>
                    <p className="text-white/90 leading-relaxed">{selectedEvent.description}</p>
                  </div>

                  {/* Metadata JSON Viewer */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">
                      RAW TELEMETRY PAYLOAD (JSON)
                    </span>
                    <pre className="p-3 rounded-2xl bg-[#020617] border border-white/10 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-[260px]">
                      {JSON.stringify(selectedEvent.metadata || {}, null, 2)}
                    </pre>
                  </div>
                </motion.div>
              ) : (
                <div className="py-12 text-center text-xs font-mono text-white/40 space-y-2">
                  <Info className="w-6 h-6 mx-auto text-[#38bdf8]" />
                  <p>Click any timeline node on the left to inspect raw payload & audio snippets.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
