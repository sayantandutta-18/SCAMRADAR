import React, { useState } from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';

const ErrorState = ({ 
  title = "Telemetry Feed Error",
  message = "Failed to synchronize security telemetry. Please try again.", 
  onRetry, 
  statusCode,
  compact = false,
  className = ''
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;
    setIsRetrying(true);
    try {
      await Promise.resolve(onRetry());
    } catch (e) {
      // Gracefully catch any unhandled rejection from onRetry
    } finally {
      setIsRetrying(false);
    }
  };

  if (compact) {
    return (
      <div className={`w-full bg-rose-950/25 border border-rose-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3.5 backdrop-blur-md ${className}`}>
        <div className="flex items-center gap-3 w-full sm:w-auto text-left">
          <div className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 flex-shrink-0">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">{title}</h4>
              {statusCode && (
                <span className="text-rose-400 font-mono text-[10px] px-1.5 py-0.2 rounded bg-rose-500/15 border border-rose-500/30">
                  HTTP {statusCode}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{message}</p>
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-all border border-rose-500/20 hover:border-cyan-500/40 shadow-sm active:scale-95 cursor-pointer flex-shrink-0"
          >
            <RotateCw className={`h-3.5 w-3.5 text-cyan-400 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Retrying...' : 'Retry Connection'}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full bg-rose-950/20 border border-rose-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-md my-4 ${className}`}>
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
          type="button"
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/90 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all border border-white/10 shadow-md active:scale-95 cursor-pointer"
        >
          <RotateCw className={`h-3.5 w-3.5 text-cyan-400 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Retrying...' : 'Retry Connection'}</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
