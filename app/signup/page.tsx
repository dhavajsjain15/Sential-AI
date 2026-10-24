'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, UserPlus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/firebase/AuthContext';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUpWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signUpWithEmail(email, password, name);
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-[#020617] rounded-[14px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#22D3EE]" />
            </div>
          </div>
          <span className="font-heading font-black text-2xl tracking-tight">SENTINEL AI</span>
        </Link>

        <div>
          <h2 className="font-heading font-bold text-xl text-white">Operator Access Registration</h2>
          <p className="text-xs font-mono text-[#94A3B8] mt-1">Provision a new cryptographic identity for Mission Control</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1">Operator Full Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Lieutenant Marcus Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#020617] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-3 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1">Enterprise Email Address</label>
            <input
              required
              type="email"
              placeholder="m.vance@sentinel-ai.enterprise"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#020617] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-3 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1">Create Secure Password (SHA-256 Auth)</label>
            <input
              required
              type="password"
              placeholder="••••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#020617] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-3 text-xs text-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#8B5CF6] hover:opacity-95 disabled:opacity-50 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#3B82F6]/30 transition-all"
          >
            <span>{loading ? 'Registering Identity...' : 'Provision Clearance & Launch'}</span>
            <UserPlus className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] font-sans text-[#94A3B8]">
          Already provisioned? <Link href="/login" className="text-[#3B82F6] hover:underline font-bold">Sign In Here</Link>
        </p>
      </div>
    </div>
  );
}
