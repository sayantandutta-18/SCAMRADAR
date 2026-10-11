import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getModerationReports,
  updateReportModerationStatus,
  getDisputes,
  resolveDispute,
} from '../api/moderation.api';
import {
  ShieldCheck,
  AlertTriangle,
  Scale,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  ExternalLink,
  MessageSquare,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react';

const ModerationPage = () => {
  const { user, isModerator, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('reports'); // 'reports' or 'disputes'
  const [reports, setReports] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Selected for review modal
  const [reviewReport, setReviewReport] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('VERIFIED_ACCURATE');
  const [reviewNotes, setReviewNotes] = useState('');

  // Selected for dispute resolve modal
  const [reviewDispute, setReviewDispute] = useState(null);
  const [disputeResolution, setDisputeResolution] = useState('UPHELD');
  const [disputeNotes, setDisputeNotes] = useState('');

  const fetchData = async () => {
    if (!isModerator) return;
    setLoading(true);
    try {
      if (activeTab === 'reports') {
        const res = await getModerationReports({ limit: 25 });
        if (res.success) setReports(res.data || []);
      } else {
        const res = await getDisputes({ limit: 25 });
        if (res.success) setDisputes(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load moderation queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModerator) {
      fetchData();
    }
  }, [isModerator, activeTab]);

  const handleUpdateReportStatus = async (e) => {
    e.preventDefault();
    if (!reviewReport) return;

    try {
      const res = await updateReportModerationStatus(reviewReport._id, {
        moderationStatus: reviewStatus,
        notes: reviewNotes,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Report moderation status updated to ${reviewStatus}. Credibility recalculated.`,
        });
        setReviewReport(null);
        setReviewNotes('');
        fetchData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update report status.' });
    }
  };

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    if (!reviewDispute) return;

    try {
      const res = await resolveDispute(reviewDispute._id, {
        status: disputeResolution,
        moderatorNotes: disputeNotes,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Dispute ${reviewDispute._id} resolved as ${disputeResolution}.`,
        });
        setReviewDispute(null);
        setDisputeNotes('');
        fetchData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to resolve dispute.' });
    }
  };

  // Moderator gate & quick demo demo sign in helper
  if (!isAuthenticated || !isModerator) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center backdrop-blur-md shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Moderation Console</h2>
          <p className="text-sm text-slate-400 mb-6">
            Access to this console requires verified <span className="text-cyan-400 font-semibold">MODERATOR</span> or <span className="text-teal-400 font-semibold">ADMIN</span> credentials to review report credibility and investigate filed disputes.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/auth', { state: { from: '/moderation' } })}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              Sign In with Moderator Account
            </button>
            <p className="text-[11px] text-slate-500">
              Tip: On the Sign In page, use "Demo Moderator" to quickly create or authenticate as a reviewer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
                Community Trust & Moderation Console
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                Independent report verification • Neutrality safeguards • Dispute resolution desk
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
          <UserCheck className="w-3.5 h-3.5" /> Moderator Session Active ({user?.name})
        </div>
      </div>

      {/* Ethics notice */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Ethical Moderation Policy:</span> Moderation decisions must adhere to strict presumption of innocence and evidence corroboration. Use neutral terminology ("reported as suspicious", "evidence submitted") rather than judicial assertions of guilt.
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`mb-6 p-3.5 rounded-xl text-xs border flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="text-xs opacity-75 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> Report Credibility Review ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'disputes'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Filed Disputes Queue ({disputes.length})
        </button>
      </div>

      {/* Tab 1: Reports Moderation */}
      {activeTab === 'reports' && (
        <div>
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-400">Loading moderation queue...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
              <p className="text-xs text-slate-400">No reports requiring moderation at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => {
                const cred = report.credibility || {};
                const modStatus = cred.moderationStatus || 'UNREVIEWED';

                return (
                  <div
                    key={report._id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              modStatus === 'VERIFIED_ACCURATE'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : modStatus === 'FLAGGED_INACCURATE'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : modStatus === 'DISPUTED'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {modStatus.replace(/_/g, ' ')}
                          </span>

                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            Credibility Score: {cred.score ?? 50}/100 ({cred.level || 'UNVERIFIED'})
                          </span>

                          <span className="text-[11px] text-slate-400">
                            {cred.corroborationCount || 1} Corroborating Report(s)
                          </span>

                          <span className="text-[11px] text-slate-500">
                            • {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-100 mb-1">
                          {report.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                          {report.message}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] text-slate-500">
                          <span>
                            Identifier: <strong className="text-slate-300 font-mono">{report.identifier}</strong> ({report.identifierType})
                          </span>
                          <span>Category: <strong className="text-slate-300">{report.scamType?.replace(/_/g, ' ')}</strong></span>
                          {report.location?.city && <span>Location: <strong className="text-slate-300">{report.location.city}</strong></span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                        <button
                          onClick={() => navigate(`/reports/${report._id}`)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View Report
                        </button>

                        <button
                          onClick={() => {
                            setReviewReport(report);
                            setReviewStatus(modStatus === 'UNREVIEWED' ? 'VERIFIED_ACCURATE' : modStatus);
                            setReviewNotes(cred.moderationNotes || '');
                          }}
                          className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/10"
                        >
                          Review & Score
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Disputes Queue */}
      {activeTab === 'disputes' && (
        <div>
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-400">Loading disputes...</p>
            </div>
          ) : disputes.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
              <p className="text-xs text-slate-400">No active disputes submitted.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map((dispute) => (
                <div
                  key={dispute._id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            dispute.status === 'UPHELD'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : dispute.status === 'DISMISSED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          Dispute {dispute.status}
                        </span>

                        <span className="text-[11px] font-semibold text-slate-300">
                          Reason: {dispute.reason?.replace(/_/g, ' ')}
                        </span>

                        <span className="text-[11px] text-slate-500">
                          • Filed {new Date(dispute.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-100 mb-1">
                        Dispute by {dispute.disputedBy?.name} ({dispute.disputedBy?.email})
                      </h4>
                      <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-3 whitespace-pre-wrap">
                        "{dispute.explanation}"
                      </p>

                      {dispute.supportingEvidence && (
                        <p className="text-xs text-slate-400 mb-2">
                          Supporting Evidence: <span className="text-cyan-400 font-mono text-[11px]">{dispute.supportingEvidence}</span>
                        </p>
                      )}

                      {dispute.report && (
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
                          Target Report: <strong className="text-slate-200">{dispute.report.title}</strong> ({dispute.report.scamType})
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 self-start">
                      <button
                        onClick={() => {
                          setReviewDispute(dispute);
                          setDisputeResolution('UPHELD');
                          setDisputeNotes(dispute.moderatorNotes || '');
                        }}
                        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/10"
                      >
                        Resolve Dispute
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: REPORT MODERATION REVIEW */}
      {reviewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 mb-1">Moderator Review & Credibility Scoring</h3>
            <p className="text-xs text-slate-400 mb-4 line-clamp-1">{reviewReport.title}</p>

            <form onSubmit={handleUpdateReportStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Moderation Verdict
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="modStatus"
                      value="VERIFIED_ACCURATE"
                      checked={reviewStatus === 'VERIFIED_ACCURATE'}
                      onChange={(e) => setReviewStatus(e.target.value)}
                    />
                    <div>
                      <strong className="text-emerald-400 block">Verified Accurate (+20 Credibility)</strong>
                      <span className="text-[11px] text-slate-400">Independent evidence confirms high likelihood of fraudulent impersonation.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="modStatus"
                      value="FLAGGED_INACCURATE"
                      checked={reviewStatus === 'FLAGGED_INACCURATE'}
                      onChange={(e) => setReviewStatus(e.target.value)}
                    />
                    <div>
                      <strong className="text-red-400 block">Flag Inaccurate (-35 Credibility Penalty)</strong>
                      <span className="text-[11px] text-slate-400">Disputed or inaccurate claims regarding legitimate entity.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="modStatus"
                      value="DISPUTED"
                      checked={reviewStatus === 'DISPUTED'}
                      onChange={(e) => setReviewStatus(e.target.value)}
                    />
                    <div>
                      <strong className="text-amber-400 block">Mark as Disputed (-15 Credibility)</strong>
                      <span className="text-[11px] text-slate-400">Contested incident pending corroborating evidentiary documents.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Moderator Evaluation Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Reasoning for verdict, verified phone records, official entity statement..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewReport(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Apply Verdict
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESOLVE DISPUTE */}
      {reviewDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 mb-1">Resolve Community Dispute</h3>
            <p className="text-xs text-slate-400 mb-4">
              Filed by {reviewDispute.disputedBy?.name} ({reviewDispute.disputedBy?.email})
            </p>

            <form onSubmit={handleResolveDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Resolution Decision
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="dispRes"
                      value="UPHELD"
                      checked={disputeResolution === 'UPHELD'}
                      onChange={(e) => setDisputeResolution(e.target.value)}
                    />
                    <div>
                      <strong className="text-red-400 block">Uphold Dispute (Flag Report Inaccurate)</strong>
                      <span className="text-[11px] text-slate-400">The dispute is valid. The underlying report will be flagged as inaccurate.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="dispRes"
                      value="DISMISSED"
                      checked={disputeResolution === 'DISMISSED'}
                      onChange={(e) => setDisputeResolution(e.target.value)}
                    />
                    <div>
                      <strong className="text-emerald-400 block">Dismiss Dispute (Verify Report Accurate)</strong>
                      <span className="text-[11px] text-slate-400">Evidence confirms fraudulent activity despite the dispute claim.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="dispRes"
                      value="UNDER_REVIEW"
                      checked={disputeResolution === 'UNDER_REVIEW'}
                      onChange={(e) => setDisputeResolution(e.target.value)}
                    />
                    <div>
                      <strong className="text-amber-400 block">Keep Under Review</strong>
                      <span className="text-[11px] text-slate-400">Awaiting corroborating evidence from disputant.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Dispute Findings / Resolution Statement
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Official finding explaining resolution decision..."
                  value={disputeNotes}
                  onChange={(e) => setDisputeNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewDispute(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModerationPage;
