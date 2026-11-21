import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// Realistic Tumakuru City Arteries & Roads
// Primary Arteries: B.H. Road (NH 206 / NH 48 corridor), Kunigal Road, Gubbi Road, Ring Road
const ROAD_LAYOUT = {
  mainEastWest: { z: 0, width: 4.2 },     // B.H. Road (Tumakuru Spine)
  mainNorthSouth: { x: 0, width: 4.2 },   // Ring Road / Kunigal Road
  parallelAvenue1: { z: 12, width: 2.8 }, // SS Puram / Ashok Nagar Main Road
  parallelAvenue2: { z: -12, width: 2.8 },// Kyathsandra / Batawadi Road
  crossStreet1: { x: 12, width: 2.8 },    // Mandipet / Market Road
  crossStreet2: { x: -12, width: 2.8 }    // SIT College Road
};

// Realistic Tumakuru Buildings aligned cleanly alongside roads in blocks (Ward blocks)
function CityBlocks() {
  const blocks = useMemo(() => {
    const list: Array<{
      x: number;
      z: number;
      width: number;
      depth: number;
      height: number;
      color: string;
      roofColor: string;
      windowColor: string;
      hasAntenna?: boolean;
      landmarkName?: string;
    }> = [];

    // Define 4 major quadrants of Tumakuru (NW, NE, SW, SE)
    // Plus intermediate plots strictly OUTSIDE the roads so buildings flank the asphalt streets
    const zones = [
      // SW Quadrant (SIT / SS Puram side)
      { minX: -22, maxX: -2.5, minZ: 2.5, maxZ: 22, name: 'S.S. Puram & S.I.T. Area' },
      // SE Quadrant (Mandipet & Town Hall side)
      { minX: 2.5, maxX: 22, minZ: 2.5, maxZ: 22, name: 'Mandipet Commercial Ward' },
      // NW Quadrant (Amanikere & Gandhi Nagar side)
      { minX: -22, maxX: -2.5, minZ: -22, maxZ: -2.5, name: 'Gandhi Nagar & Govt Complex' },
      // NE Quadrant (Batawadi / Kyathsandra NH side)
      { minX: 2.5, maxX: 22, minZ: -22, maxZ: -2.5, name: 'Batawadi & Kyathsandra Corridor' }
    ];

    // Seed realistic buildings arranged in parcels
    zones.forEach((zone, zIdx) => {
      // Create sub-lots along streets
      for (let rx = zone.minX + 1.5; rx <= zone.maxX - 2; rx += 3.8) {
        for (let rz = zone.minZ + 1.5; rz <= zone.maxZ - 2; rz += 3.8) {
          // Avoid secondary street lanes
          if (Math.abs(rz - 12) < 2.2 || Math.abs(rz - (-12)) < 2.2) continue;
          if (Math.abs(rx - 12) < 2.2 || Math.abs(rx - (-12)) < 2.2) continue;

          // Keep central circle roundabout clear for landmark
          if (Math.sqrt(rx * rx + rz * rz) < 6.5) continue;

          // Building footprint and heights
          const isCorner = Math.abs(rx) < 5 || Math.abs(rz) < 5;
          const height = isCorner ? (3.5 + Math.random() * 4) : (1.6 + Math.random() * 3.2);
          const width = 2.0 + (Math.random() * 1.0);
          const depth = 2.0 + (Math.random() * 1.0);

          // Realistic architectural palette: Modern civic steel-navy, stone concrete, cyan-accented smart glass
          const palettes = [
            { base: '#0e1d2e', roof: '#1a324b', window: '#38bdf8' },
            { base: '#132338', roof: '#233d5a', window: '#06b6d4' },
            { base: '#0b1625', roof: '#16283d', window: '#60a5fa' },
            { base: '#17283c', roof: '#274261', window: '#2dd4bf' }
          ];
          // Always use a non-negative index (JS % can return negative for negative numbers)
          const rawIdx = (Math.floor(rx + rz) + zIdx);
          const choice = palettes[((rawIdx % palettes.length) + palettes.length) % palettes.length];

          // Special Tumakuru landmarks on prominent street corners
          let landmarkName: string | undefined = undefined;
          if (rx > 3 && rx < 8 && rz > 3 && rz < 8) landmarkName = "Tumakuru City Corporation (CC)";
          else if (rx < -4 && rx > -9 && rz > 4 && rz < 9) landmarkName = "S.S. Puram Civic Center";
          else if (rx > 3 && rx < 8 && rz < -4 && rz > -9) landmarkName = "District Civil Hospital";
          else if (rx < -4 && rx > -9 && rz < -4 && rz > -9) landmarkName = "Amanikere Lake Promenade";

          list.push({
            x: rx,
            z: rz,
            width,
            depth,
            height,
            color: choice.base,
            roofColor: choice.roof,
            windowColor: choice.window,
            hasAntenna: height > 4.5,
            landmarkName
          });
        }
      }
    });

    return list;
  }, []);

  return (
    <group>
      {blocks.map((b, idx) => (
        <group key={idx} position={[b.x, b.height / 2, b.z]}>
          {/* Main Building Structure */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Realistic Window Ribbons / Floors */}
          <mesh position={[0, 0, b.depth / 2 + 0.02]}>
            <planeGeometry args={[b.width * 0.82, b.height * 0.75]} />
            <meshStandardMaterial
              color="#041221"
              emissive={b.windowColor}
              emissiveIntensity={0.25}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[b.width / 2 + 0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[b.depth * 0.82, b.height * 0.75]} />
            <meshStandardMaterial
              color="#041221"
              emissive={b.windowColor}
              emissiveIntensity={0.25}
              roughness={0.1}
            />
          </mesh>

          {/* Architectural Coping / Roof Border */}
          <mesh position={[0, b.height / 2 + 0.08, 0]}>
            <boxGeometry args={[b.width * 1.02, 0.16, b.depth * 1.02]} />
            <meshStandardMaterial color={b.roofColor} metalness={0.8} />
          </mesh>

          {/* Rooftop HVAC / Neon Communication Beacon */}
          <mesh position={[0, b.height / 2 + 0.25, 0]}>
            <boxGeometry args={[b.width * 0.45, 0.35, b.depth * 0.45]} />
            <meshStandardMaterial color="#0b1b2d" roughness={0.4} />
          </mesh>

          {b.hasAntenna && (
            <mesh position={[b.width * 0.3, b.height / 2 + 0.9, b.depth * 0.3]}>
              <cylinderGeometry args={[0.02, 0.05, 1.4, 8]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          )}

          {/* Optional Landmark Tag */}
          {b.landmarkName && (
            <mesh position={[0, b.height / 2 + 0.5, 0]}>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshBasicMaterial color="#2dd4bf" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// Tumakuru Asphalt Road Network with Footpaths, Streetlights, Zebra Crossings
function RealisticRoadNetwork() {
  const streetLightPositions = useMemo(() => {
    const list: Array<[number, number, number]> = [];
    // Streetlights along B.H. Road (z = ±2.4)
    for (let x = -20; x <= 20; x += 6) {
      if (Math.abs(x) < 4) continue; // Roundabout gap
      list.push([x, 0, 2.4]);
      list.push([x, 0, -2.4]);
    }
    // Streetlights along Ring Road (x = ±2.4)
    for (let z = -20; z <= 20; z += 6) {
      if (Math.abs(z) < 4) continue;
      list.push([2.4, 0, z]);
      list.push([-2.4, 0, z]);
    }
    return list;
  }, []);

  return (
    <group>
      {/* City Ground Base (Terrain) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[52, 52]} />
        <meshStandardMaterial color="#060c17" roughness={0.9} />
      </mesh>

      {/* Primary Artery: B.H. Road (NH 206 / East-West Highway) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[48, 4.4]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>
      {/* B.H. Road Yellow Center Divider Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[48, 0.12]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* Primary Artery: Ring Road / Kunigal Road (North-South) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[4.4, 48]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>
      {/* Ring Road Center Divider Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[0.12, 48]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* Secondary Streets: SS Puram Avenue & Batawadi Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 12]}>
        <planeGeometry args={[48, 2.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -12]}>
        <planeGeometry args={[48, 2.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {/* Mandipet Street & SIT College Cross */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, 0.01, 0]}>
        <planeGeometry args={[2.8, 48]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, 0.01, 0]}>
        <planeGeometry args={[2.8, 48]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Curbs / Footpaths (Cyan-trimmed sidewalks) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 2.3]}>
        <planeGeometry args={[48, 0.2]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -2.3]}>
        <planeGeometry args={[48, 0.2]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>

      {/* Smart LED Streetlights along Main Roads */}
      {streetLightPositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Pole */}
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 1.6, 6]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          {/* Overhanging Arm */}
          <mesh position={[pos[2] > 0 ? -0.15 : 0.15, 1.6, 0]} rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.02, 0.02, 0.35, 6]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Luminaire Bulb */}
          <mesh position={[pos[2] > 0 ? -0.28 : 0.28, 1.68, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}

      {/* Central Traffic Circle / Ashoka Pillar Roundabout */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[2.3, 5.0, 32]} />
        <meshStandardMaterial color="#0b1320" roughness={0.6} />
      </mesh>
    </group>
  );
}

// Realistic Tumakuru Vehicles: KSRTC Buses, Auto-Rickshaws, City Cars, Two-Wheelers
interface VehicleData {
  id: number;
  type: 'bus' | 'rickshaw' | 'car' | 'bike';
  route: 'bhRoadEast' | 'bhRoadWest' | 'ringRoadNorth' | 'ringRoadSouth' | 'ssPuramEast' | 'sitCrossNorth';
  speed: number;
  progress: number;
  color: string;
}

function RealTumakuruTraffic() {
  // Diverse realistic vehicles on Tumakuru corridors
  const vehicles = useMemo<VehicleData[]>(() => {
    const list: VehicleData[] = [];
    const routes: VehicleData['route'][] = [
      'bhRoadEast', 'bhRoadWest', 'ringRoadNorth', 'ringRoadSouth', 'ssPuramEast', 'sitCrossNorth'
    ];

    for (let i = 0; i < 32; i++) {
      const typeChoice = i % 8 === 0 ? 'bus' : (i % 4 === 0 ? 'rickshaw' : (i % 3 === 0 ? 'bike' : 'car'));
      let color = '#38bdf8'; // Blue car
      if (typeChoice === 'bus') {
        color = '#ef4444'; // Red/White KSRTC & City Bus
      } else if (typeChoice === 'rickshaw') {
        color = '#eab308'; // Yellow/Green Auto
      } else if (typeChoice === 'bike') {
        color = '#10b981'; // Green
      } else {
        color = ['#2563eb', '#06b6d4', '#f1f5f9', '#a855f7'][i % 4];
      }

      list.push({
        id: i,
        type: typeChoice,
        route: routes[i % routes.length],
        speed: typeChoice === 'bus' ? 2.8 : (typeChoice === 'bike' ? 5.2 : 4.0),
        progress: (i / 32) * 44 - 22,
        color
      });
    }
    return list;
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  const dataRef = useRef<VehicleData[]>(vehicles);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    dataRef.current.forEach((veh, i) => {
      const mesh = groupRef.current!.children[i] as THREE.Group;
      if (!mesh) return;

      veh.progress += delta * veh.speed;
      if (veh.progress > 23) veh.progress = -23;

      // Coordinate matching according to realistic lanes
      switch (veh.route) {
        case 'bhRoadEast': // Eastbound on B.H. Road (lane: z = -1.1)
          mesh.position.set(veh.progress, 0.18, -1.1);
          mesh.rotation.y = 0;
          break;
        case 'bhRoadWest': // Westbound on B.H. Road (lane: z = 1.1)
          mesh.position.set(-veh.progress, 0.18, 1.1);
          mesh.rotation.y = Math.PI;
          break;
        case 'ringRoadNorth': // Northbound on Ring Road (lane: x = 1.1)
          mesh.position.set(1.1, 0.18, veh.progress);
          mesh.rotation.y = Math.PI / 2;
          break;
        case 'ringRoadSouth': // Southbound on Ring Road (lane: x = -1.1)
          mesh.position.set(-1.1, 0.18, -veh.progress);
          mesh.rotation.y = -Math.PI / 2;
          break;
        case 'ssPuramEast': // SS Puram Road
          mesh.position.set(veh.progress, 0.18, 12 - 0.7);
          mesh.rotation.y = 0;
          break;
        case 'sitCrossNorth': // SIT Cross
          mesh.position.set(-12 + 0.7, 0.18, veh.progress);
          mesh.rotation.y = Math.PI / 2;
          break;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {vehicles.map((v) => (
        <group key={v.id}>
          {/* VEHICLE 1: KSRTC / TUMAKURU CITY BUS */}
          {v.type === 'bus' && (
            <group>
              {/* Bus Chassis */}
              <mesh position={[0, 0.35, 0]}>
                <boxGeometry args={[1.5, 0.65, 0.65]} />
                <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.7} />
              </mesh>
              {/* Bus White Roof */}
              <mesh position={[0, 0.7, 0]}>
                <boxGeometry args={[1.45, 0.08, 0.62]} />
                <meshStandardMaterial color="#f8fafc" />
              </mesh>
              {/* Windshield & Windows */}
              <mesh position={[0.76, 0.45, 0]}>
                <planeGeometry args={[0.02, 0.3]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
              {/* Headlights */}
              <mesh position={[0.76, 0.25, 0.22]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
              <mesh position={[0.76, 0.25, -0.22]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
              {/* Red Tail-lights */}
              <mesh position={[-0.76, 0.25, 0.2]}>
                <boxGeometry args={[0.04, 0.08, 0.08]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
              <mesh position={[-0.76, 0.25, -0.2]}>
                <boxGeometry args={[0.04, 0.08, 0.08]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            </group>
          )}

          {/* VEHICLE 2: TUMAKURU AUTO-RICKSHAW */}
          {v.type === 'rickshaw' && (
            <group>
              {/* Lower Green Body */}
              <mesh position={[0, 0.16, 0]}>
                <boxGeometry args={[0.65, 0.25, 0.45]} />
                <meshStandardMaterial color="#15803d" />
              </mesh>
              {/* Upper Yellow Canopy */}
              <mesh position={[-0.05, 0.38, 0]}>
                <boxGeometry args={[0.5, 0.22, 0.42]} />
                <meshStandardMaterial color="#eab308" />
              </mesh>
              {/* Headlight */}
              <mesh position={[0.34, 0.22, 0]}>
                <sphereGeometry args={[0.05, 6, 6]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
            </group>
          )}

          {/* VEHICLE 3: TWO-WHEELER / BIKE */}
          {v.type === 'bike' && (
            <group>
              <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[0.45, 0.25, 0.15]} />
                <meshStandardMaterial color={v.color} metalness={0.8} />
              </mesh>
              {/* Headlight beam */}
              <mesh position={[0.24, 0.2, 0]}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          )}

          {/* VEHICLE 4: PRIVATE SEDAN / SMART CIVIC VEHICLE */}
          {v.type === 'car' && (
            <group>
              {/* Car Body */}
              <mesh position={[0, 0.18, 0]}>
                <boxGeometry args={[0.9, 0.28, 0.45]} />
                <meshStandardMaterial color={v.color} roughness={0.2} metalness={0.9} />
              </mesh>
              {/* Cabin Roof & Glass */}
              <mesh position={[-0.05, 0.38, 0]}>
                <boxGeometry args={[0.5, 0.2, 0.38]} />
                <meshStandardMaterial color="#0f172a" roughness={0.1} />
              </mesh>
              {/* Front Headlights */}
              <mesh position={[0.46, 0.18, 0.15]}>
                <sphereGeometry args={[0.05, 6, 6]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
              <mesh position={[0.46, 0.18, -0.15]}>
                <sphereGeometry args={[0.05, 6, 6]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
              {/* Rear Tail-lights */}
              <mesh position={[-0.46, 0.18, 0.14]}>
                <boxGeometry args={[0.02, 0.06, 0.08]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
              <mesh position={[-0.46, 0.18, -0.14]}>
                <boxGeometry args={[0.02, 0.06, 0.08]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
}

// Tumakuru Central Landmark (Amanikere Lake Core & Siddaganga Civic Monument)
function TumakuruMonument() {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Garden Roundabout Ring */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[2.5, 2.7, 0.3, 32]} />
        <meshStandardMaterial color="#065f46" roughness={0.9} />
      </mesh>

      {/* Granite Tiered Base Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.8, 2.1, 0.6, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Central Majestic Pillar & Arch Dome */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.9, 1.2, 2.8, 16]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.25} />
      </mesh>

      {/* Golden/Cyan Spire Dome */}
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[0.85, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.7} />
      </mesh>

      {/* Rotating Holographic Beacon Ring */}
      <mesh ref={ringRef} position={[0, 2.8, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.4, 0.05, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>

      {/* 3D Floating Tag */}
      <Float speed={2} rotationIntensity={0.15} floatIntensity={0.4}>
        <Html position={[0, 5.2, 0]} center distanceFactor={14}>
          <div className="bg-slate-900/95 border border-cyan-400 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold tracking-wider shadow-2xl backdrop-blur-md whitespace-nowrap flex items-center gap-1.5 ring-1 ring-cyan-500/50">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            TUMAKURU CITY CENTER (B.H. ROAD JUNCTION)
          </div>
        </Html>
      </Float>
    </group>
  );
}

// Interactive Complaint Markers in 3D Space (Accurately Located on Tumakuru Roads)
function ComplaintPins({ onSelectPin }: { onSelectPin: (id: string) => void }) {
  const pins = [
    { id: 'TC24087', pos: [8, 0.8, -1.1], color: '#10b981', label: 'B.H. Road Pothole (Resolved)' },
    { id: 'TC24086', pos: [-6, 0.8, 12], color: '#f59e0b', label: 'S.S. Puram Garbage Pile (In Progress)' },
    { id: 'TC24085', pos: [12, 0.8, 6], color: '#ef4444', label: 'Mandipet Main Water Leak (Pending)' },
    { id: 'TC24084', pos: [-12, 0.8, -8], color: '#3b82f6', label: 'SIT Ext Streetlight Outage (Assigned)' }
  ];

  return (
    <group>
      {pins.map((p) => (
        <group key={p.id} position={p.pos as [number, number, number]}>
          <Float speed={3} rotationIntensity={0.15} floatIntensity={0.5}>
            <group rotation={[Math.PI, 0, 0]} position={[0, 0.7, 0]}>
              <mesh onClick={() => onSelectPin(p.id)}>
                <coneGeometry args={[0.3, 0.7, 16]} />
                <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.8} />
              </mesh>
            </group>
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshBasicMaterial color={p.color} />
            </mesh>
            <Html position={[0, 1.7, 0]} center distanceFactor={14}>
              <button
                onClick={() => onSelectPin(p.id)}
                className="bg-slate-900/90 border border-slate-600 hover:border-cyan-400 text-white text-[10px] px-2 py-0.5 rounded shadow-lg backdrop-blur whitespace-nowrap cursor-pointer transition-all duration-200"
              >
                {p.label}
              </button>
            </Html>
          </Float>
        </group>
      ))}
    </group>
  );
}

interface CitySceneProps {
  onSelectComplaint?: (id: string) => void;
  interactive?: boolean;
}

export const CityScene: React.FC<CitySceneProps> = ({ onSelectComplaint, interactive = true }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [16, 13, 16], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#070d18']} />
        <fog attach="fog" args={['#070d18', 25, 62]} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[15, 25, 12]} intensity={1.4} color="#93c5fd" castShadow />
        <pointLight position={[0, 8, 0]} intensity={3.0} color="#06b6d4" distance={26} />
        <pointLight position={[-14, 6, 14]} intensity={2.0} color="#2563eb" distance={22} />
        <pointLight position={[14, 6, -14]} intensity={2.0} color="#14b8a6" distance={22} />

        {/* 3D Realistic City Components */}
        <RealisticRoadNetwork />
        <RealTumakuruTraffic />
        <CityBlocks />
        <TumakuruMonument />

        {interactive && (
          <ComplaintPins
            onSelectPin={(id) => {
              if (onSelectComplaint) onSelectComplaint(id);
            }}
          />
        )}

        {/* Camera Control */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2.15}
          minDistance={6}
          maxDistance={48}
          autoRotate={!interactive}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Floating control overlay hint */}
      <div className="absolute bottom-3 left-4 pointer-events-none text-[11px] text-cyan-300/80 bg-slate-950/70 px-2.5 py-1 rounded border border-cyan-500/20 backdrop-blur-md flex items-center gap-2">
        <span>🚗 Real Tumakuru Traffic Simulation (B.H. Road • KSRTC Buses • Autos)</span>
        <span className="text-slate-500">•</span>
        <span>🖱️ Drag to rotate • Scroll to Zoom</span>
      </div>
    </div>
  );
};
