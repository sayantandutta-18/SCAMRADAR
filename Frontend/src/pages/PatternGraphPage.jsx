import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Network,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import { getScamPatternGraph } from '../api/intelligence.api';
import { useApi } from '../hooks/useApi';
import BackButton from '../components/common/BackButton';
import { getRiskColorClass } from '../utils/formatters';

const SCAM_TYPES = [
  'ALL',
  'KYC_SCAM',
  'PHISHING',
  'UPI_FRAUD',
  'JOB_SCAM',
  'INVESTMENT_SCAM',
  'LOTTERY_SCAM',
  'DELIVERY_SCAM',
  'LOAN_SCAM',
  'IMPERSONATION',
  'ROMANCE_SCAM',
  'TECH_SUPPORT_SCAM',
];

const PatternGraphPage = () => {
  // Filter States
  const [selectedScamType, setSelectedScamType] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('');
  const [nodeLimit, setNodeLimit] = useState(35);

  // Selected Node State
  const [selectedNode, setSelectedNode] = useState(null);

  // Zoom & Pan State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Node Positions (Simulation layout)
  const [nodePositions, setNodePositions] = useState({});
  const [draggedNodeId, setDraggedNodeId] = useState(null);

  // API Call
  const { data, loading, error, execute } = useApi(getScamPatternGraph);

  const fetchGraph = () => {
    execute({
      scamType: selectedScamType === 'ALL' ? undefined : selectedScamType,
      city: cityFilter.trim() || undefined,
      limit: nodeLimit,
    });
  };

  useEffect(() => {
    fetchGraph();
  }, [selectedScamType, nodeLimit]);

  const graphData = data?.data || data;
  const nodes = useMemo(() => graphData?.nodes || [], [graphData]);
  const edges = useMemo(() => graphData?.edges || [], [graphData]);

  // Initialize node layout positions in circular/force ring
  useEffect(() => {
    if (!nodes.length) return;

    const positions = {};
    const width = 900;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;

    // Group nodes by type
    const reports = nodes.filter((n) => n.type === 'REPORT');
    const identifiers = nodes.filter((n) => n.type === 'IDENTIFIER');
    const locations = nodes.filter((n) => n.type === 'LOCATION');
    const vectors = nodes.filter((n) => n.type === 'THREAT_VECTOR');

    // Place threat vectors & locations in outer ring
    const outerNodes = [...locations, ...vectors];
    outerNodes.forEach((node, idx) => {
      const angle = (idx / Math.max(1, outerNodes.length)) * 2 * Math.PI;
      const radius = 220;
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    // Place identifiers in middle ring
    identifiers.forEach((node, idx) => {
      const angle = (idx / Math.max(1, identifiers.length)) * 2 * Math.PI + 0.3;
      const radius = 140;
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    // Place reports in inner/distributed cluster
    reports.forEach((node, idx) => {
      const angle = (idx / Math.max(1, reports.length)) * 2 * Math.PI;
      const radius = 70 + (idx % 3) * 35;
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    setNodePositions(positions);
  }, [nodes]);

  // Pan Handlers
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'circle' || e.target.tagName === 'rect' || e.target.tagName === 'text') {
      return;
    }
    setIsPanning(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (draggedNodeId) {
      const svgRect = e.currentTarget.getBoundingClientRect();
      const newX = (e.clientX - svgRect.left - pan.x) / zoom;
      const newY = (e.clientY - svgRect.top - pan.y) / zoom;
      setNodePositions((prev) => ({
        ...prev,
        [draggedNodeId]: { x: newX, y: newY },
      }));
      return;
    }

    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  // Connected edges for selected node
  const connectedEdges = useMemo(() => {
    if (!selectedNode) return [];
    return edges.filter(
      (e) => e.source === selectedNode.id || e.target === selectedNode.id
    );
  }, [selectedNode, edges]);

  const getNodeColor = (node) => {
    if (node.type === 'REPORT') {
      return node.riskLevel === 'HIGH'
        ? '#ef4444'
        : node.riskLevel === 'MEDIUM'
        ? '#f59e0b'
        : '#10b981';
    }
    if (node.type === 'IDENTIFIER') return '#06b6d4'; // Cyan
    if (node.type === 'LOCATION') return '#10b981'; // Green
    if (node.type === 'THREAT_VECTOR') return '#a855f7'; // Purple
    return '#94a3b8';
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <BackButton fallbackPath="/" />
      </div>

      {/* Header */}
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
          <Network className="w-3.5 h-3.5" />
          <span>GRAPH CORRELATION & ATTACK CLUSTERING</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Scam Pattern Intelligence Graph
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Discover cross-incident patterns, shared identifiers, and geographic clusters. Inferred relationships are derived from heuristic links and labeled strictly as <strong>POSSIBLE</strong>.
        </p>
      </div>

      {/* Ethical Safeguard Notice */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-300 flex items-start gap-3.5">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 uppercase tracking-wide text-[11px] block">
            Ethical Intelligence Notice & Non-Accusatory Principle
          </span>
          <p className="text-slate-400 leading-relaxed">
            All edges in this correlation graph represent <strong>POSSIBLE</strong> behavioral linkages, not confirmed identities or legal guilt. All telephone numbers, UPI handles, and emails are cryptographically masked to protect privacy.
          </p>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Category:</span>
            <select
              value={selectedScamType}
              onChange={(e) => setSelectedScamType(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {SCAM_TYPES.map((type) => (
                <option key={type} value={type} className="bg-slate-900 text-white">
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">City:</span>
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchGraph()}
              placeholder="e.g. Kolkata"
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 w-28 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Node Limit Slider */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Max Nodes: {nodeLimit}</span>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={nodeLimit}
              onChange={(e) => setNodeLimit(Number(e.target.value))}
              className="w-20 accent-cyan-400"
            />
          </div>

          <button
            onClick={fetchGraph}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Apply</span>
          </button>
        </div>

        {/* Right: Zoom & Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative bg-slate-950/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-[620px] select-none">
        {loading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-xs font-mono text-cyan-300">Computing Pattern Corroborations & Clustering...</span>
          </div>
        )}

        {/* Interactive SVG Network Graph */}
        <svg
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            {edges.map((edge) => {
              const srcPos = nodePositions[edge.source];
              const tgtPos = nodePositions[edge.target];
              if (!srcPos || !tgtPos) return null;

              const isHighlighted =
                selectedNode &&
                (edge.source === selectedNode.id || edge.target === selectedNode.id);

              return (
                <g key={edge.id} className="transition-opacity">
                  <line
                    x1={srcPos.x}
                    y1={srcPos.y}
                    x2={tgtPos.x}
                    y2={tgtPos.y}
                    stroke={isHighlighted ? '#06b6d4' : 'rgba(255, 255, 255, 0.12)'}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    strokeDasharray={edge.type === 'GEOGRAPHIC_CLUSTER' ? '4 3' : 'none'}
                  />
                  {/* Midpoint Label on Highlight */}
                  {isHighlighted && (
                    <text
                      x={(srcPos.x + tgtPos.x) / 2}
                      y={(srcPos.y + tgtPos.y) / 2 - 6}
                      fill="#06b6d4"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="bg-black"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const isSelected = selectedNode?.id === node.id;
              const nodeColor = getNodeColor(node);

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggedNodeId(node.id);
                  }}
                  onClick={() => setSelectedNode(node)}
                >
                  {/* Outer Glow Halo on Selection */}
                  {isSelected && (
                    <circle
                      r="26"
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth="2"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Main Node Body */}
                  <circle
                    r={node.type === 'REPORT' ? 18 : node.type === 'IDENTIFIER' ? 15 : 20}
                    fill="#0f172a"
                    stroke={nodeColor}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all hover:scale-110"
                  />

                  {/* Inner Node Icon Indicator */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill={nodeColor}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.type === 'REPORT' ? '!' : node.type === 'IDENTIFIER' ? '#' : '⬡'}
                  </text>

                  {/* Label Text below node */}
                  <text
                    textAnchor="middle"
                    dy="32"
                    fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="pointer-events-none drop-shadow"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono space-y-1.5 pointer-events-none">
          <div className="text-slate-400 font-bold uppercase text-[9px] mb-1">Graph Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-slate-300">Incident Report (High Risk)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300">Incident Report (Medium Risk)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Masked Identifier Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Geographic Location Cluster</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span className="text-slate-300">Threat Modus Operandi Vector</span>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 sm:w-96 max-h-[580px] overflow-y-auto p-5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl z-20 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase">
                  {selectedNode.type} NODE
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedNode.label}</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Node Metadata */}
            <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-2 text-xs">
              {selectedNode.type === 'REPORT' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scam Type:</span>
                    <span className="text-cyan-300 font-semibold">{selectedNode.scamType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Assessment:</span>
                    <span className={`font-bold ${getRiskColorClass(selectedNode.riskLevel)}`}>
                      {selectedNode.riskLevel} ({selectedNode.riskScore}/100)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Masked Target:</span>
                    <span className="font-mono text-slate-200">{selectedNode.maskedIdentifier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-200">{selectedNode.city}, {selectedNode.state}</span>
                  </div>
                </>
              )}

              {selectedNode.type === 'IDENTIFIER' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Identifier Type:</span>
                    <span className="font-mono text-cyan-300">{selectedNode.identifierType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Masked Value:</span>
                    <span className="font-mono text-white font-bold">{selectedNode.label}</span>
                  </div>
                </>
              )}

              {selectedNode.type === 'LOCATION' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">City Cluster:</span>
                    <span className="text-emerald-300 font-bold">{selectedNode.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Correlated Incidents:</span>
                    <span className="font-mono text-white">{selectedNode.count} reports</span>
                  </div>
                </>
              )}
            </div>

            {/* Inferred Relationships List */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
                Inferred Heuristic Connections ({connectedEdges.length}):
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {connectedEdges.map((edge) => (
                  <div
                    key={edge.id}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-mono font-bold text-[10px]">
                        {edge.relationship}
                      </span>
                      <span className="text-slate-500 text-[10px] font-mono">
                        {(edge.confidence * 100).toFixed(0)}% correlation
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-tight">{edge.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedNode.type === 'REPORT' && (
              <div className="pt-2 border-t border-white/5 flex justify-end">
                <Link
                  to={`/reports/${selectedNode.id.replace('rep_', '')}`}
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <span>Open Full Incident Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatternGraphPage;
