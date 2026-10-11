import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Brain, Link as LinkIcon, Zap, ArrowRight, Activity, MapPin } from 'lucide-react';
import { getReportStats, getReports } from '../api/reports.api';
import { useApi } from '../hooks/useApi';
import AnimatedCounter from '../components/common/AnimatedCounter';
import ReportCard from '../components/reports/ReportCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';

const HomePage = () => {
  const { data: statsData, loading: statsLoading, error: statsError, execute: fetchStats } = useApi(getReportStats);
  const { data: recentReportsData, loading: reportsLoading, error: reportsError, execute: fetchReports } = useApi(getReports);

  useEffect(() => {
    fetchStats();
    fetchReports({ limit: 5 });
  }, [fetchStats, fetchReports]);

  const stats = statsData?.data || {};
  const recentReports = recentReportsData?.data?.reports || [];
  
  const uniqueScamTypes = stats.scamTypeStats?.length || 0;
  const uniqueCities = stats.cityStats?.length || 0;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                SCAMRADAR
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto">
              AI-powered protection against digital scams. Report, detect, and prevent fraud in real-time.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeIn}>
              <Link to="/check" className="flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors w-full sm:w-auto justify-center">
                Check for Scam
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Link to="/report" className="flex items-center px-8 py-4 border border-blue-500 hover:bg-blue-500/10 text-white rounded-xl font-semibold transition-colors w-full sm:w-auto justify-center">
                Report a Scam
                <Shield className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div variants={fadeIn}>
              <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth'})} className="flex items-center px-8 py-4 border border-cyan-500 hover:bg-cyan-500/10 text-white rounded-xl font-semibold transition-colors w-full sm:w-auto justify-center">
                AI Assistant
                <Brain className="ml-2 w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeIn} className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Brain className="w-6 h-6 text-cyan-400" />
              <span className="font-medium">AI Analysis</span>
            </motion.div>
            <motion.div variants={fadeIn} className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <LinkIcon className="w-6 h-6 text-emerald-400" />
              <span className="font-medium">Blockchain Verified</span>
            </motion.div>
            <motion.div variants={fadeIn} className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Zap className="w-6 h-6 text-amber-400" />
              <span className="font-medium">Real-time Detection</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Platform Intelligence</h2>
            <p className="text-slate-400">Powered by community reports and AI analysis</p>
          </motion.div>

          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} className="h-32 rounded-xl" />)}
            </div>
          ) : statsError ? (
            <ErrorState message="Failed to load statistics" onRetry={fetchStats} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
                <Activity className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2">
                  <AnimatedCounter end={stats.totalReports || 0} />
                </div>
                <div className="text-slate-400 text-sm">Total Reports</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
                <Shield className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2">
                  <AnimatedCounter end={stats.highRiskReports || 0} />
                </div>
                <div className="text-slate-400 text-sm">High Risk Reports</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
                <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2">
                  <AnimatedCounter end={uniqueScamTypes} />
                </div>
                <div className="text-slate-400 text-sm">Scam Types Detected</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
                <MapPin className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2">
                  <AnimatedCounter end={uniqueCities} />
                </div>
                <div className="text-slate-400 text-sm">Cities Covered</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400">Protect yourself in three simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Check</h3>
              <p className="text-slate-400">Enter a phone number, UPI ID, or URL to instantly verify its safety against our database.</p>
            </motion.div>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-cyan-400">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Analyze</h3>
              <p className="text-slate-400">Our AI analyzes patterns and calculates a risk score while blockchain ensures data integrity.</p>
            </motion.div>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-400">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Protect</h3>
              <p className="text-slate-400">Report suspicious activity to protect others and receive real-time alerts about new scams.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <h2 className="text-3xl font-bold mb-2">Recent Reports</h2>
              <p className="text-slate-400">Latest activity from the community</p>
            </motion.div>
            <Link to="/reports" className="text-blue-400 hover:text-blue-300 font-medium flex items-center">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {reportsLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(3)].map((_, i) => <LoadingSkeleton key={i} className="h-48 rounded-xl" />)}
             </div>
          ) : reportsError ? (
            <ErrorState message="Failed to load recent reports" onRetry={() => fetchReports({ limit: 5 })} />
          ) : recentReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentReports.map(report => (
                <ReportCard key={report._id} report={report} compact />
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-12 bg-white/5 rounded-xl border border-white/10">
              No recent reports found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
