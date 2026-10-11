import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';

const ErrorState = ({ 
  title = "Telemetry Feed Error",
  message = "Failed to synchronize security telemetry. Please try again.", 
  onRetry, 
  statusCode 
}) => {
  return (
    <div className="w-full bg-rose-950/20 border border-rose-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-md my-4">
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-2xl bg-rose-500/10 blur-xl"></div>
        <div className="relative bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 text-rose-400">
          <AlertOctagon className="h-8 w-8 text-rose-400" />
        </div>
      </div>
      
      {statusCode && (
        <span className="text-rose-400/90 font-mono text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-2">
          HTTP {statusCode}
        </span>
      )}
      
      <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
      
      <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-all border border-white/10 shadow-md active:scale-95 cursor-pointer"
        >
          <RotateCw className="h-3.5 w-3.5 text-cyan-400" />
          Retry Connection
        </button>
      )}
    </div>
  );
};

export default ErrorState;
