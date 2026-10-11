import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CheckCircle, Eye, EyeOff, Clock, Database } from 'lucide-react';
import { getReportById } from '../api/reports.api';
import { useApi } from '../hooks/useApi';
import { formatDateTime, getRiskColorClass, maskIdentifier } from '../utils/formatters';
import RiskScoreGauge from '../components/scam-checker/RiskScoreGauge';
import ScamTypeBadge from '../components/reports/ScamTypeBadge';
import BlockchainBadge from '../components/blockchain/BlockchainBadge';
import ReportTimeline from '../components/reports/ReportTimeline';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';

const ReportDetailPage = () => {
  const { id } = useParams();
  const { data, loading, error, execute } = useApi(getReportById);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (id) {
      execute(id);
    }
  }, [id, execute]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <LoadingSkeleton className="h-8 w-36 mb-8 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <LoadingSkeleton className="h-48 rounded-2xl" />
            <LoadingSkeleton className="h-64 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <LoadingSkeleton className="h-64 rounded-2xl" />
            <LoadingSkeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const report = data?.data?.report || data?.data;
  if (!report || error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <ErrorState
          title="Incident Report Not Found"
          message={error?.message || "The requested incident record does not exist or could not be loaded."}
          onRetry={() => execute(id)}
        />
      </div>
    );
  }

  const riskLevel = report.riskLevel || 'UNKNOWN';
  const riskColorClass = getRiskColorClass(riskLevel);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        to="/reports"
        className="inline-flex items-center text-slate-400 hover:text-cyan-300 mb-8 transition-colors text-sm font-medium gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Incidents</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white break-all">
                    {revealed ? report.identifier : maskIdentifier(report.identifier, report.identifierType)}
                  </h1>
                  <button
                    type="button"
                    onClick={() => setRevealed(!revealed)}
                    className="text-slate-400 hover:text-cyan-400 p-1 transition-colors"
                    title={revealed ? 'Mask identifier' : 'Reveal identifier'}
                    aria-label={revealed ? 'Mask identifier' : 'Reveal identifier'}
                  >
                    {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-xs sm:text-sm mt-1.5">
                  <span className="font-mono uppercase text-cyan-400 font-semibold">
                    {report.identifierType?.replace('_', ' ')}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {formatDateTime(report.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <ScamTypeBadge type={report.scamType} />
                <div className="px-3 py-1 rounded-full text-xs font-semibold border border-white/10 bg-slate-800 text-slate-300">
                  Status: {report.status || 'PENDING'}
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-4 border border-white/5 mb-6">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                Reporter's Description
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{report.message}</p>
            </div>

            {report.location && (
              <div className="flex items-center text-slate-300 text-sm bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <MapPin className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0" />
                <span>
                  {report.location.city || 'City unspecified'}
                  {report.location.state ? `, ${report.location.state}` : ''}
                  {report.location.latitude && (
                    <span className="text-xs font-mono text-cyan-400/80 ml-2">
                      ({report.location.latitude}, {report.location.longitude})
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* AI Analysis Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
              <span className="p-1.5 bg-cyan-500/20 text-cyan-300 rounded-lg mr-2.5 text-base">🤖</span>
              AI Threat Correlation & Explanation
            </h2>
            {report.aiExplanation ? (
              <div className="text-slate-200 text-sm leading-relaxed space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                {report.aiExplanation.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic">
                AI analysis has not completed or is unavailable for this specific incident.
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Incident Lifecycle & Evidence Audit
            </h2>
            <ReportTimeline report={report} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Risk Score */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Risk Assessment</h3>
            <div className="w-44 h-44 mb-3">
              <RiskScoreGauge score={report.riskScore || 0} level={riskLevel} />
            </div>
            <div className={`text-xl font-bold uppercase tracking-wider mb-1 ${riskColorClass}`}>
              {riskLevel} RISK
            </div>
            <p className="text-slate-400 text-center text-xs leading-relaxed mt-1">
              Derived from heuristic anomaly patterns, behavioral indicators, and registry reports.
            </p>
          </div>

            {/* Blockchain Status */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
                On-Chain Proof Verification
              </h3>
              <BlockchainBadge blockchain={report.blockchain || { registered: false }} />
              {report.blockchain?.registered && (
                <div className="mt-4 flex items-start gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    Report payload is cryptographically hashed with SHA-256 and stored immutably on the ScamReportRegistry contract.
                  </p>
                </div>
              )}
              <Link
                to={`/explorer?id=${report._id}`}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Audit Smart Contract Proof</span>
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
