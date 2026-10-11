import React, { Suspense, lazy, useState } from 'react';
import { RotateCw, Pause, Play, ZoomIn, ZoomOut, AlertTriangle } from 'lucide-react';

const CyberGlobeCanvas = lazy(() => import('./CyberGlobeCanvas'));

function isWebGLSupported() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// Cyber Radar Loading Skeleton
export function GlobeLoadingSkeleton({ compact = false }) {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-slate-950/40 rounded-2xl relative overflow-hidden ${compact ? 'min-h-[300px]' : 'min-h-[450px]'}`}>
      <div className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-pulse"></div>
        {/* Middle Ring */}
        <div className="absolute inset-6 rounded-full border border-cyan-500/30"></div>
        {/* Inner Ring */}
        <div className="absolute inset-14 rounded-full border border-cyan-500/40 border-dashed"></div>
        {/* Radar Sweep Line */}
        <div className="absolute inset-0 rounded-full animate-radar-sweep border-t-2 border-cyan-400"></div>
        {/* Center Node */}
        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]"></div>
      </div>
      <div className="mt-4 text-center z-10">
        <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 block font-semibold">
          Initializing Threat Vectors
        </span>
        <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
          Loading 3D Cyber Threat Globe...
        </span>
      </div>
    </div>
  );
}

export default function CyberThreatGlobe({
  reports = [],
  selectedReport = null,
  onSelectReport,
  compact = false,
  showControls = true,
  fallbackTo2D,
  className = '',
}) {
  const [hasWebGL] = useState(() => isWebGLSupported());
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraDistance, setCameraDistance] = useState(compact ? 4.8 : 4.4);

  if (!hasWebGL) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-slate-950/60 border border-white/10 rounded-2xl p-6 text-center ${className}`}>
        <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
        <h4 className="text-base font-bold text-white mb-1">WebGL 3D Acceleration Unavailable</h4>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          Hardware acceleration is not supported on this device. You can view the incident locations using the 2D Geographic Map.
        </p>
        {fallbackTo2D && (
          <button
            onClick={fallbackTo2D}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-colors"
          >
            Switch to 2D Map View
          </button>
        )}
      </div>
    );
  }

  const validCount = reports.filter(
    (r) => r?.location?.latitude && r?.location?.longitude
  ).length;

  return (
    <div className={`relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden select-none ${className}`}>
      {/* 3D Scene */}
      <Suspense fallback={<GlobeLoadingSkeleton compact={compact} />}>
        <CyberGlobeCanvas
          reports={reports}
          selectedReport={selectedReport}
          onSelectReport={onSelectReport}
          autoRotate={autoRotate}
          cameraDistance={cameraDistance}
          globeRadius={compact ? 1.75 : 1.9}
        />
      </Suspense>

      {/* Top Status Pill */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-mono text-slate-300 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-semibold text-white">{validCount} Plotted Coordinates</span>
      </div>

      {/* Control Buttons Toolbar */}
      {showControls && (
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 text-slate-300 shadow-xl">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-colors"
            title={autoRotate ? 'Pause rotation' : 'Resume rotation'}
            aria-label={autoRotate ? 'Pause rotation' : 'Resume rotation'}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setCameraDistance((d) => Math.max(3.2, d - 0.4))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setCameraDistance((d) => Math.min(6.5, d + 0.4))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setCameraDistance(compact ? 4.8 : 4.4);
              setAutoRotate(true);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-colors"
            title="Reset View"
            aria-label="Reset View"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-slate-400 pointer-events-none">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span> High Risk
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low
        </span>
      </div>
    </div>
  );
}
