import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Globe, Map as MapIcon, List, Search, RotateCcw, Shield } from 'lucide-react';
import { getMapReports } from '../api/reports.api';
import { useApi } from '../hooks/useApi';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import CyberThreatGlobe from '../components/globe/CyberThreatGlobe';
import ThreatIntelPanel from '../components/globe/ThreatIntelPanel';
import ReportCard from '../components/reports/ReportCard';
import BackButton from '../components/common/BackButton';
import { SCAM_TYPES } from '../constants/scamTypes';

const getLeafletRiskColor = (level) => {
  switch (level) {
    case 'HIGH':
      return '#ef4444';
    case 'MEDIUM':
      return '#f59e0b';
    case 'LOW':
      return '#10b981';
    default:
      return '#06b6d4';
  }
};

export default function MapPage() {
  const { data, loading, error, execute } = useApi(getMapReports);
  const [viewMode, setViewMode] = useState('3d'); // '3d' | '2d' | 'list'
  const [selectedReport, setSelectedReport] = useState(null);

  // Filters
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    execute();
  }, [execute]);

  // Extract raw reports from API response
  const rawReports = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.reports)) return data.reports;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  // Filter reports
  const filteredReports = useMemo(() => {
    return rawReports.filter((report) => {
      // Risk filter
      if (riskFilter !== 'ALL' && report.riskLevel !== riskFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'ALL' && report.scamType !== typeFilter) {
        return false;
      }
      // Search query filter (search by city, state, or scamType)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const city = (report.location?.city || '').toLowerCase();
        const state = (report.location?.state || '').toLowerCase();
        const scamType = (report.scamType || '').toLowerCase();
        const identifier = (report.identifier || '').toLowerCase();
        if (
          !city.includes(q) &&
          !state.includes(q) &&
          !scamType.includes(q) &&
          !identifier.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rawReports, riskFilter, typeFilter, searchQuery]);

  // Valid coordinate subset
  const mappedReports = useMemo(() => {
    return filteredReports.filter(
      (r) =>
        r?.location &&
        typeof r.location.latitude === 'number' &&
        typeof r.location.longitude === 'number' &&
        !isNaN(r.location.latitude) &&
        !isNaN(r.location.longitude)
    );
  }, [filteredReports]);

  // Calculate center of map from mapped reports or fallback to India default [22.5, 82.0]
  const mapCenter = useMemo(() => {
    if (mappedReports.length > 0) {
      return [mappedReports[0].location.latitude, mappedReports[0].location.longitude];
    }
    return [22.5937, 78.9629];
  }, [mappedReports]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <BackButton fallbackPath="/" />
      </div>

      {/* Top Banner & Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-2">
            <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '12s' }} />
            <span>GLOBAL THREAT MATRIX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cyber Threat Intelligence Map
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Real-time geospatial visualization of reported threat vectors and fraud operations.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-white/10 rounded-xl self-start md:self-auto shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '3d'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Cyber Globe</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '2d'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>2D Map</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Incident Feed</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/60 border border-white/10 backdrop-blur-xl p-3.5 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2.5 flex-grow">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-grow sm:flex-grow-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by city, state, or scam..."
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>

          {/* Risk Level Selector */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          {/* Scam Category Selector */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-cyan-500 outline-none max-w-[200px]"
          >
            <option value="ALL">All Scam Categories</option>
            {Object.keys(SCAM_TYPES).map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          {(riskFilter !== 'ALL' || typeFilter !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setRiskFilter('ALL');
                setTypeFilter('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <span className="font-bold text-white">{mappedReports.length}</span> mapped /{' '}
          <span className="font-bold text-white">{filteredReports.length}</span> total
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          <div className="lg:col-span-2 h-[550px]">
            <LoadingSkeleton className="w-full h-full rounded-2xl" />
          </div>
          <div className="h-[550px]">
            <LoadingSkeleton className="w-full h-full rounded-2xl" />
          </div>
        </div>
      ) : error ? (
        <div className="flex-grow flex items-center justify-center p-8 bg-slate-900/40 rounded-2xl border border-white/10">
          <ErrorState message="Failed to load map data from the API." onRetry={execute} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          {/* Main Map or List Container (2 Columns) */}
          <div className="lg:col-span-2 h-[550px] sm:h-[600px] relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/40 shadow-2xl">
            {viewMode === '3d' && (
              <CyberThreatGlobe
                reports={filteredReports}
                selectedReport={selectedReport}
                onSelectReport={setSelectedReport}
                fallbackTo2D={() => setViewMode('2d')}
                loading={loading}
                error={error}
                onRetry={execute}
                className="w-full h-full"
              />
            )}

            {viewMode === '2d' && (
              <div className="w-full h-full relative">
                <MapContainer
                  center={mapCenter}
                  zoom={5}
                  className="w-full h-full z-0"
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />

                  {mappedReports.map((report) => (
                    <CircleMarker
                      key={report._id || report.id}
                      center={[report.location.latitude, report.location.longitude]}
                      pathOptions={{
                        color: getLeafletRiskColor(report.riskLevel),
                        fillColor: getLeafletRiskColor(report.riskLevel),
                        fillOpacity: 0.65,
                        weight: 2,
                      }}
                      radius={selectedReport && (selectedReport._id === report._id || selectedReport.id === report.id) ? 12 : 8}
                      eventHandlers={{
                        click: () => setSelectedReport(report),
                      }}
                    >
                      <Popup className="custom-popup">
                        <div className="p-1 min-w-[200px]">
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-700">
                            <span className="font-bold text-white capitalize text-sm">
                              {report.scamType?.replace(/_/g, ' ')}
                            </span>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: getLeafletRiskColor(report.riskLevel) + '30',
                                color: getLeafletRiskColor(report.riskLevel),
                              }}
                            >
                              {report.riskLevel}
                            </span>
                          </div>
                          <div className="text-xs text-gray-300 mb-2">
                            {report.location.city}, {report.location.state}
                          </div>
                          <div className="text-xs text-gray-400 mb-3 flex items-center gap-1 font-mono">
                            <Shield className="w-3 h-3 text-cyan-400" /> Score: {report.riskScore}/100
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedReport(report)}
                            className="block w-full text-center bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-1.5 rounded text-xs transition-colors"
                          >
                            Inspect Intel
                          </button>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>

                <div className="absolute top-3 right-3 z-[1000] bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-slate-300">
                  {mappedReports.length} Mapped Coordinate Nodes
                </div>
              </div>
            )}

            {viewMode === 'list' && (
              <div className="w-full h-full overflow-y-auto p-4 space-y-4">
                {filteredReports.length === 0 ? (
                  <EmptyState
                    title="No incidents found"
                    message="No reports match your current filter criteria."
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredReports.map((report) => (
                      <ReportCard key={report._id || report.id} report={report} compact />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Threat Intelligence Panel (1 Column) */}
          <div className="h-[550px] sm:h-[600px]">
            <ThreatIntelPanel
              selectedReport={selectedReport}
              onClearSelection={() => setSelectedReport(null)}
              reports={filteredReports}
              onSelectReport={setSelectedReport}
            />
          </div>
        </div>
      )}
    </div>
  );
}
