'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Detection, ObjectTrackingData, CameraConfig } from '../types';
import { YoloModelFactory } from './YoloAdapter';
import { SimulationScenario } from './SimulatedYoloModel';

export function useYoloEngine(
  activeCamera: CameraConfig,
  isAIActive: boolean,
  scenario: SimulationScenario = 'Normal Surveillance'
) {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [inferenceTimeMs, setInferenceTimeMs] = useState<number>(14.2);
  const [fps, setFps] = useState<number>(30);
  const [trackingHistory, setTrackingHistory] = useState<Map<string, ObjectTrackingData>>(new Map());
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const trackingMapRef = useRef<Map<string, ObjectTrackingData>>(new Map());

  // Initialize model adapter
  useEffect(() => {
    let mounted = true;
    YoloModelFactory.initializeModel().then(() => {
      if (mounted) {
        setIsInitializing(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Run detection loop at ~30 FPS (or target FPS)
  useEffect(() => {
    if (!isAIActive || isInitializing) {
      setDetections([]);
      return;
    }

    let isRunning = true;
    const model = YoloModelFactory.getModel();

    const loop = async () => {
      if (!isRunning) return;
      try {
        const result = await model.detect(undefined, scenario, activeCamera);
        if (!isRunning) return;

        setDetections(result.detections);
        setInferenceTimeMs(result.inferenceTimeMs);
        setFps(result.fps);

        // Update tracking histories
        const now = Date.now();
        const updatedMap = new Map(trackingMapRef.current);

        result.detections.forEach((det) => {
          const id = det.trackingId;
          const center = {
            x: det.box.x + det.box.width / 2,
            y: det.box.y + det.box.height / 2,
            timestamp: now,
          };

          if (updatedMap.has(id)) {
            const existing = updatedMap.get(id)!;
            const newPath = [...existing.path, center].slice(-25); // keep last 25 points for smooth tracking path
            updatedMap.set(id, {
              ...existing,
              lastSeen: now,
              durationSeconds: Math.round((now - existing.firstSeen) / 1000),
              path: newPath,
              currentZone: det.zone,
            });
          } else {
            updatedMap.set(id, {
              trackingId: id,
              className: det.className,
              firstSeen: now,
              lastSeen: now,
              durationSeconds: 1,
              path: [center],
              currentZone: det.zone,
            });
          }
        });

        // Clean up tracks older than 6 seconds
        Array.from(updatedMap.entries()).forEach(([id, trk]) => {
          if (now - trk.lastSeen > 6000) {
            updatedMap.delete(id);
          }
        });

        trackingMapRef.current = updatedMap;
        setTrackingHistory(new Map(updatedMap));
      } catch (err) {
        console.error('YOLO inference loop error:', err);
      }

      const delay = Math.max(25, Math.round(1000 / (activeCamera.targetFps || 30)));
      if (isRunning) {
        setTimeout(loop, delay);
      }
    };

    loop();

    return () => {
      isRunning = false;
    };
  }, [activeCamera, isAIActive, scenario, isInitializing]);

  return {
    detections,
    inferenceTimeMs,
    fps,
    trackingHistory: Array.from(trackingHistory.values()),
    isInitializing,
  };
}
