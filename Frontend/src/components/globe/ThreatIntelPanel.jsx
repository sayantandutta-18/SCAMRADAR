import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Calendar, ArrowRight, Eye, EyeOff, X, Activity, Radio } from 'lucide-react';
import ScamTypeBadge from '../reports/ScamTypeBadge';
import BlockchainBadge from '../blockchain/BlockchainBadge';
import { formatDate, getRiskColorClass, maskIdentifier } from '../../utils/formatters';
import RiskScoreGauge from '../scam-checker/RiskScoreGauge';

export default function ThreatIntelPanel({
  selectedReport,
  onClearSelection,
  reports = [],
  onSelectReport,
}) {
  const [revealed, setRevealed] = useState(false);

  // If a report is selected, display its full intelligence dossier
  if (selectedReport) {
    const reportId = selectedReport._id || selectedReport.id;
    const riskLevel = selectedReport.riskLevel || 'UNKNOWN';
    const riskColorClass = getRiskColorClass(riskLevel);

    return (
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between h-full space-y-4">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>ACTIVE THREAT VECTOR</span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white break-all">
                  {revealed
                    ? selectedReport.identifier
                    : maskIdentifier(selectedReport.identifier, selectedReport.identifierType)}
                </h3>
                <button
                  type="button"
                  onClick={() => setRevealed(!revealed)}
                  className="text-slate-400 hover:text-cyan-400 p-0.5 transition-colors"
                  title={revealed ? 'Mask identifier' : 'Reveal identifier'}
                >
                  {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs font-mono uppercase text-slate-400 mt-0.5">
                {selectedReport.identifierType?.replace(/_/g, ' ')}
              </p>
            </div>

            <button
              type="button"
              onClick={onClearSelection}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Risk Gauge & Category */}
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="w-24 h-24 flex-shrink-0">
              <RiskScoreGauge score={selectedReport.riskScore || 0} level={riskLevel} />
            </div>

            <div className="space-y-2 flex-grow text-right sm:text-left">
              <ScamTypeBadge type={selectedReport.scamType} />
              <div className={`text-sm font-bold uppercase tracking-wider ${riskColorClass}`}>
                {riskLevel} RISK SEVERITY
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Risk Score: {selectedReport.riskScore !== undefined ? `${selectedReport.riskScore}/100` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Location & Meta */}
          <div className="space-y-2 bg-black/40 rounded-xl p-3 border border-white/5 text-xs text-slate-300">
            {selectedReport.location && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location:
                </span>
                <span className="font-semibold text-white">
                  {selectedReport.location.city || 'Unspecified'}
                  {selectedReport.location.state ? `, ${selectedReport.location.state}` : ''}
                </span>
              </div>
            )}
            {selectedReport.location?.latitude && (
              <div className="flex items-center justify-between font-mono text-[11px] text-cyan-400/80">
                <span>GPS Coordinates:</span>
                <span>
                  {selectedReport.location.latitude}, {selectedReport.location.longitude}
                </span>
              </div>
            )}
            {selectedReport.createdAt && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Logged:
                </span>
                <span>{formatDate(selectedReport.createdAt)}</span>
              </div>
            )}
          </div>

          {/* AI Explanation Excerpt */}
          {(selectedReport.aiExplanation || selectedReport.message) && (
            <div className="mt-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 block mb-1">
                Incident Heuristics
              </span>
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {selectedReport.aiExplanation || selectedReport.message}
              </p>
            </div>
          )}

          {/* Blockchain badge */}
          {selectedReport.blockchain && (
            <div className="mt-3">
              <BlockchainBadge blockchain={selectedReport.blockchain} compact={true} />
            </div>
          )}
        </div>

        {/* Action Button */}
        {reportId && (
          <Link
            to={`/reports/${reportId}`}
            className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <span>Inspect Verified Case Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    );
  }

  // Aggregate metrics from real mapped reports
  const validReports = reports.filter(
    (r) => r?.location?.latitude && r?.location?.longitude
  );
  const highRiskCount = validReports.filter((r) => r?.riskLevel === 'HIGH').length;
  const uniqueCities = new Set(
    validReports.map((r) => r?.location?.city).filter(Boolean)
  ).size;

  return (
    <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between h-full space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-wide">Threat Intel Telemetry</h3>
        </div>
        <p className="text-xs text-slate-400">
          Live coordinate tracking derived from validated community incident reports.
        </p>

        {/* Mini Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 text-center">
            <span className="block text-[10px] font-mono uppercase text-slate-500">Nodes</span>
            <span className="text-lg font-bold text-cyan-300 font-mono">{validReports.length}</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 text-center">
            <span className="block text-[10px] font-mono uppercase text-slate-500">High Risk</span>
            <span className="text-lg font-bold text-red-400 font-mono">{highRiskCount}</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 text-center">
            <span className="block text-[10px] font-mono uppercase text-slate-500">Hubs</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{uniqueCities}</span>
          </div>
        </div>

        {/* Plotted Incident List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Plotted Incidents ({validReports.length})
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Select to focus</span>
          </div>

          {validReports.length === 0 ? (
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center text-xs text-slate-400">
              No geographical coordinate records matching the current filter.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {validReports.slice(0, 10).map((rep) => {
                const colorClass = getRiskColorClass(rep.riskLevel);
                return (
                  <button
                    key={rep._id || rep.id}
                    type="button"
                    onClick={() => onSelectReport(rep)}
                    className="w-full text-left p-2.5 rounded-xl bg-white/[0.02] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${rep.riskLevel === 'HIGH' ? 'bg-red-400' : 'bg-cyan-400'}`} />
                        <span className="text-xs font-semibold text-white truncate block">
                          {maskIdentifier(rep.identifier, rep.identifierType)}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {rep.location?.city || 'Region'} • {rep.scamType?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold font-mono ${colorClass}`}>
                      {rep.riskScore || '0'}/100
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-white/5 text-[11px] text-slate-500 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
        <span>Click any globe marker to view on-chain hashes and case evidence.</span>
      </div>
    </div>
  );
}
