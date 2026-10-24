'use client';

import React from 'react';
import { CameraConfig, Detection, ObjectTrackingData } from '../types';
import { LiveCameraCard } from './LiveCameraCard';
import { GridLayoutMode } from './CameraToolbar';

interface CameraGridProps {
  cameras: CameraConfig[];
  detectionsByCamera: Map<string, Detection[]>;
  trackingByCamera: Map<string, ObjectTrackingData[]>;
  fps: number;
  inferenceTimeMs: number;
  isAIActive: boolean;
  layoutMode: GridLayoutMode;
  onCaptureSnapshot?: (camera: CameraConfig, detections: Detection[]) => void;
  onReconnect?: (id: string) => void;
}

export function CameraGrid({
  cameras,
  detectionsByCamera,
  trackingByCamera,
  fps,
  inferenceTimeMs,
  isAIActive,
  layoutMode,
  onCaptureSnapshot,
  onReconnect,
}: CameraGridProps) {
  if (!cameras || cameras.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-3">
        <h3 className="font-heading font-bold text-lg text-white">No Active Camera Streams Available</h3>
        <p className="text-xs font-sans text-[#94A3B8] max-w-sm mx-auto">
          Please provision a new IP camera, RTSP stream, or enable your local OS webcam above.
        </p>
      </div>
    );
  }

  // Determine grid columns and visible count
  let gridClass = 'grid-cols-1';
  let visibleCameras = cameras.slice(0, 1);

  if (layoutMode === '2x2') {
    gridClass = 'grid-cols-1 md:grid-cols-2';
    visibleCameras = cameras.slice(0, 4);
  } else if (layoutMode === '4x4') {
    gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    visibleCameras = cameras.slice(0, 16);
  }

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {visibleCameras.map((cam) => {
        const camDetections = detectionsByCamera.get(cam.id) || [];
        const camTracking = trackingByCamera.get(cam.id) || [];

        return (
          <LiveCameraCard
            key={cam.id}
            camera={cam}
            detections={camDetections}
            trackingHistory={camTracking}
            fps={fps}
            inferenceTimeMs={inferenceTimeMs}
            isAIActive={isAIActive}
            onCaptureSnapshot={onCaptureSnapshot}
            onReconnect={onReconnect}
            aspectRatio={layoutMode === '4x4' ? 'video' : 'video'}
          />
        );
      })}
    </div>
  );
}
