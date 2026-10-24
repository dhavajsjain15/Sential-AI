'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  HeartPulse,
  Wind,
  Zap,
  Droplets,
  ShieldAlert,
  Swords,
  CloudRain,
  TreePine,
  Bug,
  Baby,
  Heart,
} from 'lucide-react';
import { RISK_CATEGORIES } from '@/constants';

export function RiskCategoriesGrid() {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return Flame;
      case 'HeartPulse': return HeartPulse;
      case 'Wind': return Wind;
      case 'Zap': return Zap;
      case 'Droplets': return Droplets;
      case 'ShieldAlert': return ShieldAlert;
      case 'Swords': return Swords;
      case 'CloudRain': return CloudRain;
      case 'TreePine': return TreePine;
      case 'Bug': return Bug;
      case 'Baby': return Baby;
      case 'Heart': return Heart;
      default: return ShieldAlert;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            Universal Risk Categories
          </h2>
          <p className="text-xs font-mono text-[#94A3B8]">
            Real-Time 12-Dimensional Multi-Modal Hazard Matrix
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[#22D3EE]">
          12/12 MONITORED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {RISK_CATEGORIES.map((cat, index) => {
          const IconComponent = getCategoryIcon(cat.icon);
          const riskScore = cat.risk ?? cat.score ?? 0;
          const confidenceScore = cat.confidence ?? 95;
          const statusText = cat.status ?? (riskScore >= 40 ? 'Alert' : riskScore >= 20 ? 'Elevated' : 'Normal');
          const recText = cat.recommendation ?? cat.description ?? 'Standard AI surveillance tracking.';
          const isHigh = riskScore >= 40;
          const isElevated = riskScore >= 20 && riskScore < 40;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between shadow-lg relative overflow-hidden"
              style={{
                borderColor: isHigh ? 'rgba(239, 68, 68, 0.4)' : isElevated ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Subtle top glow based on category color */}
              <div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
                style={{ backgroundColor: cat.color }}
              />

              {/* Header: Icon & Status Badge */}
              <div className="flex items-start justify-between gap-2 pb-3">
                <div
                  className="p-2.5 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                <span
                  className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${cat.color}15`,
                    color: cat.color,
                    borderColor: `${cat.color}35`,
                  }}
                >
                  {statusText}
                </span>
              </div>

              {/* Title & Risk Progress */}
              <div className="space-y-2 my-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-sm text-white group-hover:text-[#22D3EE] transition-colors">
                    {cat.name}
                  </h3>
                  <span
                    className="font-mono font-black text-base"
                    style={{ color: cat.color }}
                  >
                    {riskScore}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${riskScore}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full transition-all"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </div>

              {/* Footer: Confidence & AI Recommendation */}
              <div className="pt-3 mt-2 border-t border-white/10 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-[#94A3B8]">
                  <span>AI Confidence:</span>
                  <span className="text-white font-semibold">{confidenceScore}%</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-tight truncate group-hover:whitespace-normal group-hover:text-white/90 transition-all font-sans">
                  {recText}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
