'use client';

import React from 'react';
import { RiskZoneType } from '../types';
import { SimulationScenario } from '../models/SimulatedYoloModel';
import { Cpu, Camera, Film, Grid, Square, LayoutGrid, ShieldAlert, Sparkles, Filter } from 'lucide-react';

export type GridLayoutMode = '1x1' | '2x2' | '4x4';

interface CameraToolbarProps {
  isAIActive: boolean;
  onToggleAI: () => void;
  scenario: SimulationScenario;
  onSelectScenario: (scenario: SimulationScenario) => void;
  selectedZone: RiskZoneType | 'All';
  onSelectZone: (zone: RiskZoneType | 'All') => void;
  layoutMode: GridLayoutMode;
  onSelectLayoutMode: (mode: GridLayoutMode) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  onCaptureSnapshot: () => void;
}

const SCENARIOS: SimulationScenario[] = [
  'Normal Surveillance',
  'Critical Fire & Smoke',
  'Person Fallen (Medical)',
  'Intrusion & Weapon Alert',
  'Water Flooding Leak',
  'VOC Gas Vapor Leak',
  'Random Multi-Object Activity',
];

const ZONES: (RiskZoneType | 'All')[] = [
  'All',
  'Entrance',
  'Restricted Area',
  'Factory Floor',
  'Warehouse',
  'Kitchen',
  'Balcony',
  'Garage',
  'Bedroom',
];

export function CameraToolbar({
  isAIActive,
  onToggleAI,
  scenario,
  onSelectScenario,
  selectedZone,
  onSelectZone,
  layoutMode,
  onSelectLayoutMode,
  isRecording,
  onToggleRecording,
  onCaptureSnapshot,
}: CameraToolbarProps) {
  return (
    <div className="p-4 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 select-none">
      {/* Left: AI Toggle & Simulation Scenario Switcher */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onToggleAI}
          className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            isAIActive
              ? 'bg-[#22C55E]/20 border-[#22C55E]/60 text-[#22C55E] shadow-lg shadow-[#22C55E]/20'
              : 'bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10'
          }`}
        >
          <Cpu className="w-4 h-4 animate-spin-slow" />
          <span>AI ENGINE: {isAIActive ? 'ACTIVE (YOLOv8)' : 'BYPASSED'}</span>
        </button>

        {/* Simulation Scenario Selector */}
        <div className="flex items-center gap-2 bg-[#020617] px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
          <Sparkles className="w-4 h-4 text-[#22D3EE] shrink-0" />
          <span className="text-[#94A3B8] hidden sm:inline">Scenario:</span>
          <select
            value={scenario}
            onChange={(e) => onSelectScenario(e.target.value as SimulationScenario)}
            className="bg-transparent text-white font-bold outline-none cursor-pointer pr-2"
          >
            {SCENARIOS.map((sc) => (
              <option key={sc} value={sc} className="bg-[#020617] text-white">
                {sc}
              </option>
            ))}
          </select>
        </div>

        {/* Zone Filter Dropdown */}
        <div className="flex items-center gap-2 bg-[#020617] px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
          <Filter className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <span className="text-[#94A3B8] hidden sm:inline">Zone:</span>
          <select
            value={selectedZone}
            onChange={(e) => onSelectZone(e.target.value as RiskZoneType | 'All')}
            className="bg-transparent text-white font-bold outline-none cursor-pointer pr-2"
          >
            {ZONES.map((zn) => (
              <option key={zn} value={zn} className="bg-[#020617] text-white">
                {zn === 'All' ? 'All Risk Zones' : zn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Actions & Grid Layout Switchers */}
      <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
        {/* Recording & Snapshot Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleRecording}
            className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isRecording
                ? 'bg-[#EF4444]/25 border-[#EF4444] text-[#EF4444] shadow-lg shadow-[#EF4444]/30 animate-pulse'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-[#EF4444]' : 'bg-[#94A3B8]'}`} />
            <span>{isRecording ? 'STOP REC' : 'RECORD'}</span>
          </button>

          <button
            onClick={onCaptureSnapshot}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:opacity-90 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-[#3B82F6]/30 transition-all"
            title="Capture Forensic Snapshot of Active Frame"
          >
            <Camera className="w-4 h-4" />
            <span>SNAPSHOT</span>
          </button>
        </div>

        {/* Grid Layout Switcher Pills */}
        <div className="flex items-center p-1 rounded-xl bg-[#020617] border border-white/10">
          <button
            onClick={() => onSelectLayoutMode('1x1')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
              layoutMode === '1x1' ? 'bg-[#3B82F6] text-white font-bold shadow' : 'text-[#94A3B8] hover:text-white'
            }`}
            title="Single Feed (1x1)"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1x1</span>
          </button>
          <button
            onClick={() => onSelectLayoutMode('2x2')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
              layoutMode === '2x2' ? 'bg-[#3B82F6] text-white font-bold shadow' : 'text-[#94A3B8] hover:text-white'
            }`}
            title="Quad Matrix (2x2)"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2x2</span>
          </button>
          <button
            onClick={() => onSelectLayoutMode('4x4')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
              layoutMode === '4x4' ? 'bg-[#3B82F6] text-white font-bold shadow' : 'text-[#94A3B8] hover:text-white'
            }`}
            title="Surveillance Wall (4x4)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">4x4</span>
          </button>
        </div>
      </div>
    </div>
  );
}
