'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, FileWarning, Play, Camera, Download, Settings, PhoneCall, ShieldAlert } from 'lucide-react';

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { label: 'Emergency Report', icon: FileWarning, color: '#EF4444', onClick: () => alert('Opening Emergency Incident Report form...') },
    { label: 'Replay Timeline', icon: Play, color: '#8B5CF6', onClick: () => alert('Triggering 5-Phase Incident Replay...') },
    { label: 'Switch Camera', icon: Camera, color: '#3B82F6', onClick: () => alert('Cycling through 4 active CCTV streams...') },
    { label: 'Export Telemetry', icon: Download, color: '#22C55E', onClick: () => alert('Exporting CSV/JSON raw telemetry logs...') },
    { label: 'System Settings', icon: Settings, color: '#94A3B8', onClick: () => alert('Opening AI thresholds and Firebase config...') },
    { label: 'CALL 911 / EMS', icon: PhoneCall, color: '#EF4444', bold: true, onClick: () => alert('INITIATING EMERGENCY 911 / EMS AUTOMATED DISPATCH WITH AI SPEECH SYNTHESIS...') },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* Expanded Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="flex flex-col gap-2 p-3 rounded-3xl bg-[#020617]/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black max-w-xs"
          >
            <div className="px-2 py-1 border-b border-white/10 text-[10px] font-mono font-semibold uppercase text-[#22D3EE] flex items-center justify-between">
              <span>Quick Command HUD</span>
              <ShieldAlert className="w-3.5 h-3.5 text-[#3B82F6]" />
            </div>

            {actions.map((act, index) => {
              const IconComp = act.icon;
              return (
                <motion.button
                  key={act.label}
                  onClick={() => {
                    setIsOpen(false);
                    act.onClick();
                  }}
                  whileHover={{ scale: 1.03, x: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border text-xs font-heading transition-all ${
                    act.bold
                      ? 'bg-[#EF4444] border-[#EF4444] text-white font-bold shadow-lg shadow-[#EF4444]/40 animate-pulse'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white font-medium'
                  }`}
                >
                  <div
                    className="p-1.5 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${act.color}20`, color: act.bold ? '#fff' : act.color }}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="truncate">{act.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger FAB Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 border ${
          isOpen
            ? 'bg-[#020617] border-white/20 text-white shadow-white/10'
            : 'bg-gradient-to-br from-[#EF4444] to-[#B91C1C] border-[#EF4444]/50 text-white shadow-[#EF4444]/50'
        }`}
        aria-label="Toggle Quick Actions HUD"
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        >
          <Plus className="w-7 h-7" />
        </motion.div>
      </motion.button>
    </div>
  );
}
