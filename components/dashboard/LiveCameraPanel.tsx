'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Eye, Radio, ShieldCheck, AlertTriangle, Maximize2, RefreshCw, Cpu, Film, Sparkles, Filter, Video, BarChart2, ShieldAlert } from 'lucide-react';
import {
  CameraConfig,
  Detection,
  ObjectTrackingData,
  RiskZoneType,
  VideoSnapshot,
  RecordingState,
} from '@/vision/types';
import { useCameraManager } from '@/vision/camera/useCameraManager';
import { useYoloEngine } from '@/vision/models/useYoloEngine';
import { SimulationScenario } from '@/vision/models/SimulatedYoloModel';
import { EventEngine } from '@/vision/events/EventEngine';
import { AlertRulesEngine } from '@/vision/events/AlertRulesEngine';
import { computeVisionAnalytics } from '@/vision/utils/analyticsHelpers';
import { CameraToolbar, GridLayoutMode } from '@/vision/streams/CameraToolbar';
import { CameraSelector } from '@/vision/streams/CameraSelector';
import { CameraGrid } from '@/vision/streams/CameraGrid';
import { SnapshotGallery } from '@/vision/detectors/SnapshotGallery';
import { StreamStatus } from '@/vision/streams/StreamStatus';
import { RecordingIndicator } from '@/vision/streams/RecordingIndicator';
import { HardwareWebcamOverlay } from '@/vision/streams/HardwareWebcamOverlay';

