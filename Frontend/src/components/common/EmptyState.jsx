import React from 'react';
import { SearchX } from 'lucide-react';

const EmptyState = ({ 
  title = "No threat records found", 
  message, 
  description = "No matching scam reports or intelligence data were found matching your query.", 
  icon: Icon = SearchX, 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 glass-panel rounded-2xl text-center border border-white/[0.07] my-4">
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl"></div>
        <div className="relative bg-slate-900/80 p-5 rounded-2xl border border-white/10 text-slate-400">
          <Icon className="h-10 w-10 text-cyan-400" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-6">
        {message || description}
      </p>
      
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl transition-all font-medium text-sm shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
