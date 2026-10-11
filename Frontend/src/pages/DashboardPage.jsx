import React, { useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, ShieldAlert, AlertTriangle, MapPin, RefreshCw, Layers } from 'lucide-react';
import { getReportStats, getReports } from '../api/reports.api';
import { useApi } from '../hooks/useApi';
import AnimatedCounter from '../components/common/AnimatedCounter';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import ReportCard from '../components/reports/ReportCard';

const COLORS = ['#06b6d4', '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#f97316'];

const DashboardPage = () => {
  const { data: statsData, loading: statsLoading, error: statsError, execute: fetchStats } = useApi(getReportStats);
  const { data: recentReportsData, loading: reportsLoading, error: reportsError, execute: fetchReports } = useApi(getReports);

  useEffect(() => {
    fetchStats();
    fetchReports({ limit: 6 });
  }, [fetchStats, fetchReports]);

  const stats = statsData?.data || null;
  const recentReports = Array.isArray(recentReportsData?.data)
    ? recentReportsData.data
    : (recentReportsData?.reports || recentReportsData?.data?.reports || []);

  const renderStats = () => {
    if (statsLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      );
    }

    if (statsError || !stats) {
      return (
        <div className="mb-8">
          <ErrorState message="Failed to load threat intelligence statistics" onRetry={fetchStats} />
        </div>
      );
    }

    const uniqueScamTypes = stats.scamTypeStats?.length || 0;
    const uniqueCities = stats.cityStats?.length || 0;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-blue-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-mono">Total Reports</p>
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
              <p className="text-slate-400 text-xs uppercase tracking-wider font-mono">Threat Types</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                <AnimatedCounter end={uniqueScamTypes} />
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
              <MapPin className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-mono">Cities Monitored</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                <AnimatedCounter end={uniqueCities} />
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCharts = () => {
    if (statsLoading || !stats) return null;

    const pieData =
      stats.scamTypeStats?.map((item) => ({
        name: (item._id || 'OTHER').replace(/_/g, ' '),
        value: item.count,
      })) || [];

    const barData =
      stats.cityStats?.slice(0, 8).map((item) => ({
        name: item._id || 'Unspecified',
        count: item.count,
      })) || [];

    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-slate-950 border border-white/20 p-3 rounded-xl shadow-2xl backdrop-blur-md">
            <p className="text-white font-medium text-xs">{payload[0].name}</p>
            <p className="text-cyan-400 font-bold text-sm">{`Reports: ${payload[0].value}`}</p>
          </div>
        );
      }
      return null;
    };

    if (pieData.length === 0 && barData.length === 0) {
      return (
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-8 text-center text-slate-400 mb-8">
          No statistical aggregates recorded yet.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Scam Type Distribution
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="#0f172a"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ color: '#cbd5e1', fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Top Locations by Incident Count
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#1e293b', opacity: 0.5 }} content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Threat Intelligence Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time analytics and distribution patterns across reported threats.
          </p>
        </div>

        <button
          onClick={() => {
            fetchStats();
            fetchReports({ limit: 6 });
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {renderStats()}
      {renderCharts()}

      <div>
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Recent Community Reports
        </h2>

        {reportsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : reportsError ? (
          <ErrorState message="Failed to load recent reports" onRetry={() => fetchReports({ limit: 6 })} />
        ) : recentReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentReports.map((report) => (
              <ReportCard key={report._id || report.id} report={report} compact />
            ))}
          </div>
        ) : (
          <EmptyState title="No reports yet" message="There are currently no reports recorded in the system." />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
