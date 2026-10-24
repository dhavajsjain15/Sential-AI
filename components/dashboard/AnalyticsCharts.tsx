'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Activity,
  Layers,
  Radio,
} from 'lucide-react';

// Chart 1: Weekly Risk Trend
const WEEKLY_DATA = [
  { day: 'Mon', fire: 20, medical: 5, security: 35, environmental: 10 },
  { day: 'Tue', fire: 18, medical: 8, security: 42, environmental: 12 },
  { day: 'Wed', fire: 25, medical: 6, security: 38, environmental: 8 },
  { day: 'Thu', fire: 22, medical: 4, security: 45, environmental: 15 },
  { day: 'Fri', fire: 30, medical: 9, security: 50, environmental: 11 },
  { day: 'Sat', fire: 15, medical: 3, security: 28, environmental: 7 },
  { day: 'Sun', fire: 12, medical: 7, security: 25, environmental: 9 },
];

// Chart 2: Monthly Risk Overview
const MONTHLY_DATA = [
  { month: 'Jan', incidents: 45, resolved: 42 },
  { month: 'Feb', incidents: 52, resolved: 50 },
  { month: 'Mar', incidents: 38, resolved: 36 },
  { month: 'Apr', incidents: 65, resolved: 60 },
  { month: 'May', incidents: 48, resolved: 47 },
  { month: 'Jun', incidents: 55, resolved: 53 },
];

// Chart 3: Risk Distribution Donut
const DISTRIBUTION_DATA = [
  { name: 'Security & Access', value: 35, color: '#8B5CF6' },
  { name: 'Fire & Thermal', value: 23, color: '#EF4444' },
  { name: 'Infrastructure', value: 18, color: '#3B82F6' },
  { name: 'Environmental', value: 12, color: '#22D3EE' },
  { name: 'Medical & Vitals', value: 7, color: '#EC4899' },
  { name: 'Operational', value: 5, color: '#22C55E' },
];

// Chart 4: Response Time Trend
const RESPONSE_DATA = [
  { time: '00:00', avg: 3.2, target: 2.0 },
  { time: '04:00', avg: 2.8, target: 2.0 },
  { time: '08:00', avg: 1.5, target: 2.0 },
  { time: '12:00', avg: 1.8, target: 2.0 },
  { time: '16:00', avg: 2.1, target: 2.0 },
  { time: '20:00', avg: 1.9, target: 2.0 },
];

// Chart 5: Incident Types Horizontal Bar
const TYPES_DATA = [
  { type: 'Unauthorized Entry', count: 12 },
  { type: 'Thermal Anomaly', count: 8 },
  { type: 'HVAC Failure', count: 6 },
  { type: 'VOC Vapors', count: 4 },
  { type: 'Network Surge', count: 3 },
];

// Chart 6: Sensor Activity Radar
const RADAR_DATA = [
  { sensor: 'Temperature', value: 85 },
  { sensor: 'Smoke/Gas', value: 30 },
  { sensor: 'Perimeter Motion', value: 92 },
  { sensor: 'Acoustic Sound', value: 65 },
  { sensor: 'Air Quality', value: 45 },
  { sensor: 'Power/Voltage', value: 75 },
];

export function AnalyticsCharts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#3B82F6]" />
            Deep Analytics & Predictive Intelligence
          </h2>
          <p className="text-xs font-mono text-[#94A3B8]">
            Multi-Dimensional Telemetry Synthesis across 7-Day & 6-Month Horizons
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#22D3EE]">
          LIVE RECHARTS ENGINE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chart 1: Weekly Risk Trend (Area Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
            <span className="text-xs font-heading font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
              Weekly Risk Vector Trajectory
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8]">7 DAYS</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFire" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="security" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorSec)" strokeWidth={2} />
                <Area type="monotone" dataKey="fire" stroke="#EF4444" fillOpacity={1} fill="url(#colorFire)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 2: Monthly Risk Overview (Bar Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
            <span className="text-xs font-heading font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#3B82F6]" />
              Monthly Incidents vs Resolved
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8]">6 MONTHS</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="incidents" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 3: Risk Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
            <span className="text-xs font-heading font-semibold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#22D3EE]" />
              Universal Risk Distribution
            </span>
            <span className="text-[10px] font-mono text-[#22D3EE]">100% TOTAL</span>
          </div>
          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Pie
                  data={DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" strokeWidth={1} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-mono font-bold text-white">12</span>
              <span className="text-[9px] font-mono text-[#94A3B8] uppercase">VECTORS</span>
            </div>
          </div>
        </motion.div>

        {/* Chart 4: Response Time Trend */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
            <span className="text-xs font-heading font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#22C55E]" />
              AI Mitigation Latency (Seconds)
            </span>
            <span className="text-[10px] font-mono text-[#22C55E]">TARGET: 2.0s</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RESPONSE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="avg" stroke="#22D3EE" strokeWidth={2.5} dot={{ r: 4, fill: '#22D3EE' }} />
                <Line type="step" dataKey="target" stroke="#22C55E" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 5: Incident Types Horizontal Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
            <span className="text-xs font-heading font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#F59E0B]" />
              Top Active Threat Typologies
            </span>
            <span className="text-[10px] font-mono text-[#F59E0B]">FREQUENCY</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={TYPES_DATA} margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="#94A3B8" fontSize={10} />
                <YAxis type="category" dataKey="type" stroke="#94A3B8" fontSize={10} width={85} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 6: Sensor Activity Radar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
            <span className="text-xs font-heading font-semibold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#8B5CF6]" />
              Multi-Modal Telemetry Radar
            </span>
            <span className="text-[10px] font-mono text-[#8B5CF6]">SYNCED</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="sensor" stroke="#94A3B8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.15)" fontSize={9} />
                <Radar name="Activity Index" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
