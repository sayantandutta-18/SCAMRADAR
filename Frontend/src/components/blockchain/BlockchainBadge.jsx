import React, { useState } from 'react';
import { Shield, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { formatHash, formatDateTime } from '../../utils/formatters';

const BlockchainBadge = ({ blockchain, compact = false }) => {
  const [expanded, setExpanded] = useState(false);

  if (!blockchain) return null;

  const { registered, reportHash, transactionHash, timestamp } = blockchain;

  if (!registered) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-400 text-xs font-medium">
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>Pending Registration</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wide">
        <Shield className="w-3.5 h-3.5" />
        <span>Verified on Chain</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full sm:w-auto">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between gap-3 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg transition-colors w-full"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wide">Blockchain Verified</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="mt-2 p-4 bg-black/40 border border-white/5 rounded-lg text-xs font-mono space-y-3 overflow-hidden text-slate-300">
          <div>
            <span className="block text-slate-500 mb-1 font-sans text-[10px] uppercase">Transaction Hash</span>
            <a 
              href={`https://polygonscan.com/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 break-all"
            >
              {transactionHash}
            </a>
          </div>
          <div>
            <span className="block text-slate-500 mb-1 font-sans text-[10px] uppercase">Report Data Hash</span>
            <span className="break-all">{reportHash}</span>
          </div>
          {timestamp && (
            <div>
              <span className="block text-slate-500 mb-1 font-sans text-[10px] uppercase">Block Timestamp</span>
              <span>{formatDateTime(timestamp)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlockchainBadge;
