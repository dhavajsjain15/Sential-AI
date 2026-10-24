'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, CheckSquare, Square, AlertCircle, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import { generateId, formatDate } from '@/lib/utils';

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMsg {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  category?: 'status' | 'risk' | 'recommendation' | 'actions';
}

export function AIAssistantPanel({ isOpen, onClose }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'System Status: All critical systems operational. 142 devices online across 4 primary zones.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      category: 'status',
    },
    {
      id: 'm2',
      sender: 'ai',
      text: 'Risk Assessment: Global risk level is LOW (34%). Security category elevated due to multiple failed authentication attempts on restricted entry point Server Room B2.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      category: 'risk',
    },
    {
      id: 'm3',
      sender: 'ai',
      text: 'Recommendation: Review Server Room B2 thermal readings. HVAC failure detected causing temperature rise above 85°F. Immediate maintenance dispatch recommended within 48 hours.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      category: 'recommendation',
    },
    {
      id: 'm4',
      sender: 'ai',
      text: 'Next Actions:\n• Acknowledge thermal anomaly alert (TS-042)\n• Review perimeter breach footage in Sector 7\n• Schedule HVAC emergency inspection\n• Update automated evacuation routing protocols',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      category: 'actions',
    },
  ]);

  const [input, setInput] = useState('');
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Verify all emergency exit routes are clear', checked: true },
    { id: 'c2', label: 'Check fire suppression system valve status', checked: false },
    { id: 'c3', label: 'Confirm emergency contacts & dispatch directory updated', checked: true },
    { id: 'c4', label: 'Review Sector 7 evacuation simulation procedures', checked: false },
  ]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMsg = {
      id: generateId(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const prompt = input;
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiReply: ChatMsg = {
        id: generateId(),
        sender: 'ai',
        text: `Synthesizing real-time telemetry for query: "${prompt}"...\n\nAll connected IoT gateways and thermal sensors report nominal baselines except Zone B. We have preemptively throttled power to Server Room B2 rack #4 by 15% to mitigate thermal runaways while maintenance arrives.`,
        timestamp: new Date(),
        category: 'recommendation',
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1200);
  };

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-16 right-0 bottom-0 w-80 sm:w-96 bg-[#020617]/95 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-2xl shadow-black"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#3B82F6]/10 to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white shadow-lg shadow-[#3B82F6]/30">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  JARVIS AI CO-PILOT
                  <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                </h3>
                <span className="text-[10px] font-mono text-[#22C55E]">● Real-time Multi-Modal Reasoning</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#94A3B8] hover:text-white transition-colors"
              aria-label="Close AI Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
            {/* Safety & Emergency Checklist */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="font-heading font-semibold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
                  Emergency Readiness Checklist
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                  {checklist.filter((i) => i.checked).length}/{checklist.length} DONE
                </span>
              </div>
              <div className="space-y-2 pt-1">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-xs select-none"
                  >
                    {item.checked ? (
                      <CheckSquare className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
                    )}
                    <span className={item.checked ? 'text-[#94A3B8] line-through' : 'text-white/90'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#3B82F6]/10 via-[#8B5CF6]/10 to-transparent border border-[#3B82F6]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-heading font-semibold text-[#22D3EE]">
                <Cpu className="w-4 h-4 animate-spin-slow" />
                Autonomous Mitigation Active
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                Predictive sensor fusion indicates 91% probability of HVAC recovery within 25 minutes after manual override. No personnel evacuation required for Server Room B2 at this time.
              </p>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4">
              <div className="text-[10px] font-mono text-[#94A3B8] text-center uppercase tracking-wider">
                — Live Intelligence Log —
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-br-none shadow-lg shadow-[#3B82F6]/20'
                        : 'bg-white/5 border border-white/10 text-white/90 rounded-bl-none border-l-2 border-l-[#3B82F6] shadow-md'
                    }`}
                  >
                    {msg.category && (
                      <div className="flex items-center gap-1.5 pb-1.5 mb-1.5 border-b border-white/10 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#22D3EE]">
                        <AlertCircle className="w-3 h-3 text-[#3B82F6]" />
                        {msg.category}
                      </div>
                    )}
                    <div className="whitespace-pre-line font-sans">{msg.text}</div>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8] mt-1 px-1">
                    {formatDate(msg.timestamp).split(',')[1]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Input Footer Area */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-[#020617] space-y-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask JARVIS about threats, rooms, sensors..."
                className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-[#3B82F6] rounded-xl pl-4 pr-11 py-2.5 text-xs text-white placeholder-[#94A3B8] outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-1.5 p-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-30 text-white transition-colors shadow-md"
                aria-label="Send query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-[#94A3B8]">
              <span>Powered by DeepMind & Gemini Pro</span>
              <button
                type="button"
                onClick={() => setMessages([])}
                className="hover:text-white underline transition-colors"
              >
                Clear Log
              </button>
            </div>
          </form>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
