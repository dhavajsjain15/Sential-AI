'use client';

import React, { useState } from 'react';
import { CameraConfig, CameraType, RiskZoneType } from '../types';
import { Film, Plus, Radio, Wifi, ShieldAlert } from 'lucide-react';

interface CameraSelectorProps {
  cameras: CameraConfig[];
  activeCameraId: string;
  onSelectCamera: (id: string) => void;
  onAddCamera?: (camera: CameraConfig) => void;
}

export function CameraSelector({
  cameras,
  activeCameraId,
  onSelectCamera,
  onAddCamera,
}: CameraSelectorProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newId, setNewId] = useState('CAM-009');
  const [newName, setNewName] = useState('New Edge Surveillance Unit');
  const [newType, setNewType] = useState<CameraType>('rtsp');
  const [newUrl, setNewUrl] = useState('rtsp://192.168.1.109:554/live/ch1');
  const [newZone, setNewZone] = useState<RiskZoneType>('Warehouse');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddCamera) {
      onAddCamera({
        id: newId.toUpperCase(),
        name: newName,
        type: newType,
        streamUrl: newUrl,
        zone: newZone,
        resolution: newType === 'webcam' ? '1280×720 (HD Webcam)' : '1920×1080 (Full HD)',
        targetFps: 30,
        status: 'online',
        bitrateKbps: 7800,
        uptimeSeconds: 10,
      });
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
          <Film className="w-4 h-4 text-[#22D3EE]" />
          Available Telemetry Edge Streams ({cameras.length})
        </span>
        {onAddCamera && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-[#3B82F6]/20 border border-white/10 hover:border-[#3B82F6]/50 text-xs font-mono text-white flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#22D3EE]" />
            Provision Stream / Webcam
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {cameras.map((cam) => {
          const isSelected = cam.id === activeCameraId;
          return (
            <button
              key={cam.id}
              onClick={() => onSelectCamera(cam.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#3B82F6]/25 border-[#3B82F6] text-white shadow-xl shadow-[#3B82F6]/20 scale-[1.02]'
                  : 'bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="relative w-10 h-10 rounded-xl bg-[#020617] border border-white/10 flex items-center justify-center shrink-0">
                <Film className={`w-4 h-4 ${isSelected ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}`} />
                <span
                  className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                    cam.status === 'online' ? 'bg-[#22C55E]' : cam.status === 'reconnecting' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                  }`}
                />
              </div>
              <div className="truncate">
                <span className="font-heading font-semibold text-xs block truncate text-white">
                  {cam.name}
                </span>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block truncate">
                  {cam.id} • {cam.zone}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Provision Stream Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#020617] border border-white/20 space-y-4 shadow-2xl">
            <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#22D3EE]" />
              Provision New Edge Camera / Stream
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[#94A3B8] block mb-1">Camera ID / Identifier</label>
                <input
                  required
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="text-[#94A3B8] block mb-1">Stream Name / Location</label>
                <input
                  required
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Protocol Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CameraType)}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="rtsp">RTSP Stream</option>
                    <option value="ip">IP Camera (MJPEG)</option>
                    <option value="esp32-cam">ESP32-CAM Node</option>
                    <option value="webcam">Operator Webcam</option>
                    <option value="usb">USB Industrial Cam</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Risk Zone Assignment</label>
                  <select
                    value={newZone}
                    onChange={(e) => setNewZone(e.target.value as RiskZoneType)}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Entrance">Entrance</option>
                    <option value="Restricted Area">Restricted Area</option>
                    <option value="Factory Floor">Factory Floor</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Balcony">Balcony</option>
                    <option value="Garage">Garage</option>
                    <option value="Bedroom">Bedroom</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[#94A3B8] block mb-1">Stream URL / Endpoint URI</label>
                <input
                  required
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-bold shadow-lg"
                >
                  Provision Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
