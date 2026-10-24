'use client';

import React, { useState } from 'react';
import { CameraConfig, Detection, ObjectTrackingData } from '../types';
import { DetectionOverlay } from '../detectors/DetectionOverlay';
import { ObjectTracker } from '../detectors/ObjectTracker';
import { ConnectionBadge } from './ConnectionBadge';
import { FullscreenCamera } from './FullscreenCamera';
import { Maximize2, Camera, MapPin, Radio, RefreshCw } from 'lucide-react';

interface LiveCameraCardProps {
  camera: CameraConfig;
  detections: Detection[];
  trackingHistory: ObjectTrackingData[];
  fps: number;
  inferenceTimeMs: number;
  isAIActive: boolean;
  onCaptureSnapshot?: (camera: CameraConfig, detections: Detection[]) => void;
  onReconnect?: (id: string) => void;
  aspectRatio?: 'video' | 'square' | 'auto';
}

export function LiveCameraCard({
  camera,
  detections,
  trackingHistory,
  fps,
  inferenceTimeMs,
  isAIActive,
  onCaptureSnapshot,
  onReconnect,
  aspectRatio = 'video',
}: LiveCameraCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const aspectClass =
    aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'video' ? 'aspect-video' : 'h-64 sm:h-80';

  return (
    <>
      <div className="rounded-3xl bg-[#020617] border border-white/10 overflow-hidden shadow-2xl flex flex-col group relative transition-all hover:border-white/20">
        {/* Top Floating Card Header */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20 pointer-events-none">
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 pointer-events-auto">
            <Radio className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse" />
            <span className="text-xs font-mono font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
              {camera.name}
            </span>
            <span className="text-[10px] font-mono text-[#F59E0B] flex items-center gap-1 border-l border-white/10 pl-2">
              <MapPin className="w-2.5 h-2.5" /> {camera.zone}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <ConnectionBadge status={camera.status} bitrateKbps={camera.bitrateKbps} />

            {/* Quick Actions inside card */}
            {onCaptureSnapshot && (
              <button
                onClick={() => onCaptureSnapshot(camera, detections)}
                className="p-1.5 rounded-lg bg-black/80 hover:bg-[#3B82F6]/30 border border-white/10 text-white transition-all"
                title="Capture Forensic Snapshot"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}

            {onReconnect && camera.status !== 'online' && (
              <button
                onClick={() => onReconnect(camera.id)}
                className="p-1.5 rounded-lg bg-[#F59E0B]/20 hover:bg-[#F59E0B]/40 border border-[#F59E0B]/40 text-[#F59E0B] transition-all"
                title="Force Reconnect Stream"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-lg bg-black/80 hover:bg-white/20 border border-white/10 text-white transition-all"
              title="Fullscreen Inspection"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className={`relative w-full ${aspectClass} bg-[#020617] overflow-hidden flex items-center justify-center`}>
          {/* Simulated Video Feed Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0b1329] to-[#020617]" />
          <div className="absolute inset-0 bg-grid opacity-40" />

          {/* Animated Scanline */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#22D3EE]/50 to-transparent animate-scan" />
          </div>

          {/* Object Tracker Trails */}
          <ObjectTracker tracks={trackingHistory} showTrails={true} />

          {/* AI Bounding Box Overlays */}
          <DetectionOverlay
            detections={detections}
            fps={fps}
            inferenceTimeMs={inferenceTimeMs}
            isAIActive={isAIActive}
            showLabels={true}
          />
        </div>

        {/* Bottom Card Footer Info */}
        <div className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{camera.id}</span>
            <span>•</span>
            <span>{camera.resolution}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={detections.length > 0 ? 'text-[#EF4444] font-bold' : 'text-[#22C55E]'}>
              {detections.length} Detections
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen Inspection Modal */}
      <FullscreenCamera
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        camera={camera}
        detections={detections}
        trackingHistory={trackingHistory}
        fps={fps}
        inferenceTimeMs={inferenceTimeMs}
        isAIActive={isAIActive}
      />
    </>
  );
}