export function LiveCameraPanel() {
  const {
    cameras,
    activeCamera,
    activeCameraId,
    selectCamera,
    reconnectCamera,
    addCamera,
  } = useCameraManager();

  const [isAIActive, setIsAIActive] = useState(true);
  const [scenario, setScenario] = useState<SimulationScenario>('Normal Surveillance');
  const [selectedZone, setSelectedZone] = useState<RiskZoneType | 'All'>('All');
  const [layoutMode, setLayoutMode] = useState<GridLayoutMode>('1x1');
  const [activeTab, setActiveTab] = useState<'stream' | 'webcam' | 'snapshots' | 'analytics' | 'rules'>('webcam');

  // Recording State
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    elapsedSeconds: 0,
    fileSizeMb: 0,
    autoTriggered: false,
    cloudUploadStatus: 'idle',
  });

  // Snapshots State
  const [snapshots, setSnapshots] = useState<VideoSnapshot[]>([]);

  // Run YOLO Inference loop on active camera
  const { detections, inferenceTimeMs, fps, trackingHistory } = useYoloEngine(
    activeCamera || cameras[0],
    isAIActive,
    scenario
  );

  // Map detections per camera for grid display
  const [detectionsByCam, setDetectionsByCam] = useState<Map<string, Detection[]>>(new Map());
  const [trackingByCam, setTrackingByCam] = useState<Map<string, ObjectTrackingData[]>>(new Map());

  useEffect(() => {
    if (activeCamera?.id) {
      setDetectionsByCam((prev) => {
        const next = new Map(prev);
        next.set(activeCamera.id, detections);
        return next;
      });
    }
  }, [activeCamera?.id, detections]);

  // Event Engine & Alert Rules evaluation every time detections update
  const [triggeredAlerts, setTriggeredAlerts] = useState<any[]>([]);
  useEffect(() => {
    if (activeCamera && detections.length > 0) {
      const eventEngine = EventEngine.getInstance();
      const newEvents = eventEngine.processDetections(detections, activeCamera);

      const rulesEngine = AlertRulesEngine.getInstance();
      const newAlerts = rulesEngine.evaluateAll(detections, eventEngine.getTimeline(), activeCamera);
      if (newAlerts && newAlerts.length > 0) {
        setTriggeredAlerts((prev) => [...newAlerts, ...prev].slice(0, 20));

        // Auto-trigger recording on critical incidents
        const isCritical = newAlerts.some((a) => a.severity === 'critical');
        if (isCritical && !recordingState.isRecording) {
          setRecordingState({
            isRecording: true,
            cameraId: activeCamera.id,
            startTime: Date.now(),
            elapsedSeconds: 0,
            fileSizeMb: 0.1,
            autoTriggered: true,
            cloudUploadStatus: 'uploading',
          });
        }
      }
    }
  }, [activeCamera, detections]);

  // Recording timer tick
  useEffect(() => {
    if (!recordingState.isRecording) return;
    const interval = setInterval(() => {
      setRecordingState((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
        fileSizeMb: Number((prev.fileSizeMb + 0.45).toFixed(2)),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [recordingState.isRecording]);

  const handleToggleRecording = () => {
    if (recordingState.isRecording) {
      setRecordingState((prev) => ({
        ...prev,
        isRecording: false,
        cloudUploadStatus: 'synced',
      }));
    } else {
      setRecordingState({
        isRecording: true,
        cameraId: activeCamera?.id,
        startTime: Date.now(),
        elapsedSeconds: 0,
        fileSizeMb: 0.1,
        autoTriggered: false,
        cloudUploadStatus: 'uploading',
      });
    }
  };

  const handleCaptureSnapshot = useCallback((cam?: CameraConfig, dets?: Detection[]) => {
    const targetCam = cam || activeCamera || cameras[0];
    const targetDets = dets || detections;
    const maxScore = targetDets.reduce((acc, d) => Math.max(acc, d.riskContribution), 0);

    const newSnap: VideoSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: Date.now(),
      cameraId: targetCam.id,
      cameraName: targetCam.name,
      zone: targetCam.zone,
      riskScore: maxScore || 15,
      imageUrl: '/assets/simulated-snapshot.jpg',
      detectionsCount: targetDets.length,
      triggerType: maxScore >= 80 ? 'Critical Incident' : 'Manual Capture',
    };
    setSnapshots((prev) => [newSnap, ...prev]);
  }, [activeCamera, cameras, detections]);

  // Filter cameras by selected zone
  const filteredCameras = cameras.filter(
    (c) => selectedZone === 'All' || c.zone === selectedZone
  );

  // Compute vision analytics across all telemetry
  const analyticsSummary = computeVisionAnalytics(
    EventEngine.getInstance().getTimeline(),
    cameras,
    detections
  );

  return (
    <div className="space-y-6">
      {/* Top Main Panel Container */}
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#22D3EE]">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-white tracking-tight flex items-center gap-2">
                Live AI Edge Vision Stream & Multi-Modal Overlay
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
              </h2>
              <p className="text-xs font-mono text-[#94A3B8]">
                {activeCamera?.id || 'CAM-001'} | {activeCamera?.name || 'Main Lobby'} — YOLOv8 XAI Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RecordingIndicator recordingState={recordingState} />
            <button
              onClick={() => setIsAIActive(!isAIActive)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                isAIActive
                  ? 'bg-[#22C55E]/20 border-[#22C55E]/50 text-[#22C55E] shadow-lg shadow-[#22C55E]/20'
                  : 'bg-white/5 border-white/10 text-[#94A3B8]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              AI VISION: {isAIActive ? 'ACTIVE' : 'BYPASS'}
            </button>
            <span className="px-2.5 py-1.5 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> REC
            </span>
          </div>
        </div>

        {/* Modular Camera Toolbar */}
        <CameraToolbar
          isAIActive={isAIActive}
          onToggleAI={() => setIsAIActive(!isAIActive)}
          scenario={scenario}
          onSelectScenario={(sc) => setScenario(sc)}
          selectedZone={selectedZone}
          onSelectZone={(zn) => setSelectedZone(zn)}
          layoutMode={layoutMode}
          onSelectLayoutMode={(md) => setLayoutMode(md)}
          isRecording={recordingState.isRecording}
          onToggleRecording={handleToggleRecording}
          onCaptureSnapshot={() => handleCaptureSnapshot()}
        />

        {/* Tab Switcher for Streams, Snapshots, Analytics & Rules */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('webcam')}
            className={`px-4 py-2 rounded-xl font-heading font-semibold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'webcam'
                ? 'bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] text-white shadow-lg shadow-[#22D3EE]/20 scale-105'
                : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10'
            }`}
          >
            <Camera className="w-3.5 h-3.5 animate-pulse text-[#22D3EE]" />
            Hardware Webcam (Live Demo Overlay)
          </button>
          <button
            onClick={() => setActiveTab('stream')}
            className={`px-4 py-2 rounded-xl font-heading font-semibold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'stream'
                ? 'bg-[#3B82F6] text-white shadow-lg'
                : 'bg-white/5 text-[#94A3B8] hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Surveillance Grid ({layoutMode})
          </button>
          <button
            onClick={() => setActiveTab('snapshots')}
            className={`px-4 py-2 rounded-xl font-heading font-semibold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'snapshots'
                ? 'bg-[#3B82F6] text-white shadow-lg'
                : 'bg-white/5 text-[#94A3B8] hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Forensic Snapshots ({snapshots.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl font-heading font-semibold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#3B82F6] text-white shadow-lg'
                : 'bg-white/5 text-[#94A3B8] hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Vision Analytics
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl font-heading font-semibold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'rules'
                ? 'bg-[#EF4444] text-white shadow-lg'
                : 'bg-white/5 text-[#94A3B8] hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Triggered Rules ({triggeredAlerts.length})
          </button>
        </div>

        {/* Tab Content 0: Hardware Webcam Input Layer with Visual Motion Detection Overlays */}
        {activeTab === 'webcam' && (
          <div className="space-y-4">
            <div className="h-[460px] sm:h-[540px] w-full">
              <HardwareWebcamOverlay
                isAIActive={isAIActive}
                riskScore={scenario === 'Critical Fire & Smoke' ? 88 : scenario === 'Person Fallen (Medical)' ? 76 : 34}
                cameraName="CAM-LOCAL-001 | Host Hardware Webcam"
                zoneName="Command Center / Demo Arena"
              />
            </div>
            <div className="p-4 rounded-2xl bg-[#020617] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#22D3EE]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
                <span>MediaDevices API active. Streaming local video frame at 1280x720p directly into YOLOv8 XAI canvas layer.</span>
              </div>
              <span className="text-[#94A3B8]">Safe Privacy Auto-Cleanup (`track.stop()`) on unmount</span>
            </div>
          </div>
        )}

        {/* Tab Content 1: Active Surveillance Stream Grid */}
        {activeTab === 'stream' && (
          <div className="space-y-6">
            {activeCamera && (
              <StreamStatus
                camera={activeCamera}
                activeDetectionsCount={detections.length}
              />
            )}

            <CameraGrid
              cameras={filteredCameras}
              detectionsByCamera={detectionsByCam}
              trackingByCamera={trackingByCam}
              fps={fps}
              inferenceTimeMs={inferenceTimeMs}
              isAIActive={isAIActive}
              layoutMode={layoutMode}
              onCaptureSnapshot={(cam, dets) => handleCaptureSnapshot(cam, dets)}
              onReconnect={(id) => reconnectCamera(id)}
            />

            <CameraSelector
              cameras={cameras}
              activeCameraId={activeCameraId}
              onSelectCamera={(id) => selectCamera(id)}
              onAddCamera={(newCam) => addCamera(newCam)}
            />
          </div>
        )}

        {/* Tab Content 2: Forensic Snapshot Vault */}
        {activeTab === 'snapshots' && (
          <SnapshotGallery
            snapshots={snapshots}
            onDelete={(id) => setSnapshots((prev) => prev.filter((s) => s.id !== id))}
            onClearAll={() => setSnapshots([])}
          />
        )}

        {/* Tab Content 3: Vision Analytics Summary */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#020617] border border-white/10 space-y-2">
              <span className="text-xs font-mono text-[#94A3B8] uppercase block">Most Active Camera</span>
              <h3 className="text-xl font-heading font-bold text-[#22D3EE]">
                {analyticsSummary.mostActiveCamera.cameraName}
              </h3>
              <p className="text-xs font-mono text-white">
                {analyticsSummary.mostActiveCamera.totalDetections} Total Detections Processed
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#020617] border border-white/10 space-y-2">
              <span className="text-xs font-mono text-[#94A3B8] uppercase block">Average XAI Confidence</span>
              <h3 className="text-xl font-heading font-bold text-[#22C55E]">
                {analyticsSummary.averageConfidence}%
              </h3>
              <p className="text-xs font-mono text-white">
                Bounding Box Precision across all 14 Classes
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#020617] border border-white/10 space-y-2">
              <span className="text-xs font-mono text-[#94A3B8] uppercase block">Hardware Uptime & Health</span>
              <h3 className="text-xl font-heading font-bold text-[#3B82F6]">
                {analyticsSummary.totalCamerasOnline} / {cameras.length} Online ({analyticsSummary.averageUptimePercentage}%)
              </h3>
              <p className="text-xs font-mono text-white">
                ESP32-CAM & Jetson Orin Edge Nodes
              </p>
            </div>
          </div>
        )}

        {/* Tab Content 4: Triggered Alert Rules Feed */}
        {activeTab === 'rules' && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#EF4444]">
              Real-Time Causal Alert Rule Log ({triggeredAlerts.length})
            </h3>
            {triggeredAlerts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center text-xs font-mono text-[#94A3B8]">
                No causal alert rules fired yet in this session. Try switching to "Critical Fire & Smoke" or "Person Fallen" scenario!
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {triggeredAlerts.map((alt, i) => (
                  <div
                    key={`${alt.ruleId}-${i}`}
                    className="p-3.5 rounded-2xl bg-[#020617] border border-[#EF4444]/40 flex items-center justify-between text-xs font-mono shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-4 h-4 text-[#EF4444] shrink-0" />
                      <div>
                        <span className="text-white font-bold block">{alt.ruleName}</span>
                        <span className="text-[11px] text-[#94A3B8]">{alt.reason}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#F59E0B] shrink-0">
                      {new Date(alt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
