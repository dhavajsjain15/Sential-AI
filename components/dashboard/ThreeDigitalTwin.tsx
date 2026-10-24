'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Edges, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useEmergencyStore, IncidentData } from '@/store/useEmergencyStore';
import { FsmStateUpdate } from './AdaptiveVerificationEngine';

interface RoomData {
  id: string;
  name: string;
  status: 'normal' | 'warning' | 'critical';
  temp: string;
  lastReading: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// --- HIGH-DETAIL 3D FURNITURE & ARCHITECTURAL PROPS ---

const LuxuryBed = ({ position, rotation = [0, 0, 0], color = '#1e293b' }: any) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.8, 0.7, 4.8]} />
      <meshStandardMaterial color="#0f172a" />
    </mesh>
    <mesh position={[0, 0.8, 0.1]} castShadow receiveShadow>
      <boxGeometry args={[3.5, 0.7, 4.2]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[-1, 1.2, -1.5]} castShadow>
      <boxGeometry args={[1.3, 0.25, 0.9]} />
      <meshStandardMaterial color="#f8fafc" />
    </mesh>
    <mesh position={[1, 1.2, -1.5]} castShadow>
      <boxGeometry args={[1.3, 0.25, 0.9]} />
      <meshStandardMaterial color="#f8fafc" />
    </mesh>

    {/* Horizontal Fallen Person Wireframe Bounding Volume */}
    <group position={[0.2, 0.95, 0.5]} rotation={[0, 0.4, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.4, 2.6]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.6} />
        <Edges color="#f87171" />
      </mesh>
      <Text position={[0, 0.6, 0]} fontSize={0.35} color="#fca5a5">
        FALLEN PERSON (HORIZ)
      </Text>
    </group>
  </group>
);

const LSofa = ({ position, rotation = [0, 0, 0], color = '#334155' }: any) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[6.5, 1, 2.6]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[2.3, 0.5, 2.6]} castShadow receiveShadow>
      <boxGeometry args={[1.9, 1, 2.6]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[0, 1.4, -0.95]} castShadow receiveShadow>
      <boxGeometry args={[6.5, 1.5, 0.7]} />
      <meshStandardMaterial color={color} />
    </mesh>
  </group>
);

const MediaCenter = ({ position, rotation = [0, 0, 0] }: any) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[6.5, 1, 1.5]} />
      <meshStandardMaterial color="#0f172a" />
      <Edges color="#3b82f6" />
    </mesh>
    <mesh position={[0, 2.8, 0]} castShadow>
      <boxGeometry args={[5.5, 3.2, 0.2]} />
      <meshStandardMaterial color="#020617" roughness={0.1} />
      <Edges color="#22d3ee" />
    </mesh>
  </group>
);

const DiningSet = ({ position, rotation = [0, 0, 0] }: any) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
      <boxGeometry args={[5.8, 0.2, 2.8]} />
      <meshStandardMaterial color="#1e293b" />
      <Edges color="#38bdf8" />
    </mesh>
  </group>
);

const ChefKitchen = ({ position, rotation = [0, 0, 0] }: any) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
      <boxGeometry args={[7.5, 1.8, 2.5]} />
      <meshStandardMaterial color="#0f172a" />
    </mesh>
    <mesh position={[0, 1.85, 0]} castShadow>
      <boxGeometry args={[7.8, 0.2, 2.7]} />
      <meshStandardMaterial color="#f8fafc" roughness={0.2} />
    </mesh>
  </group>
);

const VehicleBlock = ({ position, rotation = [0, 0, 0], color = '#0284c7' }: any) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.4, 1.2, 6.8]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
    </mesh>
    <mesh position={[0, 1.8, -0.4]} castShadow>
      <boxGeometry args={[3, 1, 3.6]} />
      <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
    </mesh>
  </group>
);

const ServerRackTower = ({ position, rotation = [0, 0, 0], status = 'normal' }: any) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[2, 5, 2]} />
      <meshStandardMaterial color="#090d16" />
      <Edges color={status === 'critical' ? '#ef4444' : '#38bdf8'} />
    </mesh>
  </group>
);

