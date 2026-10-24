'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Users,
  Clock,
  Sparkles,
  MapPin,
  Heart,
} from 'lucide-react';
import { useFamilyEmergencyStore } from '@/store/useFamilyEmergencyStore';

export function FamilyCallModal() {
  const {
    isCallModalOpen,
    activeCallingContact,
    activeFamilyAlert,
    contacts,
    sentNotifications,
    closeCallModal,
  } = useFamilyEmergencyStore();

  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [isCallConnected, setIsCallConnected] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isCallModalOpen) {
      setCallDuration(0);
      setIsCallConnected(false);

      // Simulate call answering after 3.2 seconds
      const connectTimer = setTimeout(() => {
        setIsCallConnected(true);
      }, 3200);

      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        if (timer) clearInterval(timer);
        clearTimeout(connectTimer);
      };
    }
  }, [isCallModalOpen]);

  if (!isCallModalOpen || !activeCallingContact) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-xl rounded-3xl bg-[#020617] border-2 border-[#22D3EE]/50 shadow-[0_0_60px_rgba(34,211,238,0.3)] overflow-hidden relative"
        >
          {/* Top Banner: Confidential Family Channel */}
          <div className="p-4 bg-gradient-to-r from-blue-950 via-[#020617] to-cyan-950 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#22D3EE]">
              <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
              <span className="font-bold uppercase tracking-wider">
                Direct Family SOS • Confidential Dispatch
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-mono font-bold border border-[#22C55E]/40">
              911 SIRENS SUPPRESSED
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Primary Calling Contact Card */}
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#22D3EE] p-1 mx-auto shadow-xl shadow-[#22D3EE]/25">
                  <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center font-heading font-black text-2xl text-white">
                    {activeCallingContact.avatar}
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#22C55E] text-black ring-4 ring-[#020617]">
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-heading font-black text-white">
                  {activeCallingContact.name}
                </h3>
                <p className="text-sm font-mono text-[#22D3EE] font-bold">
                  {activeCallingContact.relationship} • {activeCallingContact.phone}
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xs font-mono text-[#94A3B8]">
                    {isCallConnected ? (
                      <span className="text-[#22C55E] font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                        Connected ({formatTime(callDuration)})
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold flex items-center gap-1.5 animate-pulse">
                        <PhoneCall className="w-3.5 h-3.5" />
                        Dialing Family Trunk...
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Real-time Family Voice Simulation Bubble */}
              {isCallConnected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-[#3B82F6]/40 text-left space-y-1 shadow-lg"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#22D3EE]">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Live Two-Way Audio ({activeCallingContact.name}):
                    </span>
                    <span className="text-white/60">Live Stream</span>
                  </div>
                  <p className="text-xs font-mono text-white italic">
                    {activeCallingContact.lastResponse ||
                      `"I just received your room alert! I'm 4 minutes away, are you okay?"`}
                  </p>
                </motion.div>
              )}

              {/* Audio Waveform Animation */}
              <div className="flex items-center justify-center gap-1 h-8 pt-1">
                {[0.3, 0.7, 1.0, 0.6, 0.9, 0.4, 0.8, 0.5, 0.9, 0.3].map((scale, i) => (
                  <motion.div
                    key={`bar-${i}`}
                    className={`w-1 rounded-full ${
                      isCallConnected ? 'bg-[#22D3EE]' : 'bg-amber-400'
                    }`}
                    animate={{
                      height: isCallConnected
                        ? [`${scale * 8}px`, `${scale * 28}px`, `${scale * 8}px`]
                        : ['6px', '12px', '6px'],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: isCallConnected ? 0.6 + (i % 4) * 0.15 : 1.2,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Notification Delivery Roster (Targeted ONLY to Family) */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8] font-bold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#22D3EE]" />
                  Targeted Family Notification Status:
                </span>
                <span className="text-[#22C55E] font-bold">100% DISPATCHED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-2.5 rounded-xl bg-[#020617] border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-white font-bold block">{contact.name}</span>
                      <span className="text-[10px] text-[#94A3B8]">
                        {contact.relationship}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        contact.id === activeCallingContact.id
                          ? 'bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40'
                          : 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                      }`}
                    >
                      {contact.id === activeCallingContact.id
                        ? isCallConnected
                          ? 'CONNECTED'
                          : 'CALLING'
                        : 'SMS SENT'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call Control Buttons */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isMuted
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isSpeakerOn
                    ? 'bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title="Speakerphone"
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              <button
                onClick={closeCallModal}
                className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-heading font-black text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95"
              >
                <PhoneOff className="w-5 h-5" />
                END FAMILY CALL
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
