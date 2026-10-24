'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Eye, Radio, ShieldAlert, Cpu, AlertTriangle, RefreshCw, Crosshair, Activity, HeartPulse } from 'lucide-react';
import { SimulationScenario } from '@/vision/models/SimulatedYoloModel';

export interface LiveCameraTelemetry {
  timestamp: string;
  totalRiskPercentage: number;
  fallRiskScore: number;
  motionScore: number;
  motionMultiplier: string;
  deltaDeviation: string;
  smokeRiskScore: number;
  intrusionScore: number;
  statusLabel: string;
  activeZone: string;
}

interface HardwareWebcamOverlayProps {
  isAIActive?: boolean;
  activeScenario?: SimulationScenario;
  riskScore?: number; // 0 - 100
  cameraName?: string;
  zoneName?: string;
  onWebcamStatusChange?: (isActive: boolean) => void;
  onLiveTelemetryUpdate?: (telemetry: LiveCameraTelemetry) => void;
}

interface MotionCluster {
  centerX: number; // normalized 0 to 1
  centerY: number; // normalized 0 to 1
  width: number;   // normalized 0 to 1
  height: number;  // normalized 0 to 1
  motionIntensity: number; // 0 to 100
  aspectRatio: number; // W / H
}

export function HardwareWebcamOverlay({
  isAIActive = true,
  activeScenario = 'Normal Surveillance',
  riskScore = 34,
  cameraName = 'CAM-LOCAL-001 | Host WebCam Unit',
  zoneName = 'Sector Alpha (Live Command Arena)',
  onWebcamStatusChange,
  onLiveTelemetryUpdate,
}: HardwareWebcamOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Offscreen canvas for real-time optical flow & frame differencing
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);
  const motionClusterRef = useRef<MotionCluster>({
    centerX: 0.5,
    centerY: 0.5,
    width: 0.35,
    height: 0.65,
    motionIntensity: 15,
    aspectRatio: 0.54,
  });

  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [motionMultiplier, setMotionMultiplier] = useState<string>('1.4x');
  const [deltaDeviation, setDeltaDeviation] = useState<string>('12%');
  const [liveSecondCounter, setLiveSecondCounter] = useState<number>(0);
  const [livePostureLabel, setLivePostureLabel] = useState<string>('Nominal Upright Posture');
  const [livePostureScore, setLivePostureScore] = useState<number>(12);

  // Derive risk status
  const effectiveRisk =
    activeScenario === 'Critical Fire & Smoke'
      ? 92
      : activeScenario === 'Person Fallen (Medical)'
      ? 78
      : activeScenario === 'Intrusion & Weapon Alert'
      ? 85
      : Math.max(riskScore, livePostureScore);

  const riskStatus = effectiveRisk >= 71 ? 'HIGH' : effectiveRisk >= 31 ? 'MEDIUM' : 'LOW';

  const boundaryColorClass =
    riskStatus === 'HIGH'
      ? 'border-red-500/90 shadow-[0_0_35px_rgba(239,68,68,0.7)] animate-pulse'
      : riskStatus === 'MEDIUM'
      ? 'border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.5)]'
      : 'border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.3)]';

  const startWebcam = useCallback(async () => {
    try {
      setPermissionError(null);
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported in this environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsWebcamActive(true);
      if (onWebcamStatusChange) onWebcamStatusChange(true);
    } catch (err: any) {
      console.warn('HardwareWebcamOverlay: Webcam permission denied or unavailable. Graceful fallback active.', err);
      setPermissionError(err.message || 'Webcam permission denied — rendering AI simulation loop fallback');
      setIsWebcamActive(false);
      if (onWebcamStatusChange) onWebcamStatusChange(false);
    }
  }, [onWebcamStatusChange]);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (err) {
          console.error('Error stopping media track:', err);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
    if (onWebcamStatusChange) onWebcamStatusChange(false);
  }, [onWebcamStatusChange]);

  useEffect(() => {
    startWebcam();
    return () => {
      stopWebcam();
    };
  }, [startWebcam, stopWebcam]);

  // Real-Time 1-Second (1000ms) Optical Flow & Frame-Differencing Loop
  useEffect(() => {
    // Initialize offscreen canvas if not present
    if (!offscreenCanvasRef.current && typeof document !== 'undefined') {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 160;
      offCanvas.height = 90;
      offscreenCanvasRef.current = offCanvas;
    }

    const timer = setInterval(() => {
      setLiveSecondCounter((prev) => prev + 1);

      let calculatedMotionScore = 1.2;
      let calculatedDeltaPercent = 12;
      let calculatedFallPostureRisk = activeScenario === 'Person Fallen (Medical)' ? 78 : 10;
      let calculatedPostureText = activeScenario === 'Person Fallen (Medical)' ? 'PRONE POSTURE / FALL DETECTED' : 'Nominal Upright Posture';

      const video = videoRef.current;
      const offCanvas = offscreenCanvasRef.current;

      // REAL COMPUTER VISION FRAME DIFFERENCING WHEN HARDWARE WEBCAM IS ACTIVE
      if (isWebcamActive && video && offCanvas && video.readyState >= 2) {
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          // Draw video frame downsampled for ultra-fast real-time differencing
          offCtx.drawImage(video, 0, 0, 160, 90);
          const currImageData = offCtx.getImageData(0, 0, 160, 90);
          const currData = currImageData.data;
          const prevData = prevFrameDataRef.current;

          if (prevData && prevData.length === currData.length) {
            let changedPixels = 0;
            let sumX = 0;
            let sumY = 0;
            let minX = 160, maxX = 0;
            let minY = 90, maxY = 0;

            for (let i = 0; i < currData.length; i += 4) {
              const diffR = Math.abs(currData[i] - prevData[i]);
              const diffG = Math.abs(currData[i + 1] - prevData[i + 1]);
              const diffB = Math.abs(currData[i + 2] - prevData[i + 2]);
              const totalDiff = diffR + diffG + diffB;

              // Threshold for physical movement (ignores camera sensor noise)
              if (totalDiff > 45) {
                changedPixels++;
                const pixelIndex = i / 4;
                const px = pixelIndex % 160;
                const py = Math.floor(pixelIndex / 160);

                sumX += px;
                sumY += py;
                if (px < minX) minX = px;
                if (px > maxX) maxX = px;
                if (py < minY) minY = py;
                if (py > maxY) maxY = py;
              }
            }

            const totalPixels = 160 * 90; // 14400
            const motionPercentage = (changedPixels / totalPixels) * 100;

            if (changedPixels > 40) {
              // We detected active physical movement!
              const normCenterX = (sumX / changedPixels) / 160;
              const normCenterY = (sumY / changedPixels) / 90;
              const normWidth = Math.max(0.18, Math.min(0.85, (maxX - minX) / 160));
              const normHeight = Math.max(0.22, Math.min(0.9, (maxY - minY) / 90));
              const aspect = normWidth / normHeight;

              // Smoothly blend centroid toward new physical motion location
              const oldCluster = motionClusterRef.current;
              const blend = 0.6;
              motionClusterRef.current = {
                centerX: oldCluster.centerX * (1 - blend) + normCenterX * blend,
                centerY: oldCluster.centerY * (1 - blend) + normCenterY * blend,
                width: oldCluster.width * (1 - blend) + normWidth * blend,
                height: oldCluster.height * (1 - blend) + normHeight * blend,
                motionIntensity: motionPercentage,
                aspectRatio: aspect,
              };

              // Compute real-time motion multiplier & deviation directly from pixel changes!
              calculatedMotionScore = Number((1.0 + Math.min(5.5, motionPercentage * 0.35)).toFixed(1));
              calculatedDeltaPercent = Math.min(96, Math.max(8, Math.round(motionPercentage * 2.4)));

              // AI Risky Posture & Fall Integration Logic:
              // 1. If bounding aspect ratio is wide (W > H * 1.1) -> Prone / Slouch / Floor Fall
              // 2. Or if subject centroid is dropping rapidly to the lower third (centerY > 0.68)
              if (aspect > 1.15 || normCenterY > 0.68 || activeScenario === 'Person Fallen (Medical)') {
                calculatedFallPostureRisk = Math.min(95, Math.max(68, Math.round(55 + aspect * 24 + (normCenterY - 0.5) * 40)));
                calculatedPostureText = '⚠️ RISKY POSTURE / SLOUCH FALL DETECTED';
              } else if (aspect > 0.85 || calculatedMotionScore > 3.2) {
                calculatedFallPostureRisk = Math.min(65, Math.max(35, Math.round(30 + aspect * 20)));
                calculatedPostureText = '🟡 ELEVATED POSTURE VARIANCE / RAPID MOTION';
              } else {
                calculatedFallPostureRisk = Math.round(8 + aspect * 10);
                calculatedPostureText = '🟢 Nominal Upright Posture';
              }
            } else {
              // Person is still in front of camera
              calculatedMotionScore = 1.1;
              calculatedDeltaPercent = Math.round(motionPercentage * 1.5) + 6;
              if (activeScenario !== 'Person Fallen (Medical)') {
                calculatedFallPostureRisk = 10;
                calculatedPostureText = '🟢 Nominal Upright Posture (Subject Stable)';
              }
            }
          }

          // Store current frame for next second's comparison
          prevFrameDataRef.current = new Uint8ClampedArray(currData);
        }
      } else {
        // Fallback simulation loop when webcam is offline / testing without camera
        const timeSec = Math.floor(Date.now() / 1000);
        const randomJitter = Math.sin(timeSec) * 3.5;
        const baseFallRisk = activeScenario === 'Person Fallen (Medical)' ? 78 : 12;
        calculatedFallPostureRisk = Math.min(100, Math.max(0, Math.round(baseFallRisk + randomJitter)));
        calculatedMotionScore = Number((1.2 + Math.abs(Math.sin(timeSec * 0.7)) * (activeScenario === 'Person Fallen (Medical)' ? 2.2 : 0.6)).toFixed(1));
        calculatedDeltaPercent = Math.round(14 + Math.abs(Math.cos(timeSec * 0.5)) * 30);
        if (activeScenario === 'Person Fallen (Medical)') {
          calculatedPostureText = '⚠️ PRONE POSTURE / SIMULATED FALL';
        } else {
          calculatedPostureText = '🟢 Nominal Upright Posture (Simulated)';
        }
      }

      const dynamicSmokeScore = activeScenario === 'Critical Fire & Smoke' ? 92 : 12;
      const dynamicIntrusionScore = activeScenario === 'Intrusion & Weapon Alert' ? 85 : 14;
      const totalCalculatedPercentage = Math.max(
        calculatedFallPostureRisk,
        dynamicSmokeScore,
        dynamicIntrusionScore,
        activeScenario === 'Normal Surveillance' ? 24 : 68
      );

      // --- VOICE ASSISTANT EMERGENCY PROTOCOL TRIGGER ---
      if (totalCalculatedPercentage >= 75) {
        const lastTrigger = (window as any)._lastVoiceAssistantTrigger || 0;
        if (Date.now() - lastTrigger > 120000) { // Only trigger once every 2 minutes max to prevent spam
          (window as any)._lastVoiceAssistantTrigger = Date.now();
          window.dispatchEvent(new CustomEvent('VOICE_ASSISTANT_TRIGGER'));
        }
      }

      setMotionMultiplier(`${calculatedMotionScore}x`);
      setDeltaDeviation(`${calculatedDeltaPercent}%`);
      setLivePostureScore(calculatedFallPostureRisk);
      setLivePostureLabel(calculatedPostureText);

      const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });

      if (onLiveTelemetryUpdate) {
        onLiveTelemetryUpdate({
          timestamp: nowStr,
          totalRiskPercentage: totalCalculatedPercentage,
          fallRiskScore: calculatedFallPostureRisk,
          motionScore: calculatedMotionScore,
          motionMultiplier: `${calculatedMotionScore}x`,
          deltaDeviation: `${calculatedDeltaPercent}%`,
          smokeRiskScore: dynamicSmokeScore,
          intrusionScore: dynamicIntrusionScore,
          statusLabel:
            totalCalculatedPercentage >= 71
              ? 'CRITICAL RISK ARMED'
              : totalCalculatedPercentage >= 31
              ? 'ELEVATED WARNING'
              : 'NOMINAL SURVEILLANCE',
          activeZone: zoneName,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isWebcamActive, activeScenario, zoneName, onLiveTelemetryUpdate]);

  // Canvas drawing loop for bounding box annotations & real-time physical centroid tracking
  useEffect(() => {
    let animId: number;
    let tick = 0;

    const renderOverlay = () => {
      tick++;
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width = canvas.parentElement?.clientWidth || 640;
      const height = canvas.height = canvas.parentElement?.clientHeight || 360;

      ctx.clearRect(0, 0, width, height);

      if (!isAIActive) {
        animId = requestAnimationFrame(renderOverlay);
        return;
      }

      const cluster = motionClusterRef.current;
      const isFallen = activeScenario === 'Person Fallen (Medical)' || livePostureScore >= 68;

      // Compute bounding box coordinates based on REAL physical movement centroid when webcam active!
      let boxW = isWebcamActive ? Math.round(width * cluster.width) : isFallen ? 280 : 190;
      let boxH = isWebcamActive ? Math.round(height * cluster.height) : isFallen ? 120 : 250;
      
      // Ensure box dimensions stay clean and legible
      if (boxW < 130) boxW = 130;
      if (boxH < 130) boxH = 130;

      let boxX = isWebcamActive
        ? Math.round((width * cluster.centerX) - boxW / 2)
        : (width / 2) - boxW / 2 + Math.sin(tick * 0.03) * 45;
      let boxY = isWebcamActive
        ? Math.round((height * cluster.centerY) - boxH / 2)
        : (height / 2) - boxH / 2 + Math.cos(tick * 0.02) * 25;

      // Clamp bounding box inside video frame
      if (boxX < 10) boxX = 10;
      if (boxY < 30) boxY = 30;
      if (boxX + boxW > width - 10) boxX = width - boxW - 10;
      if (boxY + boxH > height - 10) boxY = height - boxH - 10;

      // 1. Draw Bounding Box 1: Real-Time Posture & Person Tracking
      ctx.strokeStyle = isFallen ? '#F59E0B' : riskStatus === 'HIGH' ? '#EF4444' : '#22C55E';
      ctx.lineWidth = isFallen ? 3 : 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.setLineDash([]);

      // Corner ticks for high-tech HUD look
      const tickLen = 16;
      ctx.strokeStyle = isFallen ? '#F59E0B' : '#22D3EE';
      ctx.lineWidth = 3;
      // Top-left
      ctx.beginPath(); ctx.moveTo(boxX, boxY + tickLen); ctx.lineTo(boxX, boxY); ctx.lineTo(boxX + tickLen, boxY); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(boxX + boxW - tickLen, boxY); ctx.lineTo(boxX + boxW, boxY); ctx.lineTo(boxX + boxW, boxY + tickLen); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(boxX, boxY + boxH - tickLen); ctx.lineTo(boxX, boxY + boxH); ctx.lineTo(boxX + tickLen, boxY + boxH); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(boxX + boxW - tickLen, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH - tickLen); ctx.stroke();

      // Bounding box label header
      ctx.fillStyle = isFallen ? 'rgba(245, 158, 11, 0.95)' : riskStatus === 'HIGH' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(34, 197, 94, 0.9)';
      const labelWidth = Math.max(boxW, isFallen ? 260 : 210);
      ctx.fillRect(boxX, boxY - 26, Math.min(width - boxX, labelWidth), 24);
      ctx.fillStyle = isFallen ? '#020617' : '#FFFFFF';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(
        isFallen ? `⚠️ ${livePostureLabel.toUpperCase()} (${livePostureScore}%)` : `Tracked: ${livePostureLabel}`,
        boxX + 6,
        boxY - 9
      );

      // 2. Draw Simulated Bounding Box 2: Smoke / Thermal Anomaly if Fire scenario
      if (activeScenario === 'Critical Fire & Smoke') {
        const smokeX = Math.max(10, boxX - 110);
        const smokeY = boxY + 60;
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(smokeX, smokeY, 140, 95);
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.fillRect(smokeX, smokeY - 24, 150, 22);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`🔥 SMOKE / FIRE: 92% RISK`, smokeX + 5, smokeY - 8);
      }

      // 3. Live Bounding Grid Crosshair centered over subject centroid
      const centerX = boxX + boxW / 2;
      const centerY = boxY + boxH / 2;
      ctx.strokeStyle = isFallen ? 'rgba(245, 158, 11, 0.8)' : 'rgba(59, 130, 246, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 25, centerY); ctx.lineTo(centerX + 25, centerY);
      ctx.moveTo(centerX, centerY - 25); ctx.lineTo(centerX, centerY + 25);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
      ctx.strokeStyle = isFallen ? 'rgba(245, 158, 11, 0.9)' : 'rgba(34, 211, 238, 0.7)';
      ctx.stroke();

      // 4. Live 1-Second Sensor Burn-in Overlay at Top-Center of Video
      ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
      ctx.fillRect(width / 2 - 195, 10, 390, 28);
      ctx.strokeStyle = isFallen ? '#F59E0B' : '#22D3EE';
      ctx.lineWidth = 1;
      ctx.strokeRect(width / 2 - 195, 10, 390, 28);
      ctx.fillStyle = isFallen ? '#F59E0B' : '#22D3EE';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(
        `⚡ [OPTICAL FLOW EVERY 1s] Posture Risk: ${livePostureScore}% | Vector: ${motionMultiplier}`,
        width / 2 - 187,
        28
      );

      animId = requestAnimationFrame(renderOverlay);
    };

    animId = requestAnimationFrame(renderOverlay);
    return () => cancelAnimationFrame(animId);
  }, [isAIActive, riskStatus, activeScenario, motionMultiplier, livePostureScore, livePostureLabel, isWebcamActive]);

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden bg-[#020617] border-2 transition-all duration-300 ${boundaryColorClass}`}>
      {/* 1. Live Video Element or Safe Simulation Fallback */}
      {isWebcamActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[#3B82F6]">
            <Camera className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#F59E0B] uppercase block">
              {permissionError || 'Hardware Webcam Offline — Simulation Active'}
            </span>
            <p className="text-[11px] font-mono text-[#94A3B8] max-w-md">
              Streaming high-fidelity synthetic optical feed loop. Click button below to connect hardware webcam for real-time physical motion vector tracking.
            </p>
          </div>
          <button
            onClick={startWebcam}
            className="px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Connect Hardware Webcam
          </button>
        </div>
      )}

      {/* 2. HTML Canvas Overlay for Bounding Boxes & Targeting Grid */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 3. "Activity Radar" Indicator (Top-Right) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/15 text-xs font-mono font-bold shadow-lg">
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${riskStatus === 'HIGH' ? 'bg-red-400' : riskStatus === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${riskStatus === 'HIGH' ? 'bg-red-500' : riskStatus === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
        </span>
        <span className="text-emerald-400 tracking-wider">MOTION TRACKING: ACTIVE</span>
      </div>

      {/* 4. Top-Left Camera Info Tag */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-white shadow-lg">
        <Radio className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse" />
        <span>{cameraName}</span>
        <span className="text-white/40">|</span>
        <span className="text-[11px] text-[#22C55E]">{zoneName}</span>
      </div>

      {/* 5. Telemetry Counter Overlay (Bottom-Left) */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 flex flex-wrap items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white shadow-xl">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Motion Multiplier: <strong className="text-white">{motionMultiplier}</strong></span>
        </div>
        <span className="text-white/30 hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5 text-[#22D3EE] font-bold">
          <Crosshair className="w-3.5 h-3.5" />
          <span>Delta Deviation: <strong className="text-white">{deltaDeviation}</strong></span>
        </div>
        <span className="text-white/30 hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
          <span>Posture Risk: <strong className="text-white">{livePostureScore}%</strong></span>
        </div>
        <span className="text-white/30 hidden sm:inline">•</span>
        <div className="flex items-center gap-1 text-[#94A3B8]">
          <span>FPS: <strong className="text-[#22C55E]">30</strong></span>
          <span className="ml-2">1s Ticks: <strong className="text-[#3B82F6]">#{liveSecondCounter}</strong></span>
        </div>
      </div>
    </div>
  );
}