const IndustrialMachine = ({ position, color = '#f59e0b' }: any) => (
  <group position={position}>
    <mesh position={[0, 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[4.5, 4, 5]} />
      <meshStandardMaterial color="#1e293b" />
      <Edges color={color} />
    </mesh>
  </group>
);

const Wall = ({ position, args, color = '#0f172a', opacity = 0.65, borderColor = '#38bdf8' }: any) => (
  <mesh position={position} castShadow receiveShadow>
    <boxGeometry args={args} />
    <meshStandardMaterial color={color} transparent opacity={opacity} />
    <Edges color={borderColor} />
  </mesh>
);

// --- 2. VISUAL ROOM HIGHLIGHTING & PULSE SHADER USING USEFRAME ---
const DynamicPulsingBeacon = ({
  position,
  args,
  isIncidentZone,
  hasActiveIncident,
  room,
  selectedRoomId,
  onSelectRoom,
}: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const isSelected = selectedRoomId === room?.id;

  useFrame((state) => {
    if (isIncidentZone && materialRef.current) {
      // Dynamic pulsing translucent red warning beacon using sine wave
      const pulseOpacity = 0.35 + Math.sin(state.clock.elapsedTime * 8) * 0.25;
      materialRef.current.opacity = pulseOpacity;
    }
  });

  // Material color logic: dim non-affected zones if an incident is active
  let baseColor = '#0f172a';
  let opacity = hasActiveIncident && !isIncidentZone ? 0.2 : 0.65;
  let borderColor = isSelected ? '#22d3ee' : '#38bdf8';

  if (isIncidentZone) {
    baseColor = '#ef4444';
    borderColor = '#f87171';
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        if (room && onSelectRoom) {
          onSelectRoom(room);
        }
      }}
    >
      <planeGeometry args={args} />
      <meshStandardMaterial
        ref={materialRef}
        color={isSelected ? '#0284c7' : baseColor}
        transparent
        opacity={isIncidentZone ? 0.45 : opacity}
        roughness={0.3}
      />
      <Edges color={borderColor} />
    </mesh>
  );
};

