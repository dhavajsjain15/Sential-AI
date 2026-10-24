'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import {
  Shield,
  Sparkles,
  ArrowRight,
  Activity,
  Radio,
  Brain,
  Zap,
  CheckCircle2,
  Lock,
  Cpu,
  Eye,
  ChevronRight,
  Flame,
  ShieldAlert,
  Wind,
  HeartPulse,
} from 'lucide-react';

export default function LandingPage() {
  const stats = [
    { value: '14.2 ms', label: 'Average AI Telemetry Inference Latency' },
    { value: '99.98%', label: 'Sensor Fusion & Threat Classification Accuracy' },
    { value: '12 / 12', label: 'Monitored Universal Hazard Typologies' },
    { value: '0 False', label: 'Alarm Throttling via Evidence Graph Synthesis' },
  ];

  const faqs = [
    {
      q: 'Is Sentinel AI a standard smart home or fire alarm dashboard?',
      a: 'No. Sentinel AI is the world\'s first Universal Risk Intelligence Platform. Unlike basic IoT dashboards that trigger simple thresholds, Sentinel AI fuses YOLOv8 edge vision, MediaPipe pose tracking, acoustic signatures, and physical sensor arrays into a unified Bayesian Evidence Graph to predict and autonomously isolate threats before catastrophic failure.',
    },
    {
      q: 'How does the Explainable AI (XAI) engine work?',
      a: 'Instead of sending opaque alerts like "Fire Detected", our XAI engine constructs a causal narrative: "Critical Fire | Confidence 97% | Evidence: Smoke (0.8 ppm) + Rapid Thermal Rise (+18°C/min) + VOC Gas Leak + 2 Personnel inside Server Room B2." This enables 911/EMS dispatchers to act with exact precision.',
    },
    {
      q: 'Can Sentinel AI integrate with existing CCTV cameras and building HVAC systems?',
      a: 'Yes. Our edge nodes support RTSP/ONVIF video streams and standard BACnet/Modbus/MQTT IoT protocols. Our FastAPI microservice layer directly throttles power racks and HVAC chillers upon thermal runaway detection.',
    },
    {
      q: 'What backend architecture powers Sentinel AI?',
      a: 'Sentinel AI relies on Next.js 15 App Router, Firebase Authentication (with Role-Based Access Control for Emergency Operators), Firestore real-time listeners, Firebase Cloud Storage for high-res forensic snapshots, and deep integration with Google DeepMind Gemini 1.5 Pro for telemetry synthesis.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-x-hidden selection:bg-[#3B82F6] selection:text-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 lg:px-12 flex flex-col items-center text-center overflow-hidden">
        {/* Floating Background Orbs & Cyber Grid */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#3B82F6]/20 via-[#8B5CF6]/20 to-[#22D3EE]/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#22D3EE] text-xs font-mono font-semibold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>TESLA / PALANTIR / JARVIS AI COMMAND CENTER v2.4</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[1.08]">
            Predict. Detect. Analyze.{' '}
            <span className="bg-gradient-to-r from-[#3B82F6] via-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
              Respond. Save Lives.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[#94A3B8] font-sans max-w-3xl mx-auto leading-relaxed">
            Sentinel AI is the world's first <strong className="text-white">Universal Risk Intelligence Platform</strong> that combines AI Edge Vision, Sensor Fusion, Explainable AI, Predictive Analytics, and Autonomous Emergency Containment.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#8B5CF6] hover:opacity-95 text-white font-heading font-bold text-base flex items-center justify-center gap-3 shadow-2xl shadow-[#3B82F6]/40 transition-all group"
            >
              <span>Launch AI Command Center</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link
              href="/gallery-heading"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-heading font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
            >
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span>ThreeUI Text Animation</span>
            </Link>

            <Link
              href="/features"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-heading font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Threat Vectors</span>
              <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
            </Link>
          </div>
        </motion.div>

        {/* Hero Interactive Dashboard Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-6xl mx-auto mt-16 rounded-3xl bg-white/5 p-3 border border-white/10 shadow-[0_0_80px_rgba(59,130,246,0.15)] backdrop-blur-2xl"
        >
          <div className="rounded-2xl bg-[#020617] border border-white/10 p-6 overflow-hidden space-y-6 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                <span className="ml-2 text-xs font-mono text-[#94A3B8]">JARVIS CO-PILOT HUD — REAL-TIME TELEMETRY</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#22C55E]/20 text-[#22C55E] font-mono text-xs font-bold animate-pulse">
                DEFCON 5 — ALL NODES SECURE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs text-[#94A3B8]">
                  <span>GLOBAL RISK INDEX</span>
                  <ShieldAlert className="w-4 h-4 text-[#22C55E]" />
                </div>
                <div className="text-3xl font-mono font-black text-white">34%</div>
                <span className="text-[10px] font-mono text-[#22C55E]">↓ 12% WEEKLY TREND IMPROVEMENT</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs text-[#94A3B8]">
                  <span>EDGE VISION INFERENCE</span>
                  <Eye className="w-4 h-4 text-[#22D3EE]" />
                </div>
                <div className="text-3xl font-mono font-black text-white">30 FPS</div>
                <span className="text-[10px] font-mono text-[#22D3EE]">YOLOv8 + MEDIAPIPE POSE ACTIVE</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs text-[#94A3B8]">
                  <span>IOT SENSOR GRID</span>
                  <Radio className="w-4 h-4 text-[#8B5CF6]" />
                </div>
                <div className="text-3xl font-mono font-black text-white">142/156</div>
                <span className="text-[10px] font-mono text-[#8B5CF6]">MULTI-MODAL SENSOR FUSION</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 space-y-2">
                <div className="flex justify-between items-center text-xs text-[#22D3EE] font-bold">
                  <span>AI REASONING</span>
                  <Brain className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div className="text-xl font-heading font-bold text-white truncate">Gemini 1.5 Pro</div>
                <span className="text-[10px] font-mono text-[#22C55E]">BAYESIAN EVIDENCE GRAPH SYNCED</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-6 lg:px-12 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((st, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#020617]/80 border border-white/10 text-center space-y-2">
              <div className="text-3xl md:text-4xl font-mono font-black text-[#22D3EE] tracking-tight">{st.value}</div>
              <div className="text-xs font-sans text-[#94A3B8] leading-snug">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture & AI Pipeline Section */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#3B82F6]">
            END-TO-END AUTONOMOUS PIPELINE
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight">
            How Sentinel AI Understands Any Threat
          </h2>
          <p className="text-sm font-sans text-[#94A3B8]">
            We replace isolated sensors with a continuous 14-stage Bayesian AI pipeline that synthesizes physical vision, acoustic harmonics, and IoT telemetry in real time.
          </p>
        </div>

        {/* Pipeline Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs font-mono">
          {[
            { step: '01', title: 'RTSP CCTV', sub: 'Camera Input' },
            { step: '02', title: 'YOLOv8 Edge', sub: 'Object Bounding' },
            { step: '03', title: 'MediaPipe', sub: 'Pose & Fall Check' },
            { step: '04', title: 'BACnet / IoT', sub: 'Sensor Fusion' },
            { step: '05', title: 'Evidence Graph', sub: 'Causal Nodes' },
            { step: '06', title: 'Risk Engine', sub: '0-100% Score' },
            { step: '07', title: 'Gemini 1.5 Pro', sub: 'XAI Summary' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3B82F6]/50 transition-colors space-y-2 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-[#22D3EE]">STEP {item.step}</span>
              <span className="font-heading font-bold text-white text-sm block">{item.title}</span>
              <span className="text-[10px] text-[#94A3B8]">{item.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 lg:px-12 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#22D3EE]">
            TECHNICAL ARCHITECTURE DISCLOSURES
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-heading font-bold text-base text-white">{faq.q}</h3>
              <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
