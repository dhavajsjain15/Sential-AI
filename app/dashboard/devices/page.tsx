'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeviceHealthGrid } from '@/components/dashboard/DeviceHealthGrid';
import {
  Cpu,
  Plus,
  RefreshCw,
  CheckCircle2,
  X,
  Radio,
  Wifi,
  Terminal,
  ShieldCheck,
  Server,
  Zap,
  RotateCcw,
} from 'lucide-react';

interface ProvisionedNode {
  id: string;
  name: string;
  type: string;
  sector: string;
  status: 'ONLINE' | 'PROVISIONING...';
  latency: string;
  battery: string;
}

export default function DevicesPage() {
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState('ESP32-CAM Optical Vision Node');
  const [nodeSector, setNodeSector] = useState('Server Room B2');
  const [customNodes, setCustomNodes] = useState<ProvisionedNode[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[SYSTEM] MQTT Broker active at ssl://sentinel-broker.internal:8883',
    '[HEARTBEAT] 142 Edge Nodes synced via TLS 1.3 encrypted tunnels',
    '[STATUS] All ESP32 watchdog timers reporting 0 resets in 48h',
  ]);
  const [isBusy, setIsBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeName.trim()) return;

    const newNodeId = `ESP32-NODE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNode: ProvisionedNode = {
      id: newNodeId,
      name: nodeName,
      type: nodeType,
      sector: nodeSector,
      status: 'ONLINE',
      latency: `${Math.floor(8 + Math.random() * 12)}ms`,
      battery: '100% (AC Docked)',
    };

    setCustomNodes((prev) => [newNode, ...prev]);
    setConsoleLogs((prev) => [
      `[PROVISION] Successfully provisioned ${newNode.name} (${newNode.id}) via encrypted handshake in ${newNode.sector}!`,
      ...prev.slice(0, 10),
    ]);
    setIsProvisionModalOpen(false);
    setNodeName('');
    setStatusMsg(`🚀 Node provisioned: ${newNode.name} attached to mesh!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleTriggerAction = (action: string) => {
    setIsBusy(true);
    setStatusMsg(`⚡ Executing global command: ${action}...`);
    setTimeout(() => {
      setIsBusy(false);
      setConsoleLogs((prev) => [`[COMMAND EXEC] ${action} completed with 100% ACK across all nodes.`, ...prev.slice(0, 10)]);
      setStatusMsg(`✅ Completed: ${action}`);
      setTimeout(() => setStatusMsg(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-14">
      {/* 1. Header & Provisioning Trigger */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#020617] to-blue-950/40 border border-[#22C55E]/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#22C55E] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4 animate-pulse" />
            Hardware & Microservice Infrastructure
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
            Connected IoT Devices & Edge Mesh
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#94A3B8] mt-1">
            Manage physical ESP32 sensors, autonomous drone sentinels, and FastAPI microservice health
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsProvisionModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#22C55E] hover:bg-[#16A34A] text-[#020617] font-heading font-black text-xs shadow-xl shadow-[#22C55E]/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New IoT Node</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {statusMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-[#020617]/90 border border-[#22C55E]/50 text-[#22C55E] text-xs font-mono font-bold flex items-center gap-2 shadow-xl"
          >
            <Zap className="w-4 h-4 animate-bounce" />
            <span>{statusMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Remote Command Bar */}
      <div className="p-5 rounded-2xl bg-[#020617] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#22D3EE] font-bold">
          <Terminal className="w-4 h-4" />
          <span>GLOBAL HARDWARE COMMAND TRUNK:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleTriggerAction('MQTT Ping All Nodes')}
            disabled={isBusy}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition-all flex items-center gap-1.5"
          >
            <Wifi className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Ping All Nodes</span>
          </button>
          <button
            onClick={() => handleTriggerAction('Recalibrate MQ2 Gas Sensors')}
            disabled={isBusy}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Recalibrate Gas Array</span>
          </button>
          <button
            onClick={() => handleTriggerAction('Force OTA Firmware Sync')}
            disabled={isBusy}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:opacity-90 text-xs font-mono text-white font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>OTA Firmware Sync</span>
          </button>
        </div>
      </div>

      {/* 3. Custom Provisioned Nodes Table (if any created during session) */}
      {customNodes.length > 0 && (
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#22C55E]" />
              Newly Provisioned Session Edge Nodes ({customNodes.length})
            </h3>
            <span className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/15 px-2.5 py-0.5 rounded border border-[#22C55E]/30">
              ACTIVE MESH MEMBERS
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {customNodes.map((cn) => (
              <div key={cn.id} className="p-4 rounded-2xl bg-[#020617] border border-[#22C55E]/40 space-y-2 shadow-lg">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#22C55E] font-bold">{cn.status}</span>
                  <span className="text-[#94A3B8]">{cn.id}</span>
                </div>
                <h4 className="font-heading font-bold text-white text-base">{cn.name}</h4>
                <p className="text-xs text-[#94A3B8]">{cn.type} | Zone: <strong className="text-white">{cn.sector}</strong></p>
                <div className="flex justify-between items-center pt-2 border-t border-white/10 text-[11px] font-mono text-[#22D3EE]">
                  <span>Latency: {cn.latency}</span>
                  <span>Power: {cn.battery}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Core System Device Grid */}
      <DeviceHealthGrid />

      {/* 5. Live Edge Telemetry Terminal Console */}
      <div className="p-6 rounded-3xl bg-[#020617] border border-white/10 space-y-3 shadow-2xl font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-[#22D3EE] font-bold flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            LIVE EDGE TELEMETRY TERMINAL OUTPUT
          </span>
          <span className="text-[#94A3B8]">TLS 1.3 Handshake OK</span>
        </div>
        <div className="space-y-1.5 max-h-40 overflow-y-auto text-[#94A3B8]">
          {consoleLogs.map((log, idx) => (
            <div key={idx} className="leading-relaxed hover:text-white transition-colors">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* 6. Provisioning Modal */}
      <AnimatePresence>
        {isProvisionModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#020617] border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsProvisionModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#94A3B8] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#22C55E] font-bold tracking-widest uppercase block">
                  ZERO-TOUCH SECURE PROVISIONING
                </span>
                <h2 className="text-xl font-heading font-black text-white">Attach New Edge Node</h2>
                <p className="text-xs font-mono text-[#94A3B8]">
                  Generate unique cryptographic certificates and attach hardware directly to the Sentinel MQTT broker.
                </p>
              </div>

              <form onSubmit={handleProvisionSubmit} className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-white font-bold block">NODE IDENTIFIER NAME</label>
                  <input
                    type="text"
                    required
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    placeholder="e.g. Server Room B3 Thermal Guard #2"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#94A3B8] outline-none focus:border-[#22C55E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-white font-bold block">HARDWARE NODE TYPE</label>
                  <select
                    value={nodeType}
                    onChange={(e) => setNodeType(e.target.value)}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#22C55E]"
                  >
                    <option value="ESP32-CAM Optical Vision Node">ESP32-CAM Optical Vision Node (YOLOv8 Edge)</option>
                    <option value="ESP32 Multi-Sensor Array (MQ2 + DHT22)">ESP32 Multi-Sensor Array (MQ2 Gas + DHT22)</option>
                    <option value="Autonomous Drone Sentinel Unit">Autonomous Drone Sentinel Unit (GPS + LiDAR)</option>
                    <option value="Acoustic Harmonics Microphone Unit">Acoustic Harmonics Microphone Unit</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white font-bold block">DEPLOYMENT SECTOR / ROOM</label>
                  <select
                    value={nodeSector}
                    onChange={(e) => setNodeSector(e.target.value)}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#22C55E]"
                  >
                    <option value="Server Room B2 (Primary Infrastructure)">Server Room B2 (Primary Infrastructure)</option>
                    <option value="Sector Alpha (Perimeter Access Line)">Sector Alpha (Perimeter Access Line)</option>
                    <option value="Executive Atrium Sector">Executive Atrium Sector</option>
                    <option value="Industrial Factory Floor">Industrial Factory Floor</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsProvisionModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#020617] font-heading font-black flex items-center gap-2 shadow-lg shadow-[#22C55E]/30"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Provision & Attach to Mesh</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