// --- 3. DYNAMIC CAMERA TWEENING COMPONENT ---
const CameraRig = ({ activeIncident, isMacroView }: { activeIncident: IncidentData | null; isMacroView: boolean }) => {
  const controlsRef = useRef<any>(null);

  useFrame((state) => {
    if (!controlsRef.current) return;

    let targetPos = new THREE.Vector3(0, 0, 0);
    let camPos = new THREE.Vector3(0, 16, 19);

    if (activeIncident && !isMacroView) {
      targetPos.set(...activeIncident.position);
      camPos.set(
        activeIncident.position[0],
        activeIncident.position[1] + 10,
        activeIncident.position[2] + 12
      );
    }

    // Smooth LERP camera transition
    state.camera.position.lerp(camPos, 0.05);
    controlsRef.current.target.lerp(targetPos, 0.05);
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate={!activeIncident || isMacroView}
      autoRotateSpeed={0.4}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minPolarAngle={Math.PI / 6}
      minDistance={6}
      maxDistance={45}
    />
  );
};

// --- 4. 3D FLOATING INCIDENT COMMAND HUD (BILLBOARD OVERLAY) ---
const IncidentCommand3DHUD = ({ incident }: { incident: IncidentData }) => {
  const { resolveIncident } = useEmergencyStore();

  return (
    <Html position={[incident.position[0], 5.5, incident.position[2]]} center distanceFactor={18} zIndexRange={[100, 0]}>
      <div className="w-[320px] p-4 rounded-2xl bg-red-950/90 backdrop-blur-2xl border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] text-white space-y-3 font-mono">
        {/* Animated Badge Header */}
        <div className="flex items-center justify-between border-b border-red-500/50 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-black uppercase text-red-300 tracking-wider">
              🔴 INCIDENT DETECTED
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/80 border border-red-400 text-red-200 font-bold">
            {incident.severity}
          </span>
        </div>

        {/* Structured Live Telemetry Grid */}
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-red-300/70">Location:</span>
            <span className="font-bold text-white">{incident.zoneName} [{incident.zoneId.toUpperCase()}]</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-300/70">Event Vector:</span>
            <span className="font-bold text-amber-300">{incident.eventType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-300/70">Confidence:</span>
            <span className="font-bold text-emerald-400">{incident.confidence}% Certainty</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-300/70">Person Status:</span>
            <span className="font-bold text-red-300">{incident.personStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-300/70">Verification:</span>
            <span className="font-bold text-cyan-300">{incident.verificationStatus}</span>
          </div>
          <div className="flex justify-between border-t border-red-500/30 pt-1">
            <span className="text-red-300/70">Escalation:</span>
            <span className="font-bold text-rose-300">{incident.escalationTier}</span>
          </div>
        </div>

        {/* Action Controls directly on 3D Billboard */}
        <div className="flex gap-2 pt-1">
          <a
            href="tel:102"
            className="flex-1 py-1.5 text-center rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-[11px] shadow-lg transition-colors"
          >
            DISPATCH 102
          </a>
          <button
            onClick={() => resolveIncident()}
            className="px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
          >
            RESOLVE
          </button>
        </div>
      </div>
    </Html>
  );
};

// --- FACILITY LAYOUTS ---
const HouseLayout = ({ rooms, selectedRoomId, onSelectRoom, activeIncident }: any) => {
  const findRoom = (name: string) => rooms?.find((r: any) => r.name.toLowerCase().includes(name.toLowerCase()));
  const isIncidentIn = (zoneId: string) => activeIncident?.zoneId === zoneId;

  return (
    <group>
      <Wall position={[0, 1.6, -12]} args={[38, 3.2, 0.4]} />
      <Wall position={[0, 1.6, 12]} args={[38, 3.2, 0.4]} />
      <Wall position={[-19, 1.6, 0]} args={[0.4, 3.2, 24.4]} />
      <Wall position={[19, 1.6, 0]} args={[0.4, 3.2, 24.4]} />

      <Wall position={[-5, 1.6, -2]} args={[0.4, 3.2, 20]} />
      <Wall position={[7, 1.6, 2]} args={[0.4, 3.2, 20]} />
      <Wall position={[-12, 1.6, 0]} args={[14, 3.2, 0.4]} />
      <Wall position={[13, 1.6, -2]} args={[12, 3.2, 0.4]} />

      {/* Living Room */}
      <DynamicPulsingBeacon
        position={[-12, 0.01, 6]}
        args={[13.5, 11.5]}
        isIncidentZone={isIncidentIn('h-2')}
        hasActiveIncident={!!activeIncident}
        room={findRoom('Living')}
        selectedRoomId={selectedRoomId}
        onSelectRoom={onSelectRoom}
      />
      <LSofa position={[-12, 0, 6]} rotation={[0, Math.PI / 2, 0]} />
      <MediaCenter position={[-17.5, 0, 6]} rotation={[0, Math.PI / 2, 0]} />
      <Text position={[-12, 0.1, 10.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1} color="#38bdf8">
        MAIN LIVING ROOM
      </Text>

      {/* Kitchen & Dining */}
      <DynamicPulsingBeacon
        position={[-12, 0.01, -6]}
        args={[13.5, 11.5]}
        isIncidentZone={isIncidentIn('h-1')}
        hasActiveIncident={!!activeIncident}
        room={findRoom('Kitchen')}
        selectedRoomId={selectedRoomId}
        onSelectRoom={onSelectRoom}
      />
      <ChefKitchen position={[-13, 0, -7]} />
      <DiningSet position={[-8, 0, -6]} />
      <Text position={[-12, 0.1, -1.8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1} color="#38bdf8">
        KITCHEN & DINING
      </Text>

      {/* Master Bedroom (Active Incident Alert Zone) */}
      <DynamicPulsingBeacon
        position={[1, 0.01, -6]}
        args={[11.5, 11.5]}
        isIncidentZone={isIncidentIn('h-3')}
        hasActiveIncident={!!activeIncident}
        room={findRoom('Bedroom')}
        selectedRoomId={selectedRoomId}
        onSelectRoom={onSelectRoom}
      />
      <LuxuryBed position={[1, 0, -7]} />
      <Text position={[1, 0.1, -1.8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1} color="#38bdf8">
        MASTER BEDROOM
      </Text>

      {/* Guest Suite */}
      <DynamicPulsingBeacon
        position={[1, 0.01, 6]}
        args={[11.5, 11.5]}
        isIncidentZone={isIncidentIn('h-5')}
        hasActiveIncident={!!activeIncident}
        room={findRoom('Bathroom') || findRoom('Guest')}
        selectedRoomId={selectedRoomId}
        onSelectRoom={onSelectRoom}
      />
      <Text position={[1, 0.1, 10.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1} color="#38bdf8">
        GUEST SUITE
      </Text>

      {/* Garage */}
      <DynamicPulsingBeacon
        position={[13, 0.01, 5]}
        args={[11.5, 13.5]}
        isIncidentZone={isIncidentIn('h-4')}
        hasActiveIncident={!!activeIncident}
        room={findRoom('Garage')}
        selectedRoomId={selectedRoomId}
        onSelectRoom={onSelectRoom}
      />
      <VehicleBlock position={[13, 0, 5]} color="#dc2626" />
      <Text position={[13, 0.1, 10.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1} color="#ef4444">
        GARAGE (THERMAL OVERHEAT)
      </Text>
    </group>
  );
};

const OfficeLayout = ({ rooms, selectedRoomId, onSelectRoom, activeIncident }: any) => {
  const findRoom = (name: string) => rooms?.find((r: any) => r.name.toLowerCase().includes(name.toLowerCase()));
  const isIncidentIn = (zoneId: string) => activeIncident?.zoneId === zoneId;

  return (
    <group>
      <Wall position={[0, 1.6, -12]} args={[38, 3.2, 0.4]} />
      <Wall position={[0, 1.6, 12]} args={[38, 3.2, 0.4]} />
      <Wall position={[-19, 1.6, 0]} args={[0.4, 3.2, 24.4]} />
      <Wall position={[19, 1.6, 0]} args={[0.4, 3.2, 24.4]} />

      <DynamicPulsingBeacon
        position={[-12, 0.01, -6]}
        args={[13.5, 11.5]}
        isIncidentZone={isIncidentIn('o-1')}
        hasActiveIncident={!!activeIncident}
        room={findRoom('Server')}
        selectedRoomId={selectedRoomId}
        onSelectRoom={onSelectRoom}
      />
      <ServerRackTower position={[-15, 0, -7]} status="critical" />
      <ServerRackTower position={[-12, 0, -7]} status="critical" />
      <Text position={[-12, 0.1, -1.2]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1} color="#ef4444">
        SERVER ROOM B2
      </Text>

      <DynamicPulsingBeacon
        position={[7, 0.01, 5]}
        args={[23.5, 13.5]}
        isIncidentZone={isIncidentIn('o-2')}
        hasActiveIncident={!!activeIncident}
        room={findRoom('Workspace')}
        selectedRoomId={selectedRoomId}
        onSelectRoom={onSelectRoom}
      />
      <Text position={[7, 0.1, 10.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1} color="#38bdf8">
        OPEN WORKSPACE
      </Text>
    </group>
  );
};

const FactoryLayout = ({ rooms, selectedRoomId, onSelectRoom, activeIncident }: any) => {
  const findRoom = (name: string) => rooms?.find((r: any) => r.name.toLowerCase().includes(name.toLowerCase()));
  const isIncidentIn = (zoneId: string) => activeIncident?.zoneId === zoneId;

  return (
    <group>
      <Wall position={[0, 1.8, -12]} args={[38, 3.6, 0.4]} />
      <Wall position={[0, 1.8, 12]} args={[38, 3.6, 0.4]} />
      <DynamicPulsingBeacon
        position={[-9.5, 0.01, 6]}
        args={[18.5, 11.5]}
        isIncidentZone={isIncidentIn('f-3')}
        hasActiveIncident={!!activeIncident}
        room={findRoom('High-Volts')}
        selectedRoomId={selectedRoomId}
        onSelectRoom={onSelectRoom}
      />
      <IndustrialMachine position={[-9.5, 0, 6]} color="#ef4444" />
      <Text position={[-9.5, 0.1, 10.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1} color="#ef4444">
        HIGH-VOLTAGE GRID
      </Text>
    </group>
  );
};

const SchoolLayout = ({ rooms, selectedRoomId, onSelectRoom, activeIncident }: any) => {
  const findRoom = (name: string) => rooms?.find((r: any) => r.name.toLowerCase().includes(name.toLowerCase()));
  const isIncidentIn = (zoneId: string) => activeIncident?.zoneId === zoneId;

  return (
    <group>
      <Wall position={[0, 1.6, -12]} args={[38, 3.2, 0.4]} />
      <Wall position={[0, 1.6, 12]} args={[38, 3.2, 0.4]} />
      <DynamicPulsingBeacon
        position={[-9.5, 0.01, -6]}
        args={[18.5, 11.5]}
        isIncidentZone={isIncidentIn('s-1')}
        hasActiveIncident={!!activeIncident}
        room={findRoom('Science')}
        selectedRoomId={selectedRoomId}
        onSelectRoom={onSelectRoom}
      />
      <Text position={[-9.5, 0.1, -1.8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1} color="#f59e0b">
        SCIENCE LAB 104
      </Text>
    </group>
  );
};

const ApartmentLayout = ({ rooms, selectedRoomId, onSelectRoom, activeIncident }: any) => {
  const findRoom = (name: string) => rooms?.find((r: any) => r.name.toLowerCase().includes(name.toLowerCase()));
  const isIncidentIn = (zoneId: string) => activeIncident?.zoneId === zoneId;

  return (
    <group>
      <Wall position={[0, 1.6, -12]} args={[38, 3.2, 0.4]} />
      <Wall position={[0, 1.6, 12]} args={[38, 3.2, 0.4]} />
      <DynamicPulsingBeacon
        position={[9.5, 0.01, -6]}
        args={[18.5, 11.5]}
        isIncidentZone={isIncidentIn('a-2')}
        hasActiveIncident={!!activeIncident}
        room={findRoom('HVAC')}
        selectedRoomId={selectedRoomId}
        onSelectRoom={onSelectRoom}
      />
      <IndustrialMachine position={[9.5, 0, -6]} color="#ef4444" />
      <Text position={[9.5, 0.1, -1.8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1} color="#ef4444">
        HVAC CENTRAL PLANT
      </Text>
    </group>
  );
};

// --- MAIN 3D SCENE COMPONENT ---
export function ThreeDigitalTwinScene({
  activeType,
  rooms,
  selectedRoomId,
  onSelectRoom,
}: {
  activeType: string;
  rooms?: RoomData[];
  selectedRoomId?: string | null;
  onSelectRoom?: (room: RoomData) => void;
}) {
  const { activeIncident, isMacroView } = useEmergencyStore();

  return (
    <Canvas shadows camera={{ position: [0, 16, 19], fov: 42 }}>
      <color attach="background" args={['#020617']} />

      <ambientLight intensity={0.8} />
      <directionalLight position={[20, 35, 20]} intensity={2} castShadow />
      <spotLight position={[-20, 30, -20]} intensity={1.5} color="#38bdf8" />

      {/* Grid Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#090d16" />
      </mesh>
      <gridHelper args={[80, 80, '#1e293b', '#0f172a']} />

      {/* Dynamic Camera Tweening Rig */}
      <CameraRig activeIncident={activeIncident} isMacroView={isMacroView} />

      <group position={[0, 0.1, 0]} scale={[1.25, 1.25, 1.25]}>
        {activeType === 'House' && (
          <HouseLayout
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={onSelectRoom}
            activeIncident={activeIncident}
          />
        )}
        {activeType === 'Office' && (
          <OfficeLayout
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={onSelectRoom}
            activeIncident={activeIncident}
          />
        )}
        {activeType === 'Factory' && (
          <FactoryLayout
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={onSelectRoom}
            activeIncident={activeIncident}
          />
        )}
        {activeType === 'School' && (
          <SchoolLayout
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={onSelectRoom}
            activeIncident={activeIncident}
          />
        )}
        {activeType === 'Apartment' && (
          <ApartmentLayout
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={onSelectRoom}
            activeIncident={activeIncident}
          />
        )}
      </group>

      {/* 3D Floating Incident Command HUD Billboard */}
      {activeIncident && <IncidentCommand3DHUD incident={activeIncident} />}

      <Environment preset="city" />
      <ContactShadows opacity={0.6} scale={50} blur={2.5} far={20} />
    </Canvas>
  );
}
