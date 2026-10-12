import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getReports } from '../api/reports.api';
import { useApi } from '../hooks/useApi';
import FilterBar from '../components/reports/FilterBar';
import ReportCard from '../components/reports/ReportCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { Search, FileText } from 'lucide-react';

const ReportsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const filters = useMemo(() => ({
    scamType: searchParams.get('scamType') || '',
    riskLevel: searchParams.get('riskLevel') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
  }), [searchParams]);

  const { data, loading, error, execute } = useApi(getReports);

  useEffect(() => {
    execute({ ...filters, page: currentPage, limit: 12 });
  }, [execute, currentPage, filters]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', '1');
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reports = Array.isArray(data?.data)
    ? data.data
    : (data?.reports || data?.data?.reports || []);
  const totalPages = data?.totalPages || data?.data?.totalPages || 1;
  const totalReports = data?.total ?? data?.data?.total ?? reports.length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>INCIDENT DATABASE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Reported Scam Incidents</h1>
        <p className="text-slate-400 text-sm mt-1">
          {loading ? 'Fetching threat records...' : `Displaying ${reports.length} of ${totalReports} verified incidents`}
        </p>
      </div>

      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            message="Failed to load incident reports."
            onRetry={() => execute({ ...filters, page: currentPage, limit: 12 })}
          />
        ) : reports.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No reports matching criteria"
            message="No incidents match the active filters. Try resetting your search or filter options."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <ReportCard key={report._id || report.id} report={report} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-40 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  Previous
                </button>
                <span className="text-slate-400 text-sm font-mono">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-40 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsListPage;
