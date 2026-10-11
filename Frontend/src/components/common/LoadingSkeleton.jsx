import React from 'react';

const LoadingSkeleton = ({ type = 'text', lines = 3, className = '' }) => {
  if (type === 'card') {
    return (
      <div className={`glass-panel rounded-2xl p-6 w-full relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        <div className="flex items-center gap-3.5 mb-5">
          <div className="h-10 w-10 rounded-xl bg-slate-800/80 animate-pulse flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-36 bg-slate-800/80 rounded-md animate-pulse" />
            <div className="h-3 w-20 bg-slate-800/60 rounded-md animate-pulse" />
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="h-3.5 w-full bg-slate-800/70 rounded animate-pulse" />
          <div className="h-3.5 w-4/5 bg-slate-800/60 rounded animate-pulse" />
          <div className="h-3.5 w-2/3 bg-slate-800/50 rounded animate-pulse" />
        </div>
        <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="h-3 w-24 bg-slate-800/60 rounded animate-pulse" />
          <div className="h-3 w-16 bg-slate-800/60 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`glass-panel rounded-2xl p-6 w-full relative overflow-hidden h-72 flex flex-col justify-between ${className}`}>
        <div className="h-4 w-40 bg-slate-800/80 rounded animate-pulse mb-6" />
        <div className="flex items-end gap-3 justify-between flex-1 pb-2">
          {[35, 65, 45, 85, 60, 40, 90, 50, 75, 55].map((h, i) => (
            <div 
              key={i} 
              className="w-full bg-gradient-to-t from-blue-900/30 to-blue-500/20 rounded-t-md animate-pulse" 
              style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }} 
            />
          ))}
        </div>
        <div className="h-3 w-full bg-slate-800/50 rounded mt-4" />
      </div>
    );
  }

  return (
    <div className={`space-y-3 w-full ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <div 
          key={idx} 
          className="h-4 bg-slate-800/70 rounded-md animate-pulse" 
          style={{ 
            width: `${Math.max(50, 100 - idx * 12)}%`,
            animationDelay: `${idx * 150}ms`
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
