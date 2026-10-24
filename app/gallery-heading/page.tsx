'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GalleryHeading, GalleryHeadingVariant, GalleryHeadingFont, GalleryHeadingWeight } from '@/shaders/neuform-isolated/NeuformIsolatedEffects';
import '@/shaders/threeui.css';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Palette,
  Type,
  Sun,
  Moon,
  RotateCcw,
  Sliders,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function GalleryHeadingPage() {
  const [variant, setVariant] = useState<GalleryHeadingVariant>('horizontal-sweep');
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [font, setFont] = useState<GalleryHeadingFont>('oldstyle');
  const [weight, setWeight] = useState<GalleryHeadingWeight>('700');
  const [headlineSize, setHeadlineSize] = useState<number>(1.20);
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(1.00);
  const [brightness, setBrightness] = useState<number>(1.00);

  const variants: { id: GalleryHeadingVariant; label: string; tag: string; desc: string }[] = [
    {
      id: 'horizontal-sweep',
      label: 'Riso Sweep',
      tag: 'Exact Authored Target',
      desc: 'Print colour dithered to three tones over a lit corner, scanlines and heavy grain, under an old-style serif standing on a hard offset plate.',
    },
    {
      id: 'rising-diagonal',
      label: 'Matte Orbit',
      tag: 'Museum Grade',
      desc: 'Museum colours under soft noise rise, light sans on wide tracking, sprung orbit.',
    },
    {
      id: 'falling-diagonal',
      label: 'Glitch Signal',
      tag: 'Cyberpunk Broadcast',
      desc: 'Broadcast colours torn into flat blocks, rows out of register, and bold sans breakdown.',
    },
    {
      id: 'vertical-loop',
      label: 'Halftone Plates',
      tag: 'Monochrome Print',
      desc: 'Single ink on raw stock shaded by dot size under high-contrast didone typography.',
    },
  ];

  const resetDefaults = () => {
    setVariant('horizontal-sweep');
    setMode('dark');
    setFont('oldstyle');
    setWeight('700');
    setHeadlineSize(1.20);
    setHue(0);
    setSaturation(1.00);
    setBrightness(1.00);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-white flex flex-col selection:bg-rose-500/30">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06080d]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                GalleryHeading
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  ThreeUI Canvas 2D
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">SHA-256 8e42d2d5b497 · Riso Sweep</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/kage"
            className="text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Kage Landing Page</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-medium px-3.5 py-1.5 rounded-lg shadow-lg shadow-rose-900/30 transition-all flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Mission Control</span>
          </Link>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left / Center Preview Stage */}
        <div className="lg:col-span-8 flex flex-col p-6 lg:p-8 justify-center items-center relative min-h-[560px] lg:min-h-[calc(100vh-73px)] border-b lg:border-b-0 lg:border-r border-white/10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-[#06080d] to-[#040508]">
          {/* Canvas 2D Shader Frame */}
          <div className="w-full max-w-4xl h-[460px] sm:h-[540px] md:h-[600px] rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl relative group">
            {/* Ambient Corner Accents */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Live ThreeUI GalleryHeading Component */}
            <div className="shader-frame w-full h-full relative z-10">
              <GalleryHeading
                variant={variant}
                mode={mode}
                font={font}
                weight={weight}
                headlineSize={headlineSize}
                hue={hue}
                saturation={saturation}
                brightness={brightness}
                className="w-full h-full"
              />
            </div>

            {/* Interactive Badge */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                ✨ Hover pointer over canvas to accelerate orbit
              </span>
            </div>
          </div>

          {/* Quick Variant Switcher Row below preview */}
          <div className="w-full max-w-4xl mt-6 flex flex-wrap gap-2.5 justify-center">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariant(v.id)}
                className={`text-xs px-3.5 py-2 rounded-xl font-medium border transition-all flex items-center gap-2 ${
                  variant === v.id
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-200 shadow-md shadow-rose-950/50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    variant === v.id ? 'bg-rose-400 animate-pulse' : 'bg-slate-600'
                  }`}
                />
                <span>{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Controls Panel */}
        <aside className="lg:col-span-4 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-73px)] bg-[#080b12]/90 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-200">
                Component Controls
              </h2>
            </div>
            <button
              onClick={resetDefaults}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
              title="Reset to configured default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Active Variant Card */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-300">
                {variants.find((v) => v.id === variant)?.label}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {variants.find((v) => v.id === variant)?.tag}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {variants.find((v) => v.id === variant)?.desc}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              Theme Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode('dark')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                  mode === 'dark'
                    ? 'bg-white/15 border-white/30 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark Mode</span>
              </button>
              <button
                onClick={() => setMode('light')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                  mode === 'light'
                    ? 'bg-white text-slate-900 border-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light Mode</span>
              </button>
            </div>
          </div>

          {/* Typography Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-slate-400" />
              Font Family & Weight
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['oldstyle', 'serif', 'didone', 'sans'] as GalleryHeadingFont[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFont(f)}
                  className={`py-1.5 px-3 rounded-lg text-xs capitalize border text-left transition-all ${
                    font === f
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-200'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {(['400', '700'] as GalleryHeadingWeight[]).map((w) => (
                <button
                  key={w}
                  onClick={() => setWeight(w)}
                  className={`py-1.5 px-3 rounded-lg text-xs border text-center transition-all ${
                    weight === w
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-200 font-semibold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  Weight {w}
                </button>
              ))}
            </div>
          </div>

          {/* Headline Size Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-medium text-slate-300">Headline Scale</label>
              <span className="font-mono text-rose-400">{headlineSize.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.8"
              step="0.05"
              value={headlineSize}
              onChange={(e) => setHeadlineSize(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          {/* Color Adjustments */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold uppercase text-slate-300">Shader Filters</span>
            </div>

            {/* Hue */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Hue Shift</span>
                <span className="font-mono text-slate-300">{hue}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={hue}
                onChange={(e) => setHue(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Saturation</span>
                <span className="font-mono text-slate-300">{saturation.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.05"
                value={saturation}
                onChange={(e) => setSaturation(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Brightness</span>
                <span className="font-mono text-slate-300">{brightness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.35"
                max="1.65"
                step="0.05"
                value={brightness}
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>
          </div>

          {/* Usage Code Snippet */}
          <div className="pt-2 border-t border-white/10">
            <span className="text-xs font-semibold text-slate-300 block mb-2">Configured Usage</span>
            <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-emerald-400 overflow-x-auto">
              <code>{`<GalleryHeading
  variant="${variant}"
  mode="${mode}"
  font="${font}"
  weight="${weight}"
  headlineSize={${headlineSize.toFixed(2)}}
  hue={${hue}}
  saturation={${saturation.toFixed(2)}}
  brightness={${brightness.toFixed(2)}}
/>`}</code>
            </pre>
          </div>
        </aside>
      </main>
    </div>
  );
}
