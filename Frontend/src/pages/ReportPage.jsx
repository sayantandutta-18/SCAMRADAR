import React from 'react';
import ReportForm from '../components/reports/ReportForm';
import BackButton from '../components/common/BackButton';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const ReportPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-6">
        <BackButton label="Back to Home" fallbackPath="/" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>COMMUNITY DEFENSE REGISTRY</span>
        </div>
      </div>

      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Report a Scam Incident</h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Help protect others by reporting fraudulent phone numbers, UPI handles, links, or messages. AI evaluates threat indicators and evidence is hashed for integrity.
        </p>
      </div>

      <ReportForm hideHeader />

      <div className="mt-8 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 max-w-2xl mx-auto">
        <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white block mb-0.5">Community Defense Impact</span>
          Every report feeds our threat correlation engine. By logging suspicious encounters, you protect people from targeted scams before money or identity is compromised.
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
