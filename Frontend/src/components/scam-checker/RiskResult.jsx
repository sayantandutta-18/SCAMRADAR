import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ShieldAlert, Eye, EyeOff, MapPin, Calendar, ArrowRight, Info } from 'lucide-react';
import RiskScoreGauge from './RiskScoreGauge';
import ScamTypeBadge from '../reports/ScamTypeBadge';
import BlockchainBadge from '../blockchain/BlockchainBadge';
import { formatDate, formatRiskScore, getRiskColorClass, formatIdentifier, maskIdentifier } from '../../utils/formatters';

const RiskResult = ({ reports, identifier, identifierType }) => {
  const [revealed, setRevealed] = useState(false);

  if (!reports) return null;

  if (reports.length === 0) {
    return (
      <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Reports Found</h3>
        <p className="text-slate-300 mb-4 max-w-lg leading-relaxed">
          The identifier <span className="font-mono text-cyan-300 font-semibold">{identifier}</span> does not currently match any recorded reports in our database.
        </p>
        <div className="bg-slate-800/60 border border-white/5 rounded-xl p-4 max-w-md text-left flex items-start gap-3 text-xs text-slate-400">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p>
            Zero reports does not guarantee safety. Scammers frequently cycle new numbers, domains, and payment handles. Always verify credentials through official channels.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/report"
            className="px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-semibold transition-colors"
          >
            Report this Identifier
          </Link>
          <Link
            to="/safety"
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-colors"
          >
            Safety Guidelines
          </Link>
        </div>
      </div>
    );
  }

  const latestReport = reports[0];
  const totalReports = reports.length;
  const riskLevel = latestReport.riskLevel || 'UNKNOWN';
  const riskColorClass = getRiskColorClass(riskLevel);

  return (
    <div className="w-full bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Gauge Section */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-44 h-44">
            <RiskScoreGauge 
              score={latestReport.riskScore || 0} 
              level={riskLevel} 
            />
          </div>
          <div className={`mt-2 text-center text-sm font-bold uppercase tracking-wider ${riskColorClass}`}>
            {riskLevel} RISK INDICATORS
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-grow space-y-5 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-white break-all">
                  {revealed ? identifier : maskIdentifier(identifier, identifierType)}
                </h3>
                <button
                  type="button"
                  onClick={() => setRevealed(!revealed)}
                  className="text-slate-400 hover:text-cyan-400 p-1 transition-colors"
                  title={revealed ? "Mask identifier" : "Reveal full identifier"}
                >
                  {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mt-1">
                {identifierType?.replace('_', ' ')} IDENTIFIER
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <ScamTypeBadge type={latestReport.scamType} />
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${riskColorClass} bg-black/40`}>
                Score: {latestReport.riskScore}/100
              </div>
            </div>
          </div>

          {/* AI Explanation */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5 space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              AI Threat Analysis & Explanation
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed">
              {latestReport.aiExplanation || latestReport.aiAnalysis || "This identifier has been flagged with patterns matching known fraudulent operations."}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-black/30 rounded-xl border border-white/5 text-xs text-slate-400">
            <div>
              <span className="block text-[10px] uppercase text-slate-500 font-mono">Total Reports</span>
              <span className="font-bold text-white text-sm">{totalReports}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-slate-500 font-mono">Last Reported</span>
              <span className="font-bold text-white text-sm">{formatDate(latestReport.createdAt)}</span>
            </div>
            {latestReport.location?.city && (
              <div>
                <span className="block text-[10px] uppercase text-slate-500 font-mono">Location</span>
                <span className="font-bold text-white text-sm truncate block">
                  {latestReport.location.city}{latestReport.location.state ? `, ${latestReport.location.state}` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Blockchain & Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div>
              {latestReport.blockchain && (
                <BlockchainBadge blockchain={latestReport.blockchain} compact={true} />
              )}
            </div>

            <Link
              to={`/reports/${latestReport._id || latestReport.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <span>View Full Report & Blockchain Proof</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
        <span>ScamRadar Trust Protocol • Data Integrity Protected</span>
        <span>AI Confidence Assessment</span>
      </div>
    </div>
  );
};

export default RiskResult;
