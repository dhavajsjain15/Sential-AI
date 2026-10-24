'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="p-4 rounded-3xl bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] w-fit mx-auto animate-bounce">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-6xl font-mono font-black text-white">404</h1>
          <h2 className="text-xl font-heading font-bold text-[#22D3EE] mt-2 uppercase tracking-wider">
            Sector Not Found / Access Restricted
          </h2>
          <p className="text-xs font-sans text-[#94A3B8] mt-3 leading-relaxed">
            The telemetry endpoint or sector coordinates you requested do not exist in the current AI Mission Control map.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-heading font-bold text-xs shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Command Center
        </Link>
      </div>
    </div>
  );
}
