'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Home,
  Factory,
  GraduationCap,
  Building,
  Thermometer,
  Info,
  Activity,
  Maximize2,
  Minimize2,
  Flame,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { BUILDING_TYPES } from '@/constants';
import { ThreeDigitalTwinScene } from './ThreeDigitalTwin';
import { useEmergencyStore, IncidentData } from '@/store/useEmergencyStore';

interface RoomData {
  id: string;
  name: string;
  status: 'normal' | 'warning' | 'critical';
  temp: string;
  lastReading: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const FLOORPLANS: Record<string, RoomData[]> = {
  House: [
    { id: 'h-1', name: 'Kitchen', status: 'warning', temp: '33°C', lastReading: 'Smoke spike 0.8 ppm detected', x: 20, y: 20, width: 200, height: 140 },
    { id: 'h-2', name: 'Living Room', status: 'normal', temp: '24°C', lastReading: 'Nominal baseline across all sensors', x: 240, y: 20, width: 280, height: 140 },
    { id: 'h-3', name: 'Master Bedroom', status: 'critical', temp: '22°C', lastReading: 'Fall kinematic pattern detected', x: 20, y: 180, width: 200, height: 160 },
    { id: 'h-4', name: 'Garage', status: 'warning', temp: '42°C', lastReading: 'Thermal runaway threshold breached!', x: 240, y: 180, width: 140, height: 160 },
    { id: 'h-5', name: 'Guest Suite', status: 'normal', temp: '25°C', lastReading: 'No moisture or plumbing leaks detected', x: 400, y: 180, width: 120, height: 80 },
  ],
  Office: [
    { id: 'o-1', name: 'Server Room B2', status: 'critical', temp: '38°C', lastReading: 'HVAC failure causing rack over-temperature', x: 20, y: 20, width: 180, height: 150 },
    { id: 'o-2', name: 'Open Workspace', status: 'normal', temp: '23°C', lastReading: 'Occupancy index 64 active personnel', x: 220, y: 20, width: 300, height: 150 },
    { id: 'o-3', name: 'Conference Suite', status: 'normal', temp: '22°C', lastReading: 'CO2 levels nominal at 480 ppm', x: 20, y: 190, width: 240, height: 150 },
    { id: 'o-4', name: 'Executive Plaza', status: 'warning', temp: '27°C', lastReading: 'Window contact sensor open after hours', x: 280, y: 190, width: 240, height: 150 },
  ],
  Factory: [
    { id: 'f-1', name: 'Assembly Line 1', status: 'normal', temp: '29°C', lastReading: 'Vibration harmonics nominal at 42 Hz', x: 20, y: 20, width: 260, height: 160 },
    { id: 'f-2', name: 'Chemical Storage', status: 'warning', temp: '31°C', lastReading: 'Trace VOC vapors detected at floor level', x: 300, y: 20, width: 220, height: 160 },
    { id: 'f-3', name: 'High-Volts Grid', status: 'critical', temp: '65°C', lastReading: 'Current surge 140A over safety rated margin', x: 20, y: 200, width: 260, height: 140 },
    { id: 'f-4', name: 'Logistics Bay', status: 'normal', temp: '26°C', lastReading: 'All bay doors locked & secured', x: 300, y: 200, width: 220, height: 140 },
  ],
  School: [
    { id: 's-1', name: 'Science Lab 104', status: 'warning', temp: '28°C', lastReading: 'Gas valve sensor reporting slight pressure variance', x: 20, y: 20, width: 250, height: 150 },
    { id: 's-2', name: 'Main Auditorium', status: 'normal', temp: '22°C', lastReading: 'Acoustic monitoring clear', x: 290, y: 20, width: 230, height: 150 },
  ],
  Apartment: [
    { id: 'a-1', name: 'Penthouse 401', status: 'normal', temp: '23°C', lastReading: 'Smart lock active, biometric verified', x: 20, y: 20, width: 240, height: 150 },
    { id: 'a-2', name: 'HVAC Plant', status: 'critical', temp: '44°C', lastReading: 'Chiller pump #2 differential pressure drop', x: 280, y: 20, width: 240, height: 150 },
  ],
};

export function DigitalTwinView() {
  const [selectedType, setSelectedType] = useState<string>('House');
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const { activeIncident, triggerIncident, resolveIncident, resetCameraMacro } = useEmergencyStore();

  const rooms = FLOORPLANS[selectedType] || FLOORPLANS['House'];

  const getBuildingIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return Home;
      case 'Building2': return Building2;
      case 'Factory': return Factory;
      case 'GraduationCap': return GraduationCap;
      case 'Building': return Building;
      default: return Home;
    }
  };

  const getStatusStyles = (status: RoomData['status']) => {
    switch (status) {
      case 'critical':
        return {
          badge: 'bg-[#EF4444]/30 text-[#fca5a5] border-[#EF4444]/50',
          text: '#fca5a5',
        };
      case 'warning':
        return {
          badge: 'bg-[#F59E0B]/30 text-[#fcd34d] border-[#F59E0B]/50',
          text: '#fcd34d',
        };
      default:
        return {
          badge: 'bg-[#22C55E]/20 text-[#86efac] border-[#22C55E]/50',
          text: '#86efac',
        };
    }
  };

  // Predefined Test Incidents for Demo Controls
  const demoIncidents: IncidentData[] = [
    {
      id: 'INC-FALL-BEDROOM',
      zoneId: 'h-3',
      zoneName: 'Master Bedroom',
      eventType: 'Possible Fall Detected',
      severity: 'CRITICAL',
      confidence: 94,
      personStatus: 'Stationary (38s) / Horizontal Posture',
      verificationStatus: 'Awaiting Voice Response',
      escalationTier: 'Tier 2 — Paramedic Dispatch (tel:102)',
      position: [1, 0, -6],
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 'INC-SERVER-OVERHEAT',
      zoneId: 'o-1',
      zoneName: 'Server Room B2',
      eventType: 'HVAC Overheat Surge',
      severity: 'CRITICAL',
      confidence: 98,
      personStatus: 'Unoccupied / Thermal Runaway',
      verificationStatus: 'Fire Suppression Armed',
      escalationTier: 'Tier 1 — Facility Manager & Fire Dispatch (tel:101)',
      position: [-10, 0, -5],
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 'INC-HIGH-VOLTS',
      zoneId: 'f-3',
      zoneName: 'High-Volts Grid',
      eventType: 'Current Surge 140A Overload',
      severity: 'HIGH',
      confidence: 92,
      personStatus: 'Maintenance Required',
      verificationStatus: 'Breaker Tripped',
      escalationTier: 'Tier 3 — Electrical Grid Safety Unit',
      position: [-8, 0, 5],
      timestamp: new Date().toLocaleTimeString(),
    },
  ];

  return (
    <>
      <div className="p-6 rounded-3xl bg-gradient-to-b from-white/5 to-black/20 backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
        {/* Header & Controls Bar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-heading font-black text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#22D3EE]" />
              Active Incident Command Center 3D Matrix
            </h2>
            <p className="text-xs font-mono text-[#22D3EE]/80 mt-1 uppercase tracking-widest">
              Live Incident Synchronization & Dynamic Camera Focusing
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Building Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#020617]/80 border border-white/10 shadow-inner">
              {BUILDING_TYPES.map((b) => {
                const IconComp = getBuildingIcon(b.icon);
                const isSelected = selectedType === b.name;

                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedType(b.name);
                      setSelectedRoom(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105'
                        : 'text-[#94A3B8] hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    {b.name}
                  </button>
                );
              })}
            </div>

            {/* Reset Camera / Macro View Button */}
            <button
              onClick={() => resetCameraMacro()}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center gap-2 text-xs font-mono font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4 text-[#38bdf8]" />
              <span>MACRO VIEW</span>
            </button>

            {/* Fullscreen Mode Toggle */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2.5 rounded-2xl bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 border border-[#3B82F6]/50 text-[#38bdf8] flex items-center gap-2 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)]"
            >
              <Maximize2 className="w-4 h-4" />
              <span>FULL SCREEN</span>
            </button>
          </div>
        </div>

        {/* Demo Incident Trigger Bar */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <span className="text-white/70 font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            SIMULATE INCIDENTS:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {demoIncidents.map((inc) => (
              <button
                key={inc.id}
                onClick={() => {
                  if (inc.zoneId.startsWith('h')) setSelectedType('House');
                  if (inc.zoneId.startsWith('o')) setSelectedType('Office');
                  if (inc.zoneId.startsWith('f')) setSelectedType('Factory');
                  triggerIncident(inc);
                }}
                className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
                  activeIncident?.id === inc.id
                    ? 'bg-red-600 text-white border-red-400 shadow-md shadow-red-500/50 scale-105'
                    : 'bg-red-950/40 hover:bg-red-900/60 border-red-500/50 text-red-300'
                }`}
              >
                🔴 {inc.eventType} [{inc.zoneName}]
              </button>
            ))}

            {activeIncident && (
              <button
                onClick={() => resolveIncident()}
                className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/60 text-emerald-300 font-bold transition-all"
              >
                ✅ RESOLVE INCIDENT
              </button>
            )}
          </div>
        </div>

        {/* 3D Holographic Canvas & Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* True WebGL 3D Incident Scene Area */}
          <div className="xl:col-span-2 rounded-3xl bg-[#020617] border border-white/10 relative overflow-hidden flex items-center justify-center min-h-[680px] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-10">
            <ThreeDigitalTwinScene
              activeType={selectedType}
              rooms={rooms}
              selectedRoomId={selectedRoom?.id}
              onSelectRoom={(room) => setSelectedRoom(room)}
            />

            {/* Bottom HUD Legend */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between px-4 py-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 text-[11px] font-mono shadow-2xl z-20 pointer-events-none">
              <span className="text-[#22D3EE] font-bold">
                INCIDENT STATE: {activeIncident ? `ACTIVE [${activeIncident.zoneName}]` : 'NOMINAL BASELINE'}
              </span>
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-2 text-[#86efac]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" /> Normal
                </span>
                <span className="flex items-center gap-2 text-[#fca5a5]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" /> Active Alert
                </span>
              </div>
            </div>
          </div>

          {/* Selected Room Details / Command Inspector Sidebar */}
          <div className="xl:col-span-1 rounded-3xl bg-black/40 border border-white/10 p-6 shadow-2xl relative overflow-hidden min-h-[680px] flex flex-col z-20">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
              <span className="text-sm font-heading font-black text-[#22D3EE] uppercase tracking-widest flex items-center gap-2">
                COMMAND INSPECTOR
              </span>
              <Info className="w-5 h-5 text-[#3B82F6]" />
            </div>

            <div className="flex-1 relative z-10 pt-6">
              <AnimatePresence mode="wait">
                {activeIncident ? (
                  <motion.div
                    key={activeIncident.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex flex-col gap-2">
                        <span className="self-start px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-widest bg-red-950 text-red-300 border border-red-500">
                          🔴 ACTIVE {activeIncident.severity} EMERGENCY
                        </span>
                        <h3 className="text-2xl font-heading font-black text-white leading-tight mt-1">
                          {activeIncident.eventType}
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-white/50 block mt-2">
                        Location: {activeIncident.zoneName} [{activeIncident.zoneId.toUpperCase()}]
                      </span>
                    </div>

                    {/* Active Incident Live Telemetry Panel */}
                    <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/60 space-y-3 shadow-inner text-xs font-mono text-white">
                      <div className="flex justify-between border-b border-red-500/30 pb-1.5">
                        <span className="text-red-200/70">Confidence Certainty:</span>
                        <span className="text-emerald-400 font-bold">{activeIncident.confidence}%</span>
                      </div>
                      <div className="flex justify-between border-b border-red-500/30 pb-1.5">
                        <span className="text-red-200/70">Person Status:</span>
                        <span className="text-amber-300 font-bold">{activeIncident.personStatus}</span>
                      </div>
                      <div className="flex justify-between border-b border-red-500/30 pb-1.5">
                        <span className="text-red-200/70">Verification Protocol:</span>
                        <span className="text-cyan-300 font-bold">{activeIncident.verificationStatus}</span>
                      </div>
                      <div className="flex justify-between pt-0.5">
                        <span className="text-red-200/70">Escalation Channel:</span>
                        <span className="text-rose-300 font-bold">{activeIncident.escalationTier}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href="tel:102"
                        className="flex-1 py-3 text-center rounded-2xl bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                      >
                        DISPATCH 102
                      </a>
                      <button
                        onClick={() => resolveIncident()}
                        className="flex-1 py-3 rounded-2xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-heading font-bold text-xs tracking-wide transition-all"
                      >
                        RESOLVE INCIDENT
                      </button>
                    </div>
                  </motion.div>
                ) : selectedRoom ? (
                  <motion.div
                    key={selectedRoom.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <span
                        className={`self-start px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-widest ${
                          getStatusStyles(selectedRoom.status).badge
                        }`}
                      >
                        {selectedRoom.status} STATUS
                      </span>
                      <h3 className="text-2xl font-heading font-black text-white leading-tight mt-1">
                        {selectedRoom.name}
                      </h3>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#020617] border border-white/10 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-[#3B82F6] uppercase">
                        Live Sensor Inference
                      </span>
                      <p className="text-sm text-white/90 font-mono leading-relaxed">
                        {selectedRoom.lastReading}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4 pb-12"
                  >
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-white/40">
                      <Activity className="w-8 h-8 animate-pulse" />
                    </div>
                    <p className="text-xs font-mono text-white/50 max-w-[220px] leading-relaxed">
                      All systems operating within nominal baseline parameters. Click a test incident above to trigger response.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN HOLOGRAPHIC OVERLAY MODAL */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-[100] bg-[#020617] p-6 flex flex-col space-y-4"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-[#22D3EE] animate-pulse" />
                <h2 className="text-2xl font-heading font-black text-white tracking-wide">
                  FULL SCREEN INCIDENT COMMAND CENTER — {selectedType.toUpperCase()}
                </h2>
              </div>

              <button
                onClick={() => setIsFullscreen(false)}
                className="p-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-mono font-bold transition-all flex items-center gap-2"
              >
                <Minimize2 className="w-5 h-5" />
                <span>EXIT FULL SCREEN</span>
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 items-stretch relative overflow-hidden">
              <div className="xl:col-span-3 rounded-3xl bg-[#020617] border-2 border-[#22D3EE]/30 relative overflow-hidden flex items-center justify-center">
                <ThreeDigitalTwinScene
                  activeType={selectedType}
                  rooms={rooms}
                  selectedRoomId={selectedRoom?.id}
                  onSelectRoom={(room) => setSelectedRoom(room)}
                />
              </div>

              <div className="xl:col-span-1 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl flex flex-col justify-between">
                <div className="space-y-6">
                  <h3 className="text-[#22D3EE] font-mono font-bold text-sm">FULL SCREEN COMMAND HUD</h3>
                  {activeIncident && (
                    <div className="p-4 rounded-2xl bg-red-950 border border-red-500 text-xs font-mono space-y-2">
                      <p className="text-red-300 font-bold">{activeIncident.eventType}</p>
                      <p className="text-white/80">Location: {activeIncident.zoneName}</p>
                      <p className="text-emerald-400">Confidence: {activeIncident.confidence}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
