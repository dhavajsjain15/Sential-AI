'use client';

import React, { useState } from 'react';
import { Sliders, Shield, AlertTriangle, CheckCircle, Radio, Cpu, Bell, Users, RefreshCw, Save } from 'lucide-react';
import { GlobalConfigService, RiskThresholdConfig } from '../services/GlobalConfigService';

export function GlobalConfigTower() {
  const configService = GlobalConfigService.getInstance();
  const [thresholds, setThresholds] = useState<RiskThresholdConfig>(configService.getRiskThresholds());
  const [toggles, setToggles] = useState(configService.getMasterToggles());
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSaveThresholds = () => {
    configService.updateRiskThresholds(thresholds.lowRiskMax, thresholds.mediumRiskMax, 'Operator Tower UI');
    setSavedMessage('Threshold boundary overrides synced across Universal Risk Engine & IoT Mesh.');
    setTimeout(() => setSavedMessage(null), 4000);
  };

  const handleToggleChange = (key: keyof typeof toggles, val: boolean) => {
    configService.updateToggle(key, val, 'Operator Tower UI');
    setToggles(configService.getMasterToggles());
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6]">
              <Sliders className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-white tracking-tight">
                Global Configuration Tower & Risk Level Overrides
              </h2>
              <p className="text-xs font-mono text-[#94A3B8]">
                Fine-tune threshold boundary triggers for Universal Risk Engine classification
              </p>
            </div>
          </div>
          {savedMessage && (
            <div className="px-3 py-1.5 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] text-xs font-mono flex items-center gap-2 animate-bounce">
              <CheckCircle className="w-4 h-4" />
              <span>{savedMessage}</span>
            </div>
          )}
        </div>

        {/* Risk Threshold Sliders & Overrides Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-heading font-bold text-[#22D3EE] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4" /> Universal Risk Threshold Boundary Overrides
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Low Risk Configuration */}
            <div className="p-5 rounded-2xl bg-[#020617] border border-[#22C55E]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#22C55E]">1. Low Risk Boundary</span>
                <span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] text-xs font-mono font-bold">
                  0% — {thresholds.lowRiskMax}%
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Background telemetry only. Anomalies register on internal graphs without triggering active notifications.
              </p>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#94A3B8]">Low Max Trigger Score: {thresholds.lowRiskMax}%</label>
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={thresholds.lowRiskMax}
                  onChange={(e) => setThresholds({ ...thresholds, lowRiskMax: Number(e.target.value) })}
                  className="w-full accent-[#22C55E] cursor-pointer"
                />
              </div>
            </div>

            {/* 2. Medium Risk Configuration */}
            <div className="p-5 rounded-2xl bg-[#020617] border border-[#F59E0B]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#F59E0B]">2. Medium Risk Boundary</span>
                <span className="px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-mono font-bold">
                  {thresholds.lowRiskMax + 1}% — {thresholds.mediumRiskMax}%
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Localized warning alerts sent to immediate Property Owner/User via dashboard and SMS.
              </p>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#94A3B8]">Medium Max Trigger Score: {thresholds.mediumRiskMax}%</label>
                <input
                  type="range"
                  min={thresholds.lowRiskMax + 5}
                  max="85"
                  value={thresholds.mediumRiskMax}
                  onChange={(e) => setThresholds({ ...thresholds, mediumRiskMax: Number(e.target.value) })}
                  className="w-full accent-[#F59E0B] cursor-pointer"
                />
              </div>
            </div>

            {/* 3. High Risk Configuration */}
            <div className="p-5 rounded-2xl bg-[#020617] border border-[#EF4444]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#EF4444]">3. High Risk Boundary</span>
                <span className="px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] text-xs font-mono font-bold">
                  {thresholds.mediumRiskMax + 1}% — 100%+
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Full emergency protocols armed. Activates Gemini Intelligence triage reports and community/CAD escalation.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleSaveThresholds}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#F97316] hover:from-[#DC2626] hover:to-[#EA580C] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Save className="w-4 h-4" /> Sync Risk Overrides Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Master Integration Toggles Section */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#3B82F6]" /> Master Integration & Pipeline Arming Controls
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="p-4 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/20">
              <div>
                <span className="text-xs font-mono font-bold text-white block">Live IoT WebSockets</span>
                <span className="text-[11px] text-[#94A3B8]">Real-time mesh telemetry sync</span>
              </div>
              <input
                type="checkbox"
                checked={toggles.liveIoTWebSocketsEnabled}
                onChange={(e) => handleToggleChange('liveIoTWebSocketsEnabled', e.target.checked)}
                className="w-5 h-5 accent-[#3B82F6] rounded"
              />
            </label>

            <label className="p-4 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/20">
              <div>
                <span className="text-xs font-mono font-bold text-white block">Gemini Autonomous Triage</span>
                <span className="text-[11px] text-[#94A3B8]">Multi-modal LLM reasoning engine</span>
              </div>
              <input
                type="checkbox"
                checked={toggles.geminiAutonomousTriageEnabled}
                onChange={(e) => handleToggleChange('geminiAutonomousTriageEnabled', e.target.checked)}
                className="w-5 h-5 accent-[#3B82F6] rounded"
              />
            </label>

            <label className="p-4 rounded-2xl bg-[#020617] border border-[#EF4444]/30 flex items-center justify-between cursor-pointer hover:border-[#EF4444]/60">
              <div>
                <span className="text-xs font-mono font-bold text-[#EF4444] block">Municipal 911 CAD Trunk</span>
                <span className="text-[11px] text-[#94A3B8]">Direct dispatch trunk (Demo Safe: Unarmed)</span>
              </div>
              <input
                type="checkbox"
                checked={toggles.municipal911DispatchArmed}
                onChange={(e) => handleToggleChange('municipal911DispatchArmed', e.target.checked)}
                className="w-5 h-5 accent-[#EF4444] rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
