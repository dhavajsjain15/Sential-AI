'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Search, Bell, Bot, User, Shield, Clock } from 'lucide-react';
import { useCurrentTime } from '@/hooks';
import { formatDate } from '@/lib/utils';

interface DashboardNavbarProps {
  onMenuClick: () => void;
  onAIPanelToggle: () => void;
  isAIPanelOpen?: boolean;
}

export function DashboardNavbar({
  onMenuClick,
  onAIPanelToggle,
  isAIPanelOpen = false,
}: DashboardNavbarProps) {
  const currentTime = useCurrentTime();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4 lg:px-6">
      {/* Left section: Hamburger & Logo */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-[#3B82F6]" />
        </motion.button>

        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] p-0.5 flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
            <div className="w-full h-full bg-[#020617] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#22D3EE] animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-heading text-lg font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-[#22D3EE] bg-clip-text text-transparent">
              SENTINEL <span className="text-[#3B82F6]">AI</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 uppercase tracking-wider">
              MISSION CONTROL
            </span>
          </div>
        </div>
      </div>

      {/* Center section: Glass Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search active threats, devices, sensor feeds, or rooms (Press '/' to focus)..."
            className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-[#3B82F6]/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-[#94A3B8] outline-none transition-all duration-200"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-[#94A3B8]">
            /
          </kbd>
        </div>
      </div>

      {/* Right section: System Time, Notifications, AI Assistant & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Current Time Display */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[#94A3B8]">
          <Clock className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>{currentTime.toLocaleTimeString()}</span>
          <span className="text-white/30">|</span>
          <span className="text-white/70">{formatDate(currentTime)}</span>
        </div>

        {/* Notifications Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-[#94A3B8] hover:text-white transition-colors" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-md shadow-[#EF4444]/50">
            7
          </span>
        </motion.button>

        {/* AI Assistant Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAIPanelToggle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-300 ${
            isAIPanelOpen
              ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/30'
              : 'bg-gradient-to-r from-[#3B82F6]/20 to-[#8B5CF6]/20 hover:from-[#3B82F6]/30 hover:to-[#8B5CF6]/30 border-[#3B82F6]/30 text-[#22D3EE]'
          }`}
        >
          <Bot className="w-4 h-4 text-[#22D3EE] animate-bounce" />
          <span className="hidden sm:inline font-heading tracking-wide">JARVIS AI</span>
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
        </motion.button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
          <div className="relative cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] p-0.5 shadow-md">
              <div className="w-full h-full bg-[#020617] rounded-[10px] flex items-center justify-center font-heading font-bold text-xs text-white group-hover:bg-transparent transition-colors">
                JD
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-[#020617]" />
          </div>
        </div>
      </div>
    </header>
  );
}
