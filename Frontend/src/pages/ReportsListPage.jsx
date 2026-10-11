import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getReports } from '../api/reports.api';
import { useApi } from '../hooks/useApi';
import FilterBar from '../components/reports/FilterBar';
import ReportCard from '../components/reports/ReportCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { Search } from 'lucide-react';

const ReportsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  
  const filters = {
    scamType: searchParams.get('scamType') || '',
    riskLevel: searchParams.get('riskLevel') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
  };

  const { data, loading, error, execute } = useApi(getReports);

  useEffect(() => {
    execute({ ...filters, page: currentPage, limit: 12 });
  }, [execute, currentPage, searchParams]);

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
    window.scrollTo(0, 0);
  };

  const reports = Array.isArray(data?.data) ? data.data : (data?.reports || data?.data?.reports || []);
  const totalPages = data?.totalPages || data?.data?.totalPages || 1;
  const totalReports = data?.total ?? data?.data?.total ?? reports.length;

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Reports</h1>
          <p className="text-slate-400">
            {loading ? 'Loading...' : `Showing ${reports.length} of ${totalReports} reports`}
          </p>
        </div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <LoadingSkeleton key={i} className="h-64 rounded-xl" />)}
            </div>
          ) : error ? (
            <ErrorState message="Failed to load reports." onRetry={() => execute({ ...filters, page: currentPage, limit: 12 })} />
          ) : reports.length === 0 ? (
            <EmptyState 
              icon={Search}
              title="No reports found" 
              message="Try adjusting your filters to find what you're looking for."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <ReportCard key={report._id} report={report} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50 hover:bg-white/10 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-slate-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50 hover:bg-white/10 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsListPage;
