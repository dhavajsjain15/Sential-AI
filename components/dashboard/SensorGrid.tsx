'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Thermometer,
  CloudFog,
  Wind,
  Droplets,
  Activity,
  Volume2,
  Waves,
  DoorClosed,
  SquareStack,
  Gauge,
  Zap,
  Cable,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { SENSORS } from '@/constants';

export function SensorGrid() {
  const getSensorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Thermometer': return Thermometer;
      case 'CloudFog': return CloudFog;
      case 'Wind': return Wind;
      case 'Droplets': return Droplets;
      case 'Activity': return Activity;
      case 'Volume2': return Volume2;
      case 'Waves': return Waves;
      case 'DoorClosed': return DoorClosed;
      case 'SquareStack': return SquareStack;
      case 'Gauge': return Gauge;
      case 'Zap': return Zap;
      case 'Cable': return Cable;
      default: return Activity;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3.5 h-3.5 text-[#EF4444]" />;
      case 'down': return <TrendingDown className="w-3.5 h-3.5 text-[#22C55E]" />;
      default: return <Minus className="w-3.5 h-3.5 text-[#94A3B8]" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/50 animate-pulse';
      case 'clear':
      case 'secure':
      case 'normal':
      default:
        return 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            Real-Time IoT Sensor Grid
          </h2>
          <p className="text-xs font-mono text-[#94A3B8]">
            Multi-Modal Telemetry & Environmental Telemetry Streams
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[#22C55E]">
          12/12 ONLINE & ARMED
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {SENSORS.map((rawSensor, index) => {
          const sensor = rawSensor as any;
          const IconComponent = getSensorIcon(sensor.icon || 'Activity');
          const sensorColor = sensor.color || '#3B82F6';
          const sensorRange = sensor.range || 'Nominal';

          return (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="group p-3.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between relative overflow-hidden shadow-md"
            >
              {/* Left Accent Glow Bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-r transition-opacity group-hover:w-1.5"
                style={{ backgroundColor: sensorColor }}
              />

              {/* Header: Icon & Status */}
              <div className="flex items-center justify-between gap-1 pb-2">
                <div
                  className="p-2 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${sensorColor}20`, color: sensorColor }}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getStatusStyles(
                    sensor.status
                  )}`}
                >
                  {sensor.status}
                </span>
              </div>

              {/* Sensor Name & Value */}
              <div className="my-2 space-y-1">
                <span className="text-xs font-heading font-medium text-[#94A3B8] block truncate group-hover:text-white transition-colors">
                  {sensor.name}
                </span>
                <div className="text-lg md:text-xl font-mono font-bold text-white tracking-tight flex items-baseline justify-between">
                  <span>{sensor.value}</span>
                  {getTrendIcon(sensor.trend)}
                </div>
              </div>

              {/* Footer: Range */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>Range:</span>
                <span className="text-white/80">{sensorRange}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
