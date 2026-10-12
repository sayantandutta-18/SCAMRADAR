import React from 'react';
import ScamChecker from '../components/scam-checker/ScamChecker';
import BackButton from '../components/common/BackButton';
import { Lock, AlertCircle } from 'lucide-react';

const CheckPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-6">
        <BackButton label="Back to Home" fallbackPath="/" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          <Lock className="w-3.5 h-3.5" />
          <span>REAL-TIME THREAT VERIFICATION</span>
        </div>
      </div>

      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Check Identifier Safety</h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Verify suspicious phone numbers, UPI IDs, URLs, and emails against known scam patterns and community reports.
        </p>
      </div>

      <ScamChecker hideHeader />

      <div className="mt-8 bg-slate-900/60 border border-white/10 rounded-2xl p-5 flex items-start gap-4 max-w-4xl mx-auto">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-white block mb-0.5">Critical Verification Guidance</span>
          Threat scores are calculated using AI heuristic pattern detection combined with historical reports. A score of 0 or zero matches indicates no current record—not an absolute guarantee of legitimacy. Always verify directly with official banking and service providers.
        </div>
      </div>
    </div>
  );
};

export default CheckPage;
