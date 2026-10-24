'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ObjectTrackingData } from '../types';
import { Compass, Clock, MapPin, Footprints } from 'lucide-react';

interface ObjectTrackerProps {
  tracks: ObjectTrackingData[];
  showTrails?: boolean;
}

export function ObjectTracker({ tracks, showTrails = true }: ObjectTrackerProps) {
  if (!tracks || tracks.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {/* Visual Tracking Trails (SVG Paths) */}
      {showTrails && (
        <svg className="absolute inset-0 w-full h-full">
          {tracks.map((trk) => {
            if (trk.path.length < 2) return null;
            const pointsStr = trk.path
              .map((pt) => `${pt.x * 100}%,${pt.y * 100}%`)
              .join(' ');

            return (
              <g key={`trail-${trk.trackingId}`}>
                <polyline
                  points={pointsStr}
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.75"
                  className="animate-pulse"
                />
                {/* Current Lead Point Dot */}
                {trk.path.length > 0 && (
                  <circle
                    cx={`${trk.path[trk.path.length - 1].x * 100}%`}
                    cy={`${trk.path[trk.path.length - 1].y * 100}%`}
                    r="4"
                    fill="#3B82F6"
                  />
                )}
              </g>
            );
          })}
        </svg>
      )}

      {/* Bottom Left Persistent Tracking HUD */}
      <div className="absolute bottom-12 left-3 flex flex-col gap-1.5 max-w-xs pointer-events-auto">
        {tracks.slice(0, 3).map((trk) => (
          <motion.div
            key={trk.trackingId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-2 rounded-xl bg-[#020617]/90 backdrop-blur-md border border-white/10 text-xs font-mono space-y-1 shadow-lg"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1">
              <span className="text-[#22D3EE] font-bold flex items-center gap-1">
                <Footprints className="w-3 h-3" />
                {trk.trackingId} ({trk.className})
              </span>
              <span className="text-[10px] text-[#22C55E]">● TRACKING</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#F59E0B]" />
                Zone: {trk.currentZone}
              </span>
              <span className="flex items-center gap-1 text-white">
                <Clock className="w-3 h-3 text-[#3B82F6]" />
                {trk.durationSeconds}s in scene
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
