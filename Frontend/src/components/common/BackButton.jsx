import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ 
  label = 'Back', 
  fallbackPath = '/', 
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
