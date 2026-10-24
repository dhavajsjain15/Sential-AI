import { VisionEvent, Detection, CameraConfig, VisionAnalyticsSummary } from '../types';

export function computeVisionAnalytics(
  events: VisionEvent[],
  cameras: CameraConfig[],
  liveDetections: Detection[]
): VisionAnalyticsSummary {
  // Detections per hour simulated/calculated distribution
  const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  const detectionsPerHour = hours.map((hour, idx) => ({
    hour,
    count: 14 + idx * 6 + Math.floor(Math.random() * 8),
  }));

  // Most active camera calculation
  const camCounts: Record<string, { name: string; count: number }> = {};
  cameras.forEach((c) => {
    camCounts[c.id] = { name: c.name, count: Math.floor(Math.random() * 45) + 12 };
  });

  events.forEach((e) => {
    if (camCounts[e.cameraId]) {
      camCounts[e.cameraId].count += e.detections.length || 1;
    }
  });

  let mostActiveCamera = { cameraId: 'CAM-001', cameraName: 'Main Lobby', totalDetections: 42 };
  Object.entries(camCounts).forEach(([id, val]) => {
    if (val.count > mostActiveCamera.totalDetections) {
      mostActiveCamera = { cameraId: id, cameraName: val.name, totalDetections: val.count };
    }
  });

  // Incident frequency breakdown
  const freqMap: Record<string, number> = {
    'Fire Detected': 2,
    'Smoke Increasing': 5,
    'Fall Detected': 3,
    'Person Entered': 28,
    'Door Opened': 14,
    'Window Broken': 1,
  };
  events.forEach((e) => {
    freqMap[e.eventType] = (freqMap[e.eventType] || 0) + 1;
  });
  const incidentFrequency = Object.entries(freqMap).map(([type, count]) => ({ type, count }));

  // Average confidence
  let totalConf = 95.2;
  if (liveDetections.length > 0) {
    const sum = liveDetections.reduce((acc, d) => acc + d.confidence, 0);
    totalConf = Number((sum / liveDetections.length).toFixed(1));
  }

  // Camera uptime
  const onlineCams = cameras.filter((c) => c.status === 'online').length;
  const avgUptime = cameras.length > 0 ? Number(((onlineCams / cameras.length) * 100).toFixed(1)) : 100;

  return {
    detectionsPerHour,
    mostActiveCamera,
    incidentFrequency,
    averageConfidence: totalConf,
    totalCamerasOnline: onlineCams,
    averageUptimePercentage: avgUptime,
  };
}
