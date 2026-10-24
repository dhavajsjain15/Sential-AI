'use client';

import { useState, useEffect, useCallback } from 'react';
import { CameraConfig, CameraStatus } from '../types';
import { CameraManager } from './CameraManager';

export function useCameraManager() {
  const [cameras, setCameras] = useState<CameraConfig[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string>('CAM-001');

  useEffect(() => {
    const mgr = CameraManager.getInstance();
    const unsubscribe = mgr.subscribe((list) => {
      setCameras(list);
    });
    return () => unsubscribe();
  }, []);

  const activeCamera = cameras.find((c) => c.id === activeCameraId) || cameras[0] || null;

  const selectCamera = useCallback((id: string) => {
    setActiveCameraId(id);
  }, []);

  const reconnectCamera = useCallback(async (id: string) => {
    const mgr = CameraManager.getInstance();
    await mgr.simulateReconnect(id);
  }, []);

  const setCameraStatus = useCallback((id: string, status: CameraStatus, error?: string) => {
    CameraManager.getInstance().setStatus(id, status, error);
  }, []);

  const addCamera = useCallback((config: CameraConfig) => {
    CameraManager.getInstance().addOrUpdateCamera(config);
  }, []);

  const removeCamera = useCallback((id: string) => {
    CameraManager.getInstance().removeCamera(id);
  }, []);

  return {
    cameras,
    activeCamera,
    activeCameraId,
    selectCamera,
    reconnectCamera,
    setCameraStatus,
    addCamera,
    removeCamera,
  };
}
