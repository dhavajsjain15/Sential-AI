'use client';

import React, { useState } from 'react';
import { Settings, Shield, Bell, Lock, Cpu, Save, CheckCircle2 } from 'lucide-react';
import { GlobalConfigTower } from '@/admin/components/GlobalConfigTower';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [autoContain, setAutoContain] = useState(true);
  const [fcmPush, setFcmPush] = useState(true);
  const [aiSensitivity, setAiSensitivity] = useState(85);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-14 max-w-6xl">
      {/* 1. Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#020617] to-purple-950/40 border border-[#3B82F6]/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-[#3B82F6] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4 animate-spin-slow" />
            System & Risk Level Overrides
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
            Platform Configuration & Risk Boundaries
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#94A3B8] mt-1">
            Explicitly manage and fine-tune threshold triggers for Low, Medium, and High-risk level boundaries
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#8B5CF6] hover:opacity-95 text-white font-heading font-bold text-xs shadow-xl shadow-[#3B82F6]/30 transition-all active:scale-95"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Parameters Saved!' : 'Save System Parameters'}</span>
        </button>
      </div>

      {/* 2. Global Risk Configuration Tower (Low, Medium, High Overrides) */}
      <GlobalConfigTower />

      {/* 3. AI Edge & Notification Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 shadow-xl">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#22D3EE]" />
            AI Edge Vision & Sensor Sensitivity
          </h3>
          <div className="space-y-4 pt-2 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[#94A3B8]">YOLO & MediaPipe Confidence Threshold</span>
                <span className="text-[#22D3EE] font-bold">{aiSensitivity}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={aiSensitivity}
                onChange={(e) => setAiSensitivity(Number(e.target.value))}
                className="w-full accent-[#3B82F6] bg-white/10 rounded-lg h-2 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#020617] border border-white/10">
              <div>
                <span className="text-white font-bold block">Autonomous HVAC Containment</span>
                <span className="text-[#94A3B8] text-[10px]">Throttle chillers automatically at &gt;85°F</span>
              </div>
              <input
                type="checkbox"
                checked={autoContain}
                onChange={(e) => setAutoContain(e.target.checked)}
                className="w-5 h-5 accent-[#3B82F6] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 shadow-xl">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#F59E0B]" />
            Push Notification Channels
          </h3>
          <div className="space-y-4 pt-2 font-mono text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#020617] border border-white/10">
              <div>
                <span className="text-white font-bold block">Firebase Cloud Messaging (FCM)</span>
                <span className="text-[#94A3B8] text-[10px]">High-priority push to mobile dispatchers</span>
              </div>
              <input
                type="checkbox"
                checked={fcmPush}
                onChange={(e) => setFcmPush(e.target.checked)}
                className="w-5 h-5 accent-[#F59E0B] rounded cursor-pointer"
              />
            </div>
            <div className="p-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-between">
              <span>Audit Log Encryption Level:</span>
              <strong className="font-bold">AES-256 / SHA256 OK</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
