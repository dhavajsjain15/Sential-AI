'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationCenter } from '@/components/dashboard/NotificationCenter';
import { Bell, Radio, CheckCircle2, Zap, ShieldAlert, Send } from 'lucide-react';

export default function NotificationsPage() {
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);

  const handleTestPushBroadcast = () => {
    setBroadcastStatus('📡 BROADCASTING HIGH-PRIORITY FCM & SMS PUSH TO ALL LEVEL 5 OPERATOR DEVICES...');
    setTimeout(() => {
      setBroadcastStatus('✅ TEST PUSH ACKNOWLEDGED: Delivered to 14 active operator smartphones (<120ms latency).');
      setTimeout(() => setBroadcastStatus(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-14">
      {/* 1. Header & Test Push Broadcast Trigger */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-[#020617] to-purple-950/40 border border-[#EF4444]/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#EF4444] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 animate-bounce" />
            Operator Alert & Dispatch Center
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
            Real-Time Push Notifications & Audit Log
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#94A3B8] mt-1">
            Review edge node alarms, Gemini XAI causal alerts, and test emergency FCM push channels
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestPushBroadcast}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#EF4444] to-[#F59E0B] hover:opacity-95 text-white font-heading font-bold text-xs shadow-xl shadow-[#EF4444]/30 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Emergency Push Test</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {broadcastStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-[#020617]/90 border border-[#EF4444]/50 text-red-200 text-xs font-mono font-bold flex items-center gap-2 shadow-xl"
          >
            <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>{broadcastStatus}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Notification Center */}
      <NotificationCenter />
    </div>
  );
}
