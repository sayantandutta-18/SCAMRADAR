import React from 'react';
import { SCAM_TYPES } from '../../constants/scamTypes';
import { formatScamType } from '../../utils/formatters';

const getScamTypeStyle = (type) => {
  switch (type) {
    case SCAM_TYPES.PHISHING:
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case SCAM_TYPES.UPI_FRAUD:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case SCAM_TYPES.JOB_SCAM:
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case SCAM_TYPES.LOAN_SCAM:
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case SCAM_TYPES.INVESTMENT_SCAM:
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case SCAM_TYPES.IMPERSONATION:
      return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }
};

const ScamTypeBadge = ({ type, className = '' }) => {
  if (!type) return null;
  
  const styleClass = getScamTypeStyle(type);
  const displayText = formatScamType ? formatScamType(type) : type.replace('_', ' ');

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styleClass} ${className}`}>
      {displayText}
    </span>
  );
};

export default ScamTypeBadge;
