import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { latLngToVector3, getRiskColorHex } from '../../utils/globeUtils';

// Threat Marker on the 3D Globe
function ThreatMarker({ report, radius, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const lat = report.location?.latitude;
  const lng = report.location?.longitude;

  const position = useMemo(() => {
    return latLngToVector3(lat, lng, radius * 1.012);
  }, [lat, lng, radius]);

  const normal = useMemo(() => {
    return position.clone().normalize();
  }, [position]);

  const color = getRiskColorHex(report.riskLevel);

  return (
    <group position={position}>
      {/* Outer pulsing ring */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(report);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[isSelected || hovered ? 0.06 : 0.038, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Beacon vertical pin pointing outwards */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(self) => {
            const points = [
              new THREE.Vector3(0, 0, 0),
              normal.clone().multiplyScalar(isSelected ? 0.22 : 0.12),
            ];
            self.setFromPoints(points);
          }}
        />
        <lineBasicMaterial
          attach="material"
          color={color}
          linewidth={2}
          transparent
          opacity={0.85}
        />
      </line>

      {/* Selected or Hovered Label */}
      {(hovered || isSelected) && (
        <Html distanceFactor={8} position={[0, 0.15, 0]} center pointerEvents="none">
          <div className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-cyan-500/50 text-[10px] text-white font-mono shadow-xl backdrop-blur-md whitespace-nowrap pointer-events-none">
            <span className="font-bold text-cyan-300">{report.location?.city || 'Threat Node'}</span>
            <span className="mx-1 text-slate-500">•</span>
            <span style={{ color }}>{report.scamType?.replace(/_/g, ' ')}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// Subtle Threat Correlation Arcs between valid markers
function ThreatArc({ startVec, endVec, color = '#22d3ee' }) {
  const linePoints = useMemo(() => {
    const mid = new THREE.Vector3()
      .addVectors(startVec, endVec)
      .multiplyScalar(0.5);
    // Lift the midpoint higher above the sphere surface for an elegant arc
    const midLength = mid.length();
    if (midLength > 0.001) {
      mid.normalize().multiplyScalar(midLength * 1.35);
    }
    const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
    return curve.getPoints(32);
  }, [startVec, endVec]);

  return (
    <line>
      <bufferGeometry
        attach="geometry"
        onUpdate={(self) => self.setFromPoints(linePoints)}
      />
      <lineBasicMaterial
        attach="material"
        color={color}
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}

// Cyber Globe Model: Base Sphere + Cyber Wireframe Grid + Atmosphere Glow
function GlobeSphere({ radius = 2.0 }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Dark core sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color="#060c18"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Cyber wireframe latitude/longitude rings */}
      <mesh>
        <sphereGeometry args={[radius * 1.002, 32, 24]} />
        <meshBasicMaterial
          color="#0a2a44"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Atmosphere outer glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.035, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Main Scene Component containing controls, globe, and markers
function SceneContent({
  reports = [],
  selectedReport = null,
  onSelectReport,
  radius = 2.0,
}) {
  const groupRef = useRef();

  // Valid reports with real coordinates
  const validReports = useMemo(() => {
    return reports.filter(
      (r) =>
        r &&
        r.location &&
        typeof r.location.latitude === 'number' &&
        typeof r.location.longitude === 'number' &&
        !isNaN(r.location.latitude) &&
        !isNaN(r.location.longitude) &&
        r.location.latitude >= -90 &&
        r.location.latitude <= 90 &&
        r.location.longitude >= -180 &&
        r.location.longitude <= 180
    );
  }, [reports]);

  // Generate subtle decorative correlation arcs between real nodes
  const arcs = useMemo(() => {
    if (validReports.length < 2) return [];
    const list = [];
    for (let i = 0; i < Math.min(validReports.length - 1, 4); i++) {
      const p1 = latLngToVector3(
        validReports[i].location.latitude,
        validReports[i].location.longitude,
        radius * 1.01
      );
      const p2 = latLngToVector3(
        validReports[i + 1].location.latitude,
        validReports[i + 1].location.longitude,
        radius * 1.01
      );
      list.push({ id: `arc-${i}`, p1, p2, color: getRiskColorHex(validReports[i].riskLevel) });
    }
    return list;
  }, [validReports, radius]);

  return (
    <group ref={groupRef}>
      <GlobeSphere radius={radius} />

      {/* Threat Arcs */}
      {arcs.map((arc) => (
        <ThreatArc key={arc.id} startVec={arc.p1} endVec={arc.p2} color={arc.color} />
      ))}

      {/* Threat Markers */}
      {validReports.map((report) => (
        <ThreatMarker
          key={report._id || report.id}
          report={report}
          radius={radius}
          isSelected={selectedReport && (selectedReport._id === report._id || selectedReport.id === report.id)}
          onSelect={onSelectReport}
        />
      ))}
    </group>
  );
}

export default function CyberGlobeCanvas({
  reports = [],
  selectedReport = null,
  onSelectReport,
  autoRotate = true,
  enableZoom = true,
  cameraDistance = 4.8,
  globeRadius = 1.9,
}) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const shouldAutoRotate = autoRotate && !prefersReducedMotion;

  return (
    <Canvas
      camera={{ position: [0, 0, cameraDistance], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    >
      {/* Restrained Cybersecurity Lighting */}
      <ambientLight color="#0c1f33" intensity={1.2} />
      <directionalLight position={[5, 3, 5]} color="#22d3ee" intensity={1.2} />
      <directionalLight position={[-5, -2, -3]} color="#3b82f6" intensity={0.6} />

      <SceneContent
        reports={reports}
        selectedReport={selectedReport}
        onSelectReport={onSelectReport}
        radius={globeRadius}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={enableZoom}
        minDistance={globeRadius * 1.4}
        maxDistance={globeRadius * 3.8}
        rotateSpeed={0.6}
        autoRotate={shouldAutoRotate}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
