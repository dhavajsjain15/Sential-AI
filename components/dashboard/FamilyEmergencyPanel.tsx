'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  PhoneCall,
  MessageSquare,
  BellRing,
  ShieldCheck,
  Heart,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Send,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useFamilyEmergencyStore, FamilyContact } from '@/store/useFamilyEmergencyStore';

export function FamilyEmergencyPanel() {
  const {
    contacts,
    sentNotifications,
    dispatchFamilyOnlySOS,
    toggleContactChannel,
    setPrimaryContact,
    addContact,
    removeContact,
    openCallModal,
  } = useFamilyEmergencyStore();

  const [isAddingContact, setIsAddingContact] = useState<boolean>(false);
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [newContactRel, setNewContactRel] = useState<FamilyContact['relationship']>('Caregiver');
  const [customReason, setCustomReason] = useState<string>('');

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    addContact({
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRel,
      email: `${newContactName.toLowerCase().replace(/\s+/g, '.')}@family.com`,
      avatar: newContactName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      isPrimary: contacts.length === 0,
      notifyViaSms: true,
      notifyViaCall: true,
      notifyViaPush: true,
    });

    setNewContactName('');
    setNewContactPhone('');
    setIsAddingContact(false);
  };

  const handleTriggerFamilySOS = () => {
    dispatchFamilyOnlySOS(
      customReason || 'Manual One-Click Family Assistance Request',
      'Master Bedroom / Living Arena'
    );
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950/40 via-[#020617] to-cyan-950/40 border-2 border-[#22D3EE]/40 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#22D3EE]/20 border border-[#22D3EE]/40 text-[#22D3EE] shadow-lg shadow-[#22D3EE]/20">
            <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-mono font-bold uppercase border border-[#22C55E]/40">
                FAMILY-ONLY CONFIDENTIAL CHANNEL
              </span>
              <span className="text-xs font-mono text-[#94A3B8]">| 911 Sirens Suppressed</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
              Manual Help & Family SOS Direct Dispatch
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingContact(!isAddingContact)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Family Member
          </button>
        </div>
      </div>

      {/* Top Action Box: Direct One-Click Family SOS Trigger */}
      <div className="p-5 rounded-2xl bg-[#020617] border border-[#22D3EE]/50 shadow-xl space-y-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#22D3EE] font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              1-TAP DIRECT FAMILY DISPATCH (CALL & NOTIFY)
            </span>
            <h3 className="text-lg font-heading font-extrabold text-white">
              Request Immediate Help from {primaryContact?.name} ({primaryContact?.relationship})
            </h3>
            <p className="text-xs font-mono text-[#94A3B8]">
              Triggers instant 2-way phone call to primary contact and transmits localized SMS tracking alerts to all family members.
            </p>
          </div>

          <button
            onClick={handleTriggerFamilySOS}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6] hover:opacity-95 text-black font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-[#22D3EE]/30 transition-all active:scale-98 shrink-0 cursor-pointer"
          >
            <PhoneCall className="w-5 h-5 text-black" />
            DIRECT CALL FAMILY SOS
          </button>
        </div>
      </div>

      {/* Add Contact Form Drawer */}
      <AnimatePresence>
        {isAddingContact && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddSubmit}
            className="p-5 rounded-2xl bg-[#020617] border border-white/15 space-y-4 relative z-10"
          >
            <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#22D3EE]" />
              Register New Family Emergency Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Full Name (e.g. Sarah Davis)"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono placeholder:text-white/40 focus:border-[#22D3EE] outline-none"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number (e.g. +1 555-234-8901)"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono placeholder:text-white/40 focus:border-[#22D3EE] outline-none"
                required
              />
              <select
                value={newContactRel}
                onChange={(e) => setNewContactRel(e.target.value as any)}
                className="px-3.5 py-2.5 rounded-xl bg-[#020617] border border-white/10 text-white text-xs font-mono focus:border-[#22D3EE] outline-none"
              >
                <option value="Daughter">Daughter</option>
                <option value="Son">Son</option>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Caregiver">Caregiver</option>
                <option value="Doctor">Family Doctor</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingContact(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-white/70 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#22D3EE] text-black font-mono font-bold text-xs shadow-md"
              >
                Save Contact
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Family Contacts Grid */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
          <span className="font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#22D3EE]" /> Registered Family Members ({contacts.length})
          </span>
          <span>Targeted Notifications Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                contact.isPrimary
                  ? 'bg-gradient-to-br from-blue-950/70 to-[#020617] border-[#22D3EE]/60 shadow-lg shadow-[#22D3EE]/10'
                  : 'bg-[#020617] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#22D3EE] flex items-center justify-center font-heading font-black text-sm text-white shadow-md">
                    {contact.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-heading font-bold text-white">
                        {contact.name}
                      </h4>
                      {contact.isPrimary && (
                        <span className="px-2 py-0.5 rounded bg-[#22D3EE]/20 text-[#22D3EE] text-[9px] font-mono font-bold border border-[#22D3EE]/40">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-[#94A3B8]">
                      {contact.relationship} • {contact.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openCallModal(contact)}
                    className="p-2 rounded-xl bg-[#22D3EE]/20 hover:bg-[#22D3EE]/30 border border-[#22D3EE]/40 text-[#22D3EE] text-xs font-mono font-bold transition-all"
                    title={`Call ${contact.name}`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </button>
                  {!contact.isPrimary && (
                    <button
                      onClick={() => setPrimaryContact(contact.id)}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-mono text-white/70"
                      title="Set as Primary"
                    >
                      Make Primary
                    </button>
                  )}
                  {contacts.length > 1 && (
                    <button
                      onClick={() => removeContact(contact.id)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Channel Toggles */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                <span>Notification Channels:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleContactChannel(contact.id, 'notifyViaSms')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      contact.notifyViaSms
                        ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
                        : 'bg-white/5 text-white/30 border-white/10'
                    }`}
                  >
                    SMS
                  </button>
                  <button
                    onClick={() => toggleContactChannel(contact.id, 'notifyViaCall')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      contact.notifyViaCall
                        ? 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40'
                        : 'bg-white/5 text-white/30 border-white/10'
                    }`}
                  >
                    VOICE CALL
                  </button>
                  <button
                    onClick={() => toggleContactChannel(contact.id, 'notifyViaPush')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      contact.notifyViaPush
                        ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40'
                        : 'bg-white/5 text-white/30 border-white/10'
                    }`}
                  >
                    PUSH
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Targeted SMS Simulation Sample */}
      <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 relative z-10 text-xs font-mono">
        <div className="flex items-center justify-between text-[11px] text-[#22D3EE]">
          <span className="font-bold flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> Sample Encrypted SMS Sent Exclusively to Family:
          </span>
          <span className="text-[#22C55E]">Delivered via Secure Gateway</span>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-white/90 leading-relaxed italic">
          "🚨 <strong>SENTINEL FAMILY ALERT:</strong> User requested direct assistance in <strong>Master Bedroom</strong> at {new Date().toLocaleTimeString()}. Status: Alert & responsive. No public sirens dispatched. Call user: <strong>+1 (555) 019-2834</strong> or open live telemetry: <span className="text-[#22D3EE] underline">https://sentinel.ai/family/track-889</span>"
        </div>
      </div>
    </div>
  );
}
