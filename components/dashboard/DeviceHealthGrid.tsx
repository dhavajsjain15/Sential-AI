'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Cpu, Router, Cloud, Database, Brain, Server, HardDrive, ShieldCheck, AlertTriangle } from 'lucide-react';
import { DEVICES } from '@/constants';

export function DeviceHealthGrid() {
  const getDeviceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return Camera;
      case 'Cpu': return Cpu;
      case 'Router': return Router;
      case 'Cloud': return Cloud;
      case 'Database': return Database;
      case 'Brain': return Brain;
      case 'Server': return Server;
      case 'HardDrive': return HardDrive;
      default: return Cpu;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            Infrastructure & AI Service Health
          </h2>
          <p className="text-xs font-mono text-[#94A3B8]">
            ESP32 Edge Nodes, Firebase Sync, Gemini AI & FastAPI Microservices
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          ALL CORE SERVICES HEALTHY
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {DEVICES.map((dev, index) => {
          const IconComponent = getDeviceIcon(dev.icon || 'Cpu');
          const isWarning = dev.status === 'warning';
          const devLatency = dev.latency || '14ms';
          const devColor = dev.color || '#3B82F6';
          const devUptime = dev.uptime || '99.99%';
          const latencyNum = parseInt(devLatency.replace('ms', ''), 10) || 10;
          const latencyColor = latencyNum < 50 ? '#22C55E' : latencyNum < 100 ? '#F59E0B' : '#EF4444';

          return (
            <motion.div
              key={dev.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between shadow-lg relative overflow-hidden"
            >
              {/* Header: Status Dot & Type */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isWarning ? 'bg-[#F59E0B] animate-pulse' : 'bg-[#22C55E]'
                    }`}
                  />
                  <span className="text-[10px] font-mono font-bold uppercase text-white/80">
                    {dev.status}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-[#94A3B8]">
                  {dev.type}
                </span>
              </div>

              {/* Icon & Name */}
              <div className="flex items-center gap-3 my-3">
                <div
                  className="p-2.5 rounded-xl flex items-center justify-center shrink-0 shadow"
                  style={{ backgroundColor: `${devColor}20`, color: devColor }}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h3 className="font-heading font-bold text-sm text-white truncate">
                    {dev.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#94A3B8] block">
                    Uptime: {devUptime}
                  </span>
                </div>
              </div>

              {/* Latency Visualization Bar */}
              <div className="space-y-1 pt-2 border-t border-white/10">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#94A3B8]">Latency Response:</span>
                  <span className="font-bold" style={{ color: latencyColor }}>
                    {devLatency}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (latencyNum / 150) * 100)}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: latencyColor }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
