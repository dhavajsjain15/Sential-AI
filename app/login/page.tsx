'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/firebase/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@sentinel-ai.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signInWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signInWithEmail(email, password);
    setLoading(false);
    router.push('/dashboard');
  };

  const handleDemoLaunch = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-[#020617] rounded-[14px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#22D3EE]" />
            </div>
          </div>
          <span className="font-heading font-black text-2xl tracking-tight">SENTINEL AI</span>
        </Link>

        <div>
          <h2 className="font-heading font-bold text-xl text-white">Operator Command Authentication</h2>
          <p className="text-xs font-mono text-[#94A3B8] mt-1">Enter your enterprise credentials or launch directly in Demo Mode</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1">Operator ID / Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#020617] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-3 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1">Cryptographic Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#020617] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-3 text-xs text-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:opacity-95 disabled:opacity-50 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#3B82F6]/30 transition-all"
          >
            <span>{loading ? 'Verifying MFA Token...' : 'Authenticate & Launch'}</span>
            <Lock className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-[#94A3B8] text-[10px] font-mono uppercase">OR</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button
          onClick={handleDemoLaunch}
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-heading font-semibold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <span>Instant Launch Demo Mode (Bypass Auth)</span>
          <ArrowRight className="w-4 h-4 text-[#22D3EE]" />
        </button>

        <p className="text-[11px] font-sans text-[#94A3B8]">
          Need DEFCON 1 clearance? <Link href="/signup" className="text-[#3B82F6] hover:underline font-bold">Request Operator Access</Link>
        </p>
      </div>
    </div>
  );
}
