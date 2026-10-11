import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import RiskScoreGauge from './RiskScoreGauge';
import ScamTypeBadge from '../reports/ScamTypeBadge';
import BlockchainBadge from '../blockchain/BlockchainBadge';
import { formatDate, formatRiskScore, getRiskColorClass } from '../../utils/formatters';

const RiskResult = ({ reports, identifier, identifierType }) => {
  if (!reports) return null;

  if (reports.length === 0) {
    return (
      <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
          <ShieldCheck className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Reports Found</h3>
        <p className="text-slate-400 mb-6 max-w-md">
          We haven't found any scam reports for <span className="font-semibold text-slate-300">{identifier}</span>. However, always remain cautious and verify sources.
        </p>
      </div>
    );
  }

  // Calculate aggregated risk or use the most recent report's data
  const latestReport = reports[0];
  const totalReports = reports.length;
  
  return (
    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        
        {/* Gauge Section */}
        <div className="flex-shrink-0">
          <RiskScoreGauge 
            score={latestReport.riskScore || 0} 
            level={latestReport.riskLevel || 'UNKNOWN'} 
          />
        </div>

        {/* Details Section */}
        <div className="flex-grow space-y-6 w-full">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1 break-all">{identifier}</h3>
              <p className="text-slate-400 uppercase text-sm font-medium tracking-wider">{identifierType}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <ScamTypeBadge type={latestReport.scamType} />
              <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getRiskColorClass(latestReport.riskLevel)}`}>
                {latestReport.riskLevel} RISK
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              AI Analysis Summary
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {latestReport.aiAnalysis || "This identifier has been reported for suspicious activities. Multiple reports suggest a pattern of fraudulent behavior."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 text-sm text-slate-400">
              <div>
                <span className="block text-slate-500 text-xs uppercase mb-1">Reports</span>
                <span className="font-semibold text-white">{totalReports}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs uppercase mb-1">Last Reported</span>
                <span className="font-semibold text-white">{formatDate(latestReport.createdAt)}</span>
              </div>
              {latestReport.location?.city && (
                <div>
                  <span className="block text-slate-500 text-xs uppercase mb-1">Location</span>
                  <span className="font-semibold text-white">{latestReport.location.city}, {latestReport.location.state}</span>
                </div>
              )}
            </div>

            {latestReport.blockchain && (
              <BlockchainBadge blockchain={latestReport.blockchain} />
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-white/10 flex justify-center">
        <a 
          href={`/reports/${latestReport._id || latestReport.id}`}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          View Full Report Details &rarr;
        </a>
      </div>
    </div>
  );
};

export default RiskResult;
