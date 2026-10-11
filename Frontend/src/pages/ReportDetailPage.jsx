import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { getReportById } from '../api/reports.api';
import { useApi } from '../hooks/useApi';
import { formatDateTime, getRiskColorClass } from '../utils/formatters';
import RiskScoreGauge from '../components/scam-checker/RiskScoreGauge';
import ScamTypeBadge from '../components/reports/ScamTypeBadge';
import BlockchainBadge from '../components/blockchain/BlockchainBadge';
import ReportTimeline from '../components/reports/ReportTimeline';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';

const ReportDetailPage = () => {
  const { id } = useParams();
  const { data, loading, error, execute } = useApi(getReportById);

  useEffect(() => {
    if (id) {
      execute(id);
    }
  }, [id, execute]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <LoadingSkeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <LoadingSkeleton className="h-48 rounded-xl" />
              <LoadingSkeleton className="h-64 rounded-xl" />
            </div>
            <div className="space-y-6">
              <LoadingSkeleton className="h-64 rounded-xl" />
              <LoadingSkeleton className="h-48 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const report = data?.data?.report || data?.data;
  if (!report) {
    return (
      <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4 flex items-center justify-center">
        <ErrorState 
          title="Report Not Found" 
          message="The report you are looking for does not exist or an error occurred." 
          onRetry={() => execute(id)}
        />
      </div>
    );
  }

  const riskColor = getRiskColorClass(report.riskLevel);

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/reports" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 break-all">{report.identifier}</h1>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="capitalize">{report.identifierType?.replace('_', ' ')}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDateTime(report.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <ScamTypeBadge type={report.scamType} />
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border border-${riskColor}-500/30 text-${riskColor}-400 bg-${riskColor}-500/10`}>
                    {report.status}
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5 mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Reporter's Message</h3>
                <p className="text-slate-200">{report.message}</p>
              </div>

              {report.location && (
                <div className="flex items-center text-slate-400">
                  <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                  {report.location.city}{report.location.state ? `, ${report.location.state}` : ''}
                </div>
              )}
            </div>

            {/* AI Analysis Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="bg-cyan-500/20 text-cyan-400 p-2 rounded-lg mr-3">🤖</span>
                AI Analysis
              </h2>
              {report.aiExplanation ? (
                <div className="prose prose-invert max-w-none text-slate-300">
                  {report.aiExplanation.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">AI analysis is pending or not available for this report.</p>
              )}
            </div>
            
            {/* Timeline */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
               <h2 className="text-xl font-bold text-white mb-6">Report Lifecycle</h2>
               <ReportTimeline report={report} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Risk Score */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-white mb-6">Risk Assessment</h3>
              <div className="w-48 h-48 mb-4">
                <RiskScoreGauge score={report.riskScore} />
              </div>
              <div className={`text-2xl font-bold text-${riskColor}-400 mb-1`}>
                {report.riskLevel} RISK
              </div>
              <p className="text-slate-400 text-center text-sm">
                Based on AI analysis and historical data matching.
              </p>
            </div>

            {/* Blockchain Status */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Verification</h3>
              <BlockchainBadge 
                blockchain={report.blockchain || { registered: false }} 
              />
              {report.blockchain?.registered && (
                <div className="mt-4 flex items-start gap-2 text-xs text-emerald-400/80 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>This report is permanently recorded on the blockchain and cannot be tampered with.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
