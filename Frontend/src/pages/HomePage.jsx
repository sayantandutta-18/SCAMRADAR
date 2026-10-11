import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Brain, Link as LinkIcon, ArrowRight, Activity, MapPin, Search, AlertOctagon, Lock, Globe } from 'lucide-react';
import { getReportStats, getReports, getMapReports } from '../api/reports.api';
import { useApi } from '../hooks/useApi';
import AnimatedCounter from '../components/common/AnimatedCounter';
import ReportCard from '../components/reports/ReportCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import CyberThreatGlobe from '../components/globe/CyberThreatGlobe';

const HomePage = () => {
  const { data: statsData, loading: statsLoading, error: statsError, execute: fetchStats } = useApi(getReportStats);
  const { data: recentReportsData, loading: reportsLoading, error: reportsError, execute: fetchReports } = useApi(getReports);
  const { data: mapData, execute: fetchMap } = useApi(getMapReports);

  const [selectedGlobeReport, setSelectedGlobeReport] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchReports({ limit: 6 });
    fetchMap();
  }, [fetchStats, fetchReports, fetchMap]);

  const stats = statsData?.data || {};
  const recentReports = Array.isArray(recentReportsData?.data)
    ? recentReportsData.data
    : (recentReportsData?.reports || recentReportsData?.data?.reports || []);

  const mapReports = Array.isArray(mapData?.data)
    ? mapData.data
    : (Array.isArray(mapData) ? mapData : []);

  const uniqueScamTypes = stats.scamTypeStats?.length || 0;
  const uniqueCities = stats.cityStats?.length || 0;

  return (
    <div className="w-full text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 lg:py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition & CTAs */}
            <motion.div
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="font-semibold tracking-wider">AI SCAM DETECTION & IMMUTABLE PROOF</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Defend Against Scams With{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Real-Time AI
                </span>{' '}
                & Blockchain Proof
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Check suspicious phone numbers, UPI handles, phishing links, and job offers. Report fraudulent activity to preserve cryptographic evidence and protect the community.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/check"
                  className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Check a Scam</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/report"
                  className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all border border-white/10 hover:border-cyan-500/40 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <AlertOctagon className="w-4 h-4 text-cyan-400" />
                  <span>Report a Scam</span>
                </Link>

                <Link
                  to="/map"
                  className="w-full sm:w-auto px-5 py-3.5 bg-white/5 hover:bg-white/10 text-cyan-300 font-semibold rounded-xl text-sm transition-colors border border-cyan-500/20 flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>3D Threat Map</span>
                </Link>
              </div>

              {/* Mini trust features */}
              <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 text-left border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">Heuristic AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">SHA-256 On-Chain</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">Zero PII Leakage</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interactive 3D Cyber Threat Globe Preview */}
            <motion.div
              className="lg:col-span-5 h-[380px] sm:h-[440px] relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-full h-full relative rounded-2xl bg-gradient-to-b from-slate-950/60 to-slate-900/40 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Globe Canvas */}
                <CyberThreatGlobe
                  reports={mapReports}
                  selectedReport={selectedGlobeReport}
                  onSelectReport={setSelectedGlobeReport}
                  compact={true}
                  className="w-full h-full"
                />

                {/* Floating link to full Threat Map */}
                <div className="absolute top-3 right-3 z-20">
                  <Link
                    to="/map"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105"
                  >
                    <span>Full 3D Map</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Telemetry Section (Real API stats) */}
      <section className="py-16 sm:py-20 bg-slate-950/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Platform Threat Telemetry</h2>
            <p className="text-slate-400 text-sm mt-1">Live metrics compiled directly from verified reports.</p>
          </div>

          {statsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <LoadingSkeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : statsError ? (
            <ErrorState message="Unable to load statistics" onRetry={fetchStats} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-cyan-500/30 transition-all">
                <Activity className="w-7 h-7 text-cyan-400 mx-auto mb-2" />
                <div className="text-3xl sm:text-4xl font-extrabold mb-1 font-mono">
                  <AnimatedCounter end={stats.totalReports || 0} />
                </div>
                <div className="text-slate-400 text-xs uppercase tracking-wider font-mono">Total Recorded Reports</div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-red-500/30 transition-all">
                <Shield className="w-7 h-7 text-red-400 mx-auto mb-2" />
                <div className="text-3xl sm:text-4xl font-extrabold mb-1 font-mono text-red-400">
                  <AnimatedCounter end={stats.highRiskReports || 0} />
                </div>
                <div className="text-slate-400 text-xs uppercase tracking-wider font-mono">High-Risk Indicators</div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-amber-500/30 transition-all">
                <Brain className="w-7 h-7 text-amber-400 mx-auto mb-2" />
                <div className="text-3xl sm:text-4xl font-extrabold mb-1 font-mono">
                  <AnimatedCounter end={uniqueScamTypes} />
                </div>
                <div className="text-slate-400 text-xs uppercase tracking-wider font-mono">Scam Modalities Flagged</div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-emerald-500/30 transition-all">
                <MapPin className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
                <div className="text-3xl sm:text-4xl font-extrabold mb-1 font-mono text-emerald-400">
                  <AnimatedCounter end={uniqueCities} />
                </div>
                <div className="text-slate-400 text-xs uppercase tracking-wider font-mono">Urban Centers Monitored</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">How ScamRadar Protects You</h2>
            <p className="text-slate-400 text-sm mt-1">
              Three-layer verification bridging machine intelligence, community reports, and on-chain immutability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-cyan-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-xl font-black text-cyan-400 font-mono">
                01
              </div>
              <h3 className="text-xl font-bold">1. Query Identifier</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Check unknown phone numbers, payment addresses, or website links to identify known fraud patterns before engaging.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto text-xl font-black text-blue-400 font-mono">
                02
              </div>
              <h3 className="text-xl font-bold">2. AI Heuristic Analysis</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our Gemini AI engine parses deceptive language, urgency cues, and fake authority signatures to compute objective risk scores.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-xl font-black text-emerald-400 font-mono">
                03
              </div>
              <h3 className="text-xl font-bold">3. Immutable Evidence</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Reported incidents generate a canonical SHA-256 hash registered onto smart contracts, guaranteeing tamper-proof records for authorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Incident Feed */}
      <section className="py-16 sm:py-20 bg-slate-950/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Real-Time Incident Stream</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Recent Community Reports</h2>
            </div>
            <Link
              to="/reports"
              className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>Explore All Incidents</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {reportsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : reportsError ? (
            <ErrorState message="Failed to load recent reports" onRetry={() => fetchReports({ limit: 6 })} />
          ) : recentReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentReports.map((report) => (
                <ReportCard key={report._id || report.id} report={report} compact />
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-12 bg-slate-900/40 rounded-2xl border border-white/10">
              No recent reports recorded in the system yet.
            </div>
          )}
        </div>
      </section>

      {/* Trust & Privacy Notice */}
      <section className="py-12 border-t border-white/5 bg-slate-950/80">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
            <Lock className="w-3.5 h-3.5" />
            <span>ETHICAL THREAT INTELLIGENCE & PRIVACY STANDARD</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">
            ScamRadar adheres to data minimization protocols. Phone numbers and email addresses are partially masked in public telemetry. Risk evaluations reflect automated AI heuristics and unverified allegations until corroborated by authorities.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
