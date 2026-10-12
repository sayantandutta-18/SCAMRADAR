import React, { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  latLngToVector3,
  getRiskColorHex,
  formatScamType,
  getCyberWorldTexture,
} from '../../utils/globeUtils';

// Threat Marker on the 3D Globe
function ThreatMarker({ report, radius, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const lat = (report.location?.latitude || 0) + (report._offsetLat || 0);
  const lng = (report.location?.longitude || 0) + (report._offsetLng || 0);

  const position = useMemo(() => {
    return latLngToVector3(lat, lng, radius * 1.012);
  }, [lat, lng, radius]);

  const normal = useMemo(() => {
    return position.clone().normalize();
  }, [position]);

  const color = getRiskColorHex(report.riskLevel);

  const beaconHeight = isSelected || hovered ? 0.28 : 0.18;
  const tipPosition = useMemo(() => {
    return normal.clone().multiplyScalar(beaconHeight);
  }, [normal, beaconHeight]);

  return (
    <group position={position}>
      {/* Outer Glowing Atmosphere Halo */}
      <mesh>
        <sphereGeometry args={[isSelected || hovered ? 0.11 : 0.08, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected || hovered ? 0.45 : 0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core Glowing Marker Sphere */}
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
        <sphereGeometry args={[isSelected || hovered ? 0.075 : 0.052, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Outward Pointing Vertical Beacon Line */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(self) => {
            const points = [new THREE.Vector3(0, 0, 0), tipPosition];
            self.setFromPoints(points);
          }}
        />
        <lineBasicMaterial
          attach="material"
          color={color}
          linewidth={2}
          transparent
          opacity={0.9}
        />
      </line>

      {/* Beacon Tip Light */}
      <mesh position={tipPosition}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Rich Interactive Tooltip on Hover or Selection */}
      {(hovered || isSelected) && (
        <Html distanceFactor={6.8} position={[0, beaconHeight + 0.08, 0]} center pointerEvents="none">
          <div className="px-3 py-2 rounded-xl bg-slate-950/95 border border-cyan-500/50 text-[11px] text-white font-mono shadow-2xl backdrop-blur-xl whitespace-nowrap pointer-events-none select-none">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <span
                className="w-2 h-2 rounded-full inline-block animate-pulse"
                style={{ backgroundColor: color }}
              />
              <span className="text-white text-xs">
                {report.location?.city || 'Unknown Location'}
                {report.location?.state ? `, ${report.location.state}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-300">
              <span className="font-semibold text-cyan-300">
                {formatScamType(report.scamType)}
              </span>
              <span className="text-slate-500">•</span>
              <span
                className="px-1.5 py-0.2 rounded font-bold"
                style={{
                  backgroundColor: `${color}25`,
                  color: color,
                  border: `1px solid ${color}50`,
                }}
              >
                {report.riskLevel || 'ASSESSED'}{' '}
                {report.riskScore !== undefined ? `(${report.riskScore}/100)` : ''}
              </span>
            </div>

            {report.blockchain?.registered && (
              <div className="mt-1 pt-1 border-t border-white/10 text-[9px] text-emerald-400 font-sans">
                ✓ Cryptographic On-Chain Proof
              </div>
            )}
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
    // Lift midpoint higher above the sphere surface for an elegant curve
    const midLength = mid.length();
    if (midLength > 0.001) {
      mid.normalize().multiplyScalar(midLength * 1.32);
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
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}

// Cyber Globe Model: Base Sphere with Continent Texture + Wireframe Grid + Atmosphere Glow
function GlobeSphere({ radius = 2.0 }) {
  const worldTexture = useMemo(() => getCyberWorldTexture(), []);

  return (
    <group>
      {/* Base Earth Sphere with Glowing Continents */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={worldTexture || null}
          color={worldTexture ? '#ffffff' : '#060c18'}
          roughness={0.65}
          metalness={0.25}
          emissive="#041220"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Cyber wireframe latitude/longitude rings */}
      <mesh>
        <sphereGeometry args={[radius * 1.002, 36, 24]} />
        <meshBasicMaterial
          color="#0a2a44"
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* Atmosphere outer glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.04, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Main Scene Component containing globe, arcs, and markers
function SceneContent({
  reports = [],
  selectedReport = null,
  onSelectReport,
  radius = 2.0,
}) {
  // Valid reports with real coordinates
  const validReports = useMemo(() => {
    const list = reports.filter(
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

    // If multiple reports share identical (or very close) coordinates, slightly disperse them
    const coordCounts = {};
    return list.map((report) => {
      const key = `${report.location.latitude.toFixed(2)},${report.location.longitude.toFixed(2)}`;
      const index = coordCounts[key] || 0;
      coordCounts[key] = index + 1;

      if (index === 0) return report;

      // Disperse by slight radial angle (~0.5 degree)
      const angle = (index * (2 * Math.PI)) / 4;
      const offsetDistance = 0.55;
      return {
        ...report,
        _offsetLat: Math.sin(angle) * offsetDistance,
        _offsetLng: Math.cos(angle) * offsetDistance,
      };
    });
  }, [reports]);

  // Generate subtle decorative correlation arcs between real distinct nodes
  const arcs = useMemo(() => {
    if (validReports.length < 2) return [];
    const list = [];
    for (let i = 0; i < Math.min(validReports.length - 1, 4); i++) {
      const r1 = validReports[i];
      const r2 = validReports[i + 1];
      const p1 = latLngToVector3(
        (r1.location.latitude || 0) + (r1._offsetLat || 0),
        (r1.location.longitude || 0) + (r1._offsetLng || 0),
        radius * 1.01
      );
      const p2 = latLngToVector3(
        (r2.location.latitude || 0) + (r2._offsetLat || 0),
        (r2.location.longitude || 0) + (r2._offsetLng || 0),
        radius * 1.01
      );
      if (p1.distanceTo(p2) > 0.15) {
        list.push({ id: `arc-${i}`, p1, p2, color: getRiskColorHex(r1.riskLevel) });
      }
    }
    return list;
  }, [validReports, radius]);

  return (
    <group>
      <GlobeSphere radius={radius} />

      {/* Threat Correlation Arcs */}
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
      <ambientLight color="#0c1f33" intensity={1.4} />
      <directionalLight position={[5, 3, 5]} color="#22d3ee" intensity={1.3} />
      <directionalLight position={[-5, -2, -3]} color="#3b82f6" intensity={0.7} />

      <SceneContent
        reports={reports}
        selectedReport={selectedReport}
        onSelectReport={onSelectReport}
        radius={globeRadius}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={enableZoom}
        minDistance={globeRadius * 1.3}
        maxDistance={globeRadius * 3.8}
        rotateSpeed={0.6}
        autoRotate={shouldAutoRotate}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
