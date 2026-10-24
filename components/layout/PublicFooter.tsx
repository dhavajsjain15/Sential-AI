'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Heart } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-[#020617] border-t border-white/10 pt-16 pb-12 px-6 lg:px-12 text-xs text-[#94A3B8]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#020617] rounded-[10px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#22D3EE]" />
              </div>
            </div>
            <span className="font-heading font-bold text-lg text-white tracking-tight">SENTINEL AI</span>
          </div>
          <p className="font-sans text-[#94A3B8] leading-relaxed">
            The world's first AI-Powered Universal Risk Intelligence Platform combining YOLOv8 vision, IoT sensor fusion, explainable AI, and autonomous emergency containment.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-heading font-bold text-white uppercase text-[11px] tracking-wider">Universal AI Modules</h4>
          <ul className="space-y-2 font-sans">
            <li><Link href="/dashboard/risk-intelligence" className="hover:text-white transition-colors">12-Layer Risk Engine</Link></li>
            <li><Link href="/dashboard/live-monitoring" className="hover:text-white transition-colors">Real-Time CCTV & YOLO</Link></li>
            <li><Link href="/dashboard/incidents" className="hover:text-white transition-colors">Incident Forensics & SLA</Link></li>
            <li><Link href="/dashboard/emergency-replay" className="hover:text-white transition-colors">5-Phase Replay Simulator</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-heading font-bold text-white uppercase text-[11px] tracking-wider">Technology Stack</h4>
          <ul className="space-y-2 font-sans">
            <li><span className="hover:text-white cursor-pointer">Next.js 15 & React 19 Client Architecture</span></li>
            <li><span className="hover:text-white cursor-pointer">Firebase Auth, Firestore & Cloud Storage</span></li>
            <li><span className="hover:text-white cursor-pointer">FastAPI Microservice Integration Layer</span></li>
            <li><span className="hover:text-white cursor-pointer">DeepMind Gemini 1.5 Pro Telemetry Engine</span></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-heading font-bold text-white uppercase text-[11px] tracking-wider">Security & Compliance</h4>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#22C55E]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              DEFCON 5 SECURE AUDIT
            </div>
            <p className="text-[11px] leading-tight">All telemetry is encrypted end-to-end and stored with immutable SHA-256 cryptographic hashes.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono">
        <span>© 2026 Sentinel AI Inc. All rights reserved. Designed with Tesla & Palantir precision.</span>
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-white">Privacy Policy</Link>
          <Link href="/about" className="hover:text-white">Terms of Service</Link>
          <Link href="/contact" className="hover:text-white">Security Disclosures</Link>
        </div>
      </div>
    </footer>
  );
}
