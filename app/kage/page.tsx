'use client';

import React from 'react';
import Link from 'next/link';
import { KageExperience } from '@/components/landing/KageExperience';
import { ArrowLeft, Shield } from 'lucide-react';

export default function KagePage() {
  return (
    <main className="relative w-full h-screen bg-[#080808] overflow-hidden">
      {/* Floating HUD Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-2xl bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-xl text-xs font-mono font-bold flex items-center gap-2 shadow-2xl transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 text-[#22D3EE]" />
          Return to Sentinel AI Dashboard
        </Link>
      </div>

      {/* Authored Kage Experience */}
      <KageExperience />
    </main>
  );
}
