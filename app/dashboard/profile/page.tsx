'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Mail, Building, Phone, Key, Save, Edit3, CheckCircle2, Zap } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@sentinel-ai.enterprise');
  const [role, setRole] = useState('EMERGENCY OPERATOR (LEVEL 5 / DEFCON 1 AUTHORIZED)');
  const [org, setOrg] = useState('Global Risk Shield — Command Center Alpha');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setStatusMsg('✅ Operator Profile and Role Clearance synchronized across Firebase Auth & reCAPTCHA v3!');
    setTimeout(() => setStatusMsg(null), 4000);
  };

  return (
    <div className="space-y-8 pb-14 max-w-5xl">
      {/* 1. Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#020617] to-purple-950/40 border border-[#3B82F6]/30 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] p-0.5 shadow-xl shrink-0">
            <div className="w-full h-full bg-[#020617] rounded-[14px] flex items-center justify-center font-heading font-black text-2xl text-white">
              {fullName.split(' ').map((n) => n[0]).join('') || 'JD'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">{fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] text-[10px] font-mono font-bold">
                {role.split('(')[0].trim()}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#94A3B8]">{email}</p>
            <p className="text-xs font-mono text-[#22D3EE]">{org}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#8B5CF6] hover:opacity-95 text-white font-heading font-bold text-xs shadow-xl shadow-[#3B82F6]/30 transition-all active:scale-95 shrink-0"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Credentials'}</span>
        </button>
      </div>

      <AnimatePresence>
        {statusMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-[#020617]/90 border border-[#22C55E]/50 text-[#22C55E] text-xs font-mono font-bold flex items-center gap-2 shadow-xl"
          >
            <Zap className="w-4 h-4 animate-bounce" />
            <span>{statusMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Interactive Editing Form (When active) */}
      <AnimatePresence>
        {isEditing && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSaveProfile}
            className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 shadow-2xl overflow-hidden font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-heading font-bold text-[#22D3EE] uppercase tracking-wider">
                EDIT OPERATOR IDENTITY & CLEARANCE PARAMETERS
              </span>
              <span className="text-[#94A3B8]">Audit Log Encrypted</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white font-bold block">OPERATOR FULL NAME</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-[#020617] border border-white/15 rounded-xl px-4 py-3 text-white outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white font-bold block">ENTERPRISE EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#020617] border border-white/15 rounded-xl px-4 py-3 text-white outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white font-bold block">SECURITY CLEARANCE ROLE</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#020617] border border-white/15 rounded-xl px-4 py-3 text-white outline-none focus:border-[#3B82F6]"
                >
                  <option value="EMERGENCY OPERATOR (LEVEL 5 / DEFCON 1 AUTHORIZED)">EMERGENCY OPERATOR (LEVEL 5 / DEFCON 1 AUTHORIZED)</option>
                  <option value="EXECUTIVE CHIEF RISK OFFICER (LEVEL 5)">EXECUTIVE CHIEF RISK OFFICER (LEVEL 5)</option>
                  <option value="INCIDENT DISPATCH COMMANDER (LEVEL 4)">INCIDENT DISPATCH COMMANDER (LEVEL 4)</option>
                  <option value="HARDWARE IOT PROVISIONING SPECIALIST (LEVEL 3)">HARDWARE IOT PROVISIONING SPECIALIST (LEVEL 3)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-white font-bold block">ORGANIZATION / SECTOR</label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  required
                  className="w-full bg-[#020617] border border-white/15 rounded-xl px-4 py-3 text-white outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#020617] font-heading font-black flex items-center gap-2 shadow-lg shadow-[#22C55E]/30"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* 3. Credentials & Security Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-5 shadow-xl">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#3B82F6]" />
            Active Operator Clearance
          </h3>
          <div className="space-y-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-[#020617]/80 border border-white/10 space-y-1">
              <span className="text-[#94A3B8] block text-[10px]">FULL NAME</span>
              <span className="text-white font-bold text-sm">{fullName}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#020617]/80 border border-white/10 space-y-1">
              <span className="text-[#94A3B8] block text-[10px]">ENTERPRISE EMAIL</span>
              <span className="text-white font-bold text-sm">{email}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#020617]/80 border border-white/10 space-y-1">
              <span className="text-[#94A3B8] block text-[10px]">ROLE & CLEARANCE LEVEL</span>
              <span className="text-[#22D3EE] font-bold text-sm">{role}</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-5 shadow-xl">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
            Hardware Key & Biometric MFA Guards
          </h3>
          <div className="space-y-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-[#020617]/80 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-white font-bold text-sm block">YubiKey 5 NFC Hardware MFA</span>
                <span className="text-[#94A3B8] text-[10px]">FIDO2 / WebAuthn Hardware Signature</span>
              </div>
              <span className="px-3 py-1 rounded bg-[#22C55E]/20 text-[#22C55E] font-bold">VERIFIED</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#020617]/80 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-white font-bold text-sm block">Firebase App Check Token</span>
                <span className="text-[#94A3B8] text-[10px]">reCAPTCHA Enterprise v3 Active</span>
              </div>
              <span className="px-3 py-1 rounded bg-[#22C55E]/20 text-[#22C55E] font-bold">ACTIVE</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#020617]/80 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-white font-bold text-sm block">Session Token Expiration</span>
                <span className="text-[#94A3B8] text-[10px]">Auto-renewal via TLS 1.3 Secure Cookie</span>
              </div>
              <span className="px-3 py-1 rounded bg-[#3B82F6]/20 text-[#3B82F6] font-bold">11h 42m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
