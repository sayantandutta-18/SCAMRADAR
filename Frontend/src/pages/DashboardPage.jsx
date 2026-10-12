import React, { useState, useEffect, useCallback } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import {
  Activity,
  ShieldAlert,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Layers,
  TrendingUp,
  Compass,
} from 'lucide-react';
import {
  getReportStats,
  getReports,
  getTimeSeriesTrends,
  getCategoryAnalytics,
  getGeographicHotspots,
} from '../api/reports.api';
import AnimatedCounter from '../components/common/AnimatedCounter';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import ReportCard from '../components/reports/ReportCard';
import BackButton from '../components/common/BackButton';
import { SCAM_TYPES } from '../constants/scamTypes';

const COLORS = ['#06b6d4', '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs">
        <p className="text-slate-300 font-bold mb-1">{label || payload[0].name}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color || '#06b6d4' }} className="font-semibold">
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [trends, setTrends] = useState([]);
  const [categoryAnalytics, setCategoryAnalytics] = useState([]);
  const [hotspots, setHotspots] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [trendInterval, setTrendInterval] = useState('day');
  const [trendDays, setTrendDays] = useState(90);
  const [filterRiskLevel, setFilterRiskLevel] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, reportsRes, trendsRes, catRes, hotRes] = await Promise.all([
        getReportStats(),
        getReports({
          limit: 6,
          riskLevel: filterRiskLevel || undefined,
          scamType: filterCategory || undefined,
        }),
        getTimeSeriesTrends({ interval: trendInterval, days: trendDays }),
        getCategoryAnalytics(),
        getGeographicHotspots(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (reportsRes.success) setReports(reportsRes.data || []);
      if (trendsRes.success) setTrends(trendsRes.data?.trends || []);
      if (catRes.success) setCategoryAnalytics(catRes.data || []);
      if (hotRes.success) setHotspots(hotRes.data || []);
    } catch (err) {
      console.error('Failed to load threat intelligence dashboard:', err);
      setError(err.message || 'Failed to load threat intelligence');
    } finally {
      setLoading(false);
    }
  }, [trendInterval, trendDays, filterRiskLevel, filterCategory]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <BackButton fallbackPath="/" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Threat Intelligence Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time multi-dimensional aggregation across verified database incident clusters.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-teal-400 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Top Stat Cards */}
      {error && !stats && (
        <div className="mb-8">
          <ErrorState
            title="Analytics Telemetry Feed Unavailable"
            message={typeof error === 'string' ? error : (error?.message || "Failed to synchronize threat intelligence metrics. Please verify server connection.")}
            onRetry={fetchDashboardData}
          />
        </div>
      )}

      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-mono">Total Threats</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                  <AnimatedCounter end={stats.totalReports || 0} />
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-red-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-mono">High Risk</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-red-400 mt-0.5">
                  <AnimatedCounter end={stats.highRiskReports || 0} />
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-amber-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-mono">Active Categories</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                  <AnimatedCounter end={categoryAnalytics.length || 0} />
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-teal-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                <MapPin className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-mono">City Hotspots</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-teal-300 mt-0.5">
                  <AnimatedCounter end={hotspots.length || 0} />
                </h3>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Real Time-Series Trend Aggregations */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Incident Velocity & Time-Series Trends
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real chronological grouping by MongoDB date truncation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              {['day', 'week', 'month'].map((iv) => (
                <button
                  type="button"
                  key={iv}
                  onClick={() => setTrendInterval(iv)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    trendInterval === iv
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {iv}
                </button>
              ))}
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[7, 30, 90].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setTrendDays(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    trendDays === d
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {trends.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
            Insufficient timestamped incidents within selected {trendDays}-day window.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ color: '#cbd5e1', fontSize: '11px', paddingTop: '10px' }}
                />
                <Area
                  type="monotone"
                  dataKey="totalReports"
                  name="Total Reports"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="highRiskCount"
                  name="High Risk Incidents"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorHigh)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Category Deep-Dive & Hotspots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Category Breakdown */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Category Breakdown & Threat Intensity
          </h3>

          {categoryAnalytics.length === 0 ? (
            <p className="text-xs text-slate-500 py-12 text-center">No category data recorded.</p>
          ) : (
            <div className="space-y-3.5">
              {categoryAnalytics.slice(0, 6).map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      {cat.category?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400">
                      {cat.count} reports ({cat.percentage}%) • Avg Risk: {cat.avgRiskScore}/100
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: COLORS[idx % COLORS.length],
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Geographic Hotspots */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-400" /> Geographic Threat Hotspots
          </h3>

          {hotspots.length === 0 ? (
            <p className="text-xs text-slate-500 py-12 text-center">No location coordinates recorded.</p>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {hotspots.slice(0, 6).map((spot, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-200">{spot.city}</p>
                      <span className="text-[10px] text-slate-500">{spot.state || 'State N/A'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-teal-300">{spot.count} incidents</span>
                    <span className="block text-[10px] text-slate-400">Avg Risk {spot.avgRiskScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Multi-Parameter Filter Bar & Report Feed */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" /> Filtered Incident Feed ({reports.length})
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterRiskLevel}
              onChange={(e) => setFilterRiskLevel(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="">All Risk Levels</option>
              <option value="HIGH">High Risk Only</option>
              <option value="MEDIUM">Medium Risk Only</option>
              <option value="LOW">Low Risk Only</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="">All Categories</option>
              {Object.entries(SCAM_TYPES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label || k}
                </option>
              ))}
            </select>
          </div>
        </div>

        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reports.map((report) => (
              <ReportCard key={report._id || report.id} report={report} compact />
            ))}
          </div>
        ) : (
          <EmptyState title="No matching reports" message="No database records matched your active filter criteria." />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
