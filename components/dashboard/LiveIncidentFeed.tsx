'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  ShieldAlert,
  Wind,
  Activity,
  CheckCircle,
  Users,
  AlertTriangle,
  Eye,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { MOCK_INCIDENTS } from '@/constants';

export function LiveIncidentFeed() {
  const [expandedId, setExpandedId] = useState<string | null>('inc-1');

  const getIncidentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return Flame;
      case 'ShieldAlert': return ShieldAlert;
      case 'Wind': return Wind;
      case 'Activity': return Activity;
      case 'CheckCircle': return CheckCircle;
      case 'Users': return Users;
      case 'AlertTriangle': return AlertTriangle;
      case 'Eye': return Eye;
      default: return AlertTriangle;
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          dot: 'bg-[#EF4444] shadow-lg shadow-[#EF4444]',
          badge: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/50',
          border: 'border-l-[#EF4444]',
        };
      case 'high':
        return {
          dot: 'bg-[#F59E0B] shadow-lg shadow-[#F59E0B]',
          badge: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50',
          border: 'border-l-[#F59E0B]',
        };
      case 'medium':
        return {
          dot: 'bg-[#3B82F6] shadow-lg shadow-[#3B82F6]',
          badge: 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/50',
          border: 'border-l-[#3B82F6]',
        };
      default:
        return {
          dot: 'bg-[#22C55E] shadow-lg shadow-[#22C55E]',
          badge: 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/50',
          border: 'border-l-[#22C55E]',
        };
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between max-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-white tracking-tight flex items-center gap-2">
              Live Incident Timeline Feed
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
            </h2>
            <p className="text-xs font-mono text-[#94A3B8]">
              Continuous Multi-Modal Threat Detection & Response History
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[#22D3EE]">
          8 ACTIVE LOGS
        </span>
      </div>

      {/* Vertical Timeline Feed (Scrollable) */}
      <div className="my-4 pr-2 overflow-y-auto space-y-4 relative flex-1 no-scrollbar">
        {/* Timeline vertical connector line */}
        <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#EF4444] via-[#3B82F6] to-white/10 pointer-events-none" />

        {MOCK_INCIDENTS.map((inc, index) => {
          const IconComponent = getIncidentIcon(inc.icon || 'AlertTriangle');
          const styles = getPriorityStyles(inc.priority || 'medium');
          const isExpanded = expandedId === inc.id;

          return (
            <motion.div
              key={inc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setExpandedId(isExpanded ? null : inc.id)}
              className={`relative pl-14 pr-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer shadow-md ${
                isExpanded ? 'bg-white/10 border-white/30 ring-1 ring-[#3B82F6]/50' : ''
              }`}
            >
              {/* Timeline Dot & Icon */}
              <div
                className={`absolute left-3.5 top-3.5 w-6 h-6 rounded-full flex items-center justify-center text-[#020617] font-bold z-10 ${styles.dot}`}
              >
                <IconComponent className="w-3.5 h-3.5 text-white" />
              </div>

              {/* Top Row: Title, Time & Priority */}
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                  {inc.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${styles.badge}`}
                  >
                    {inc.priority || 'medium'}
                  </span>
                  <span className="text-xs font-mono text-[#94A3B8] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#22D3EE]" />
                    {inc.time || new Date(inc.timestamp || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Location & Status Subtitle */}
              <div className="flex items-center justify-between mt-1 text-xs text-[#94A3B8]">
                <span className="flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-[#F59E0B]" />
                  {inc.location}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-mono uppercase text-white/80 border border-white/10">
                    {inc.status}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </div>
              </div>

              {/* Expanded AI Synthesis Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs overflow-hidden"
                  >
                    <div className="p-3 rounded-xl bg-[#020617]/80 border border-[#3B82F6]/30 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-[#22D3EE]">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Explainable Synthesis & Evidence Graph
                      </div>
                      <p className="text-white/90 font-sans leading-relaxed">
                        Multi-sensor fusion verified threshold deviation across thermal and optical feeds in {inc.location}. Automated containment protocols triggered immediately without false alarm degradation.
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-[#94A3B8]">
                      <span>ID: #{inc.id.toUpperCase()}</span>
                      <span className="text-[#22C55E]">● Logged to Immutable Ledger</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
