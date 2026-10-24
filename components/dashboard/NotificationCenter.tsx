'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, AlertTriangle, ShieldAlert, Info, CheckCircle2, Clock } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/constants';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return n.type === 'alert' || n.type === 'critical';
    if (filter === 'warning') return n.type === 'warning';
    return n.type === 'info' || n.type === 'success' || n.type === 'system';
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
      case 'critical':
        return <ShieldAlert className="w-4 h-4 text-[#EF4444]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />;
      default:
        return <Info className="w-4 h-4 text-[#3B82F6]" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'alert':
      case 'critical': return 'border-l-[#EF4444]';
      case 'warning': return 'border-l-[#F59E0B]';
      case 'success': return 'border-l-[#22C55E]';
      default: return 'border-l-[#3B82F6]';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between max-h-[600px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444]">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-white tracking-tight flex items-center gap-2">
              Notification & Priority Alert Center
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px] font-mono font-bold">
                  {unreadCount} NEW
                </span>
              )}
            </h2>
            <p className="text-xs font-mono text-[#94A3B8]">
              Real-time push dispatches from Firebase Cloud Messaging & Edge Nodes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 border border-white/10 text-xs text-white font-mono transition-colors"
          >
            <Check className="w-3.5 h-3.5 text-[#22C55E]" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="my-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
        {(['all', 'critical', 'warning', 'info'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
              filter === tab
                ? 'bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/30'
                : 'bg-white/5 text-[#94A3B8] hover:text-white hover:bg-white/10'
            }`}
          >
            {tab} ({
              tab === 'all'
                ? notifications.length
                : tab === 'critical'
                ? notifications.filter((n) => n.type === 'alert' || n.type === 'critical').length
                : tab === 'warning'
                ? notifications.filter((n) => n.type === 'warning').length
                : notifications.filter((n) => n.type === 'info' || n.type === 'success' || n.type === 'system').length
            })
          </button>
        ))}
      </div>

      {/* Notifications Scrollable List */}
      <div className="overflow-y-auto space-y-3 pr-2 flex-1 no-scrollbar">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center text-[#94A3B8] text-xs font-mono"
            >
              No priority alerts matching the selected category.
            </motion.div>
          ) : (
            filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 border-l-4 ${getBorderColor(
                  item.type
                )} transition-all flex items-start justify-between gap-3 shadow-md`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10 mt-0.5 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-heading font-bold ${!item.read ? 'text-white font-black' : 'text-white/80'}`}>
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#94A3B8] pt-1">
                      <Clock className="w-3 h-3 text-[#22D3EE]" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteNotification(item.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#EF4444]/20 hover:text-[#EF4444] text-[#94A3B8] transition-colors shrink-0"
                  aria-label="Dismiss notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
