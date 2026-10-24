'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Sparkles, ArrowRight, Menu } from 'lucide-react';

export function PublicNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/10 z-50 flex items-center justify-between px-6 lg:px-12">
      {/* Animated Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3B82F6] via-[#22D3EE] to-[#8B5CF6] p-0.5 flex items-center justify-center shadow-xl shadow-[#3B82F6]/30 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-[#020617] rounded-[14px] flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#22D3EE] animate-pulse" />
          </div>
        </div>
        <div>
          <span className="font-heading text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-[#22D3EE] bg-clip-text text-transparent">
            SENTINEL <span className="text-[#3B82F6]">AI</span>
          </span>
          <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 uppercase font-semibold tracking-wider">
            JARVIS v2.4
          </span>
        </div>
      </Link>

      {/* Center Nav Links */}
      <div className="hidden md:flex items-center gap-6 text-sm font-heading font-medium text-[#94A3B8]">
        <Link href="/features" className="hover:text-white transition-colors">Features</Link>
        <Link href="/technology" className="hover:text-white transition-colors">AI Architecture</Link>
        <Link href="/gallery-heading" className="hover:text-rose-400 text-rose-300/90 transition-colors flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Text Animation</span>
        </Link>
        <Link href="/kage" className="hover:text-amber-400 text-amber-300/90 transition-colors">Kage 3D</Link>
        <Link href="/about" className="hover:text-white transition-colors">About</Link>
        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="hidden sm:inline-flex px-4 py-2.5 rounded-xl text-xs font-heading font-semibold text-white/90 hover:text-white hover:bg-white/5 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#8B5CF6] hover:opacity-90 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#3B82F6]/30 transition-all group"
        >
          <span>Launch Command Center</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </nav>
  );
}
