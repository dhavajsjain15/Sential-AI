'use client';

import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Cpu, Brain, Radio, Database, ShieldCheck, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col pt-24">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-20">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#22D3EE] text-xs font-mono font-semibold uppercase">
            <Cpu className="w-4 h-4 animate-pulse" />
            Palantir & DeepMind Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight">
            Universal Risk Pipeline
          </h1>
          <p className="text-base font-sans text-[#94A3B8] leading-relaxed">
            A comprehensive breakdown of how our hardware edge sensors, local YOLO inference, FastAPI backend, and Gemini 1.5 Pro reasoning engine operate in harmony.
          </p>
        </div>

        {/* Deep Dive Architecture Layers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-[#22D3EE]">LAYER 1: HARDWARE & EDGE NODES</span>
              <Radio className="w-5 h-5 text-[#22D3EE]" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">ESP32 & Jetson Orin Edge Inference</h3>
            <p className="text-xs font-sans text-[#94A3B8] leading-relaxed">
              Equipped with thermal FLIR optics, acoustic microphones, and VOC gas sensors, our local edge nodes execute YOLOv8 bounding box detection at 30 FPS without cloud bandwidth latency.
            </p>
            <div className="pt-2 space-y-2 text-xs font-mono text-white/80">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> ONVIF & RTSP CCTV Stream Ingestion</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Local MediaPipe Pose & Fall Detection</div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-[#8B5CF6]">LAYER 2: SENSOR FUSION & EVIDENCE GRAPH</span>
              <Layers className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">Bayesian Causal Node Throttling</h3>
            <p className="text-xs font-sans text-[#94A3B8] leading-relaxed">
              When an optical anomaly occurs, the engine queries ambient room temperature and CO2 differentials. If uncorrelated, the alert is marked as low probability, preventing costly false evacuations.
            </p>
            <div className="pt-2 space-y-2 text-xs font-mono text-white/80">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> 99.98% False Alarm Rejection Rate</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Real-Time Telemetry Ledgers</div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-[#3B82F6]">LAYER 3: EXPLAINABLE AI REASONING</span>
              <Brain className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">Gemini 1.5 Pro Telemetry Synthesis</h3>
            <p className="text-xs font-sans text-[#94A3B8] leading-relaxed">
              Instead of binary alarms, Gemini generates natural language causal explanations: detailing who is in danger, what exact thresholds were breached, and what specific steps to execute.
            </p>
            <div className="pt-2 space-y-2 text-xs font-mono text-white/80">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Automated Forensics PDF Generation</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Multi-Turn JARVIS Co-Pilot Dialogue</div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-[#22C55E]">LAYER 4: BACKEND INFRASTRUCTURE</span>
              <Database className="w-5 h-5 text-[#22C55E]" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">Firebase & FastAPI Microservices</h3>
            <p className="text-xs font-sans text-[#94A3B8] leading-relaxed">
              Next.js 15 Client interfaces with Firebase Authentication, Firestore real-time listeners, and Cloud Storage while FastAPI microservices handle autonomous actuator control.
            </p>
            <div className="pt-2 space-y-2 text-xs font-mono text-white/80">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Firebase Cloud Messaging (FCM) Dispatches</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Immutable Cryptographic Audit Trails</div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
