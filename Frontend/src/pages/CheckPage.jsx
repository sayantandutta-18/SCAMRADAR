import React from 'react';
import ScamChecker from '../components/scam-checker/ScamChecker';
import { ShieldAlert } from 'lucide-react';

const CheckPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">Check for Scam</h1>
          <p className="text-slate-400 text-lg">
            Enter a phone number, UPI ID, URL, or email to check if it has been reported as a scam.
          </p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
          <ScamChecker />
        </div>
        
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-400 font-semibold mb-1">Safety Tip</h4>
            <p className="text-slate-300 text-sm">
              Even if a number or ID isn't in our database, always exercise caution. Scammers frequently change their contact information. If an offer seems too good to be true, it probably is.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckPage;
