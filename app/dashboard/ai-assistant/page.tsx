'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { generateId, formatDate } from '@/lib/utils';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello, Commander. JARVIS AI Universal Risk Co-Pilot is online. All 12 threat vectors are synchronized across 142 IoT edge nodes. How can I assist your mission today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: generateId(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const prompt = input;
    setInput('');

    setTimeout(() => {
      const aiMsg = {
        id: generateId(),
        sender: 'ai',
        text: `Executing deep neural synthesis on query: "${prompt}".\n\nBased on current telemetry, global risk index stands at 34% (Low). All environmental VOC sensors and YOLO optical feeds show zero active breaches. No emergency interventions are currently mandated.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#3B82F6]/20 via-[#8B5CF6]/10 to-transparent border border-[#3B82F6]/30">
        <div>
          <div className="flex items-center gap-2 text-[#22D3EE] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4 animate-bounce" />
            Full-Screen JARVIS Command Interface
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-2">
            AI Co-Pilot Command Center
            <Sparkles className="w-5 h-5 text-[#22D3EE]" />
          </h1>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-[#020617]/80 border border-white/10 flex items-center gap-2 text-xs font-mono">
          <Cpu className="w-4 h-4 text-[#22C55E]" />
          <span>DeepMind / Gemini Pro Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Chat Area (3 cols) */}
        <div className="lg:col-span-3 rounded-3xl bg-white/5 border border-white/10 flex flex-col h-[550px] overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/10 bg-[#020617]/60 flex items-center justify-between">
            <span className="text-xs font-mono text-[#94A3B8] uppercase">JARVIS Live Dialogue Stream</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-br-none shadow-lg'
                      : 'bg-[#020617]/80 border border-white/10 text-white rounded-bl-none border-l-4 border-l-[#3B82F6]'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{m.text}</div>
                </div>
                <span className="text-[10px] font-mono text-[#94A3B8] mt-1 px-1">
                  {formatDate(m.timestamp)}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-[#020617] flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Command JARVIS or ask about threats, sensors, and room status..."
              className="flex-1 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-[#3B82F6] rounded-2xl px-5 py-3 text-sm text-white placeholder-[#94A3B8] outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] disabled:opacity-40 text-white font-heading font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <span>Transmit</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Quick Prompts & Specs Sidebar (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              Suggested AI Inquiries
            </h4>
            <div className="space-y-2">
              {[
                'Why is Server Room B2 elevated?',
                'Synthesize 24h thermal trends',
                'Simulate Sector 7 evacuation',
                'Check fire suppression dry pipes',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/90 font-sans transition-all"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
