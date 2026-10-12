import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import IdentifierInput from './IdentifierInput';
import RiskResult from './RiskResult';
import { useApi } from '../../hooks/useApi';
import { searchReports } from '../../api/reports.api';
import { IDENTIFIER_TYPES } from '../../constants/scamTypes';
import { detectIdentifierType } from '../../utils/identifierDetector';
import { Shield, AlertCircle } from 'lucide-react';

const ScamChecker = ({ hideHeader = false }) => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('identifier') || '';

  const [identifier, setIdentifier] = useState(initialQuery);
  const [identifierType, setIdentifierType] = useState(() => {
    return (initialQuery ? detectIdentifierType(initialQuery) : null) || IDENTIFIER_TYPES.PHONE;
  });
  const [results, setResults] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const { execute: search, loading, error, data } = useApi(searchReports);

  const handleSearch = async (overrideIdentifier, overrideType) => {
    const idToSearch = (overrideIdentifier !== undefined ? overrideIdentifier : identifier).trim();
    const typeToSearch = overrideType || identifierType;
    if (!idToSearch) return;

    setHasSearched(true);
    try {
      const response = await search({ identifier: idToSearch, identifierType: typeToSearch });
      const reports = Array.isArray(response?.data)
        ? response.data
        : (response?.data?.reports || response?.reports || (Array.isArray(response) ? response : []));
      setResults(reports);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  // Auto-search if mounted with initial query parameter
  useEffect(() => {
    if (initialQuery) {
      const detected = detectIdentifierType(initialQuery) || IDENTIFIER_TYPES.PHONE;
      setIdentifier(initialQuery);
      setIdentifierType(detected);
      handleSearch(initialQuery, detected);
    }
  }, [initialQuery]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {!hideHeader && (
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            Scam Checker
          </h2>
          <p className="text-slate-400">
            Enter a phone number, UPI ID, email, or URL to check if it has been reported for fraudulent activity.
          </p>
        </div>
      )}

      <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 shadow-2xl">
        <IdentifierInput
          value={identifier}
          onChange={setIdentifier}
          identifierType={identifierType}
          onTypeChange={setIdentifierType}
          onSubmit={handleSearch}
          loading={loading}
        />
      </div>

      {loading && (
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
          <p className="text-slate-400">Analyzing identifier against global database...</p>
        </div>
      )}

      {error && (
        <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-4 text-red-400">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-300">Analysis Failed</h4>
            <p className="text-sm opacity-90 mt-1">{error.message || 'Something went wrong while checking the identifier. Please try again.'}</p>
            <button 
              type="button"
              onClick={handleSearch}
              className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && hasSearched && results !== null && (
        <RiskResult 
          reports={results} 
          identifier={identifier} 
          identifierType={identifierType} 
        />
      )}
      
      {!hasSearched && (
        <div className="text-center p-8 opacity-50">
          <p className="text-slate-400 text-sm">Protected by Advanced AI & Blockchain Technology</p>
        </div>
      )}
    </div>
  );
};

export default ScamChecker;
