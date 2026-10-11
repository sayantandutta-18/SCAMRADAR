import React, { useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, ShieldAlert, AlertTriangle, Map } from 'lucide-react';
import { getReportStats, getReports } from '../api/reports.api';
import { useApi } from '../hooks/useApi';
import AnimatedCounter from '../components/common/AnimatedCounter';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import ReportCard from '../components/reports/ReportCard';
import { SCAM_TYPES } from '../constants/scamTypes';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const DashboardPage = () => {
  const { data: statsData, loading: statsLoading, error: statsError, execute: fetchStats } = useApi(getReportStats);
  const { data: recentReportsData, loading: reportsLoading, execute: fetchReports } = useApi(getReports);

  useEffect(() => {
    fetchStats();
    fetchReports({ limit: 5 });
  }, [fetchStats, fetchReports]);

  const stats = statsData?.data || null;
  const recentReports = recentReportsData?.data?.reports || [];

  const renderStats = () => {
    if (statsLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      );
    }
    if (statsError || !stats) {
      return <ErrorState message="Failed to load dashboard statistics" onRetry={fetchStats} />;
    }

    const uniqueScamTypes = stats.scamTypeStats?.length || 0;
    const uniqueCities = stats.cityStats?.length || 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg"><Activity className="w-6 h-6 text-blue-400" /></div>
            <div>
              <p className="text-slate-400 text-sm">Total Reports</p>
              <h3 className="text-2xl font-bold text-white"><AnimatedCounter end={stats.totalReports || 0} /></h3>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg"><ShieldAlert className="w-6 h-6 text-red-400" /></div>
            <div>
              <p className="text-slate-400 text-sm">High Risk Reports</p>
              <h3 className="text-2xl font-bold text-white"><AnimatedCounter end={stats.highRiskReports || 0} /></h3>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-lg"><AlertTriangle className="w-6 h-6 text-amber-400" /></div>
            <div>
              <p className="text-slate-400 text-sm">Scam Types</p>
              <h3 className="text-2xl font-bold text-white"><AnimatedCounter end={uniqueScamTypes} /></h3>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg"><Map className="w-6 h-6 text-emerald-400" /></div>
            <div>
              <p className="text-slate-400 text-sm">Cities Affected</p>
              <h3 className="text-2xl font-bold text-white"><AnimatedCounter end={uniqueCities} /></h3>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCharts = () => {
    if (statsLoading || !stats) return null;

    const pieData = stats.scamTypeStats?.map(item => ({
      name: item._id,
      value: item.count
    })) || [];

    const barData = stats.cityStats?.slice(0, 10).map(item => ({
      name: item._id,
      count: item.count
    })) || [];

    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
            <p className="text-white font-medium">{payload[0].name}</p>
            <p className="text-blue-400">{`Count: ${payload[0].value}`}</p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Scam Type Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ color: '#cbd5e1' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Top Cities Affected</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} angle={-45} textAnchor="end" />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Scam Intelligence Dashboard</h1>
          <p className="text-slate-400">Real-time statistics and insights from our network.</p>
        </div>

        {renderStats()}
        {renderCharts()}

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Reports</h2>
          {reportsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <LoadingSkeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          ) : recentReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentReports.map(report => (
                <ReportCard key={report._id} report={report} compact />
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No recent reports available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
