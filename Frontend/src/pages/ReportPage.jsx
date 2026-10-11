import React from 'react';
import ReportForm from '../components/reports/ReportForm';
import { Info } from 'lucide-react';

const ReportPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">Report a Scam</h1>
          <p className="text-slate-400 text-lg">
            Help protect the community by reporting suspicious activity. Your report will be analyzed by AI and permanently recorded on the blockchain.
          </p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <ReportForm />
        </div>
        
        <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-4">
          <Info className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-emerald-400 font-semibold mb-1">How your report helps</h4>
            <p className="text-slate-300 text-sm">
              Every report adds to our collective intelligence. By sharing your experience, you help our AI identify new scam patterns and prevent others from falling victim to similar frauds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
