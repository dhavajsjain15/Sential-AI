'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShieldAlert,
  Radio,
  AlertTriangle,
  BarChart3,
  Cpu,
  FileText,
  Play,
  Bell,
  Bot,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  Flame,
  Zap,
  Camera,
  Box,
  Sparkles,
} from 'lucide-react';
import { SIDEBAR_ITEMS } from '@/constants';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

export function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard': return LayoutDashboard;
      case 'ShieldAlert': return ShieldAlert;
      case 'Radio': return Radio;
      case 'Camera': return Camera;
      case 'Box': return Box;
      case 'Sparkles': return Sparkles;
      case 'AlertTriangle': return AlertTriangle;
      case 'BarChart3': return BarChart3;
      case 'Cpu': return Cpu;
      case 'FileText': return FileText;
      case 'Play': return Play;
      case 'Bell': return Bell;
      case 'Bot': return Bot;
      case 'Settings': return Settings;
      case 'User': return User;
      default: return LayoutDashboard;
    }
  };

  // Group sidebar items
  const groups: Record<string, typeof SIDEBAR_ITEMS> = {};
  SIDEBAR_ITEMS.forEach((item) => {
    const g = item.group || 'Main';
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
  });

  // Handle clicking a side navigation button
  const handleItemClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onToggle) {
      onToggle();
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 bottom-0 z-40 bg-[#020617]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-all duration-300 select-none overflow-y-auto overflow-x-hidden no-scrollbar shadow-2xl',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Top Brand & Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 shrink-0">
        {isOpen ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#22D3EE] flex items-center justify-center text-white shadow-lg shadow-[#3B82F6]/30 font-heading font-black text-xs">
              S-AI
            </div>
            <div>
              <span className="font-heading font-extrabold text-white text-sm tracking-tight block leading-tight">
                Sentinel <span className="text-[#22D3EE]">AI</span>
              </span>
              <span className="text-[10px] font-mono text-[#22C55E] flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                MESH v2.4.1 OK
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#22D3EE] flex items-center justify-center text-white shadow-lg shadow-[#3B82F6]/30 font-heading font-black text-xs">
              S
            </div>
          </div>
        )}

        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[#94A3B8] hover:text-white transition-colors active:scale-95 cursor-pointer"
            title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 py-4 px-3 space-y-6">
        {Object.entries(groups).map(([groupName, items]) => (
          <div key={groupName} className="space-y-1">
            {isOpen && (
              <div className="px-3 pb-1.5 text-[11px] font-heading font-semibold text-[#94A3B8] uppercase tracking-wider">
                {groupName}
              </div>
            )}
            {items.map((item) => {
              const IconComponent = getIcon(item.icon);
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleItemClick}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer active:scale-98',
                    isActive
                      ? 'bg-gradient-to-r from-[#3B82F6]/25 to-[#22D3EE]/15 text-white border border-[#3B82F6]/40 shadow-lg shadow-[#3B82F6]/15 font-bold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/10'
                  )}
                  title={!isOpen ? item.label : undefined}
                >
                  {/* Left Active Glow bar */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-[#3B82F6] to-[#22D3EE] rounded-r-full shadow-md shadow-[#3B82F6]"
                    />
                  )}

                  <div
                    className={cn(
                      'flex items-center justify-center p-1.5 rounded-lg transition-colors shrink-0',
                      isActive ? 'bg-[#3B82F6]/30 text-[#22D3EE]' : 'group-hover:bg-white/10 text-[#94A3B8] group-hover:text-white'
                    )}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {isOpen && (
                    <span className="flex-1 truncate tracking-tight">{item.label}</span>
                  )}

                  {isOpen && item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#EF4444]/25 border border-[#EF4444]/50 text-[#EF4444] shadow-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}

                  {!isOpen && item.badge && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Emergency Status Box */}
      <div className="p-3 border-t border-white/10 shrink-0">
        {isOpen ? (
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#020617] to-white/5 border border-white/10 space-y-2 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-heading font-medium text-[#94A3B8]">AI Security Shield</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 font-bold">
                ACTIVE
              </span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] h-full w-full animate-pulse" />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
              <span>Sensors: 142 Active</span>
              <span className="text-[#22D3EE]">1s Sync</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-1">
            <div
              className="p-2 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]"
              title="System Active — 142 Sensors Online"
            >
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
