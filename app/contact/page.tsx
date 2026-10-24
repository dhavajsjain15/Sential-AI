'use client';

import React, { useState } from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col pt-24">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#3B82F6]">ENTERPRISE DEPLOYMENT</span>
            <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight mt-1">
              Connect With Mission Control
            </h1>
            <p className="text-xs font-sans text-[#94A3B8] leading-relaxed mt-2">
              Request a live demonstration of Sentinel AI at your facility or speak with our solutions engineering team regarding custom hardware sensor integrations.
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <Mail className="w-5 h-5 text-[#22D3EE]" />
              <span>enterprise-deployments@sentinel-ai.com</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <Phone className="w-5 h-5 text-[#22C55E]" />
              <span>+1 (800) 555-SENTINEL (Emergency Ops Line)</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <MapPin className="w-5 h-5 text-[#8B5CF6]" />
              <span>Sentinel Mission Control — Silicon Valley HQ, CA</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto animate-bounce" />
              <h3 className="font-heading font-bold text-xl text-white">Transmission Received</h3>
              <p className="text-xs font-sans text-[#94A3B8] max-w-xs mx-auto leading-relaxed">
                Our solutions architecture team has dispatched your inquiry to a dedicated deployment specialist. Expect contact within 4 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <h3 className="font-heading font-bold text-lg text-white mb-4">Request Enterprise Assessment</h3>
              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1">Full Name / Rank</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Commander Sarah Vance"
                  className="w-full bg-[#020617] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1">Enterprise Email</label>
                <input
                  required
                  type="email"
                  placeholder="s.vance@defense-grid.org"
                  className="w-full bg-[#020617] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1">Facility Type & Scope</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your facility (e.g., Data Center, 4 floors, 120 edge cameras, critical thermal monitoring needed)..."
                  className="w-full bg-[#020617] border border-white/10 focus:border-[#3B82F6] rounded-xl p-4 text-xs text-white outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#8B5CF6] hover:opacity-90 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#3B82F6]/30 transition-all"
              >
                <span>Transmit Assessment Request</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
