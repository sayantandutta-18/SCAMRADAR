import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Eye, EyeOff, Phone, CreditCard, Link as LinkIcon, Mail, Share2, Search, ShieldCheck } from 'lucide-react';
import { formatDate, formatIdentifier, maskIdentifier, getRiskColorClass, getRiskDotColor } from '../../utils/formatters';
import ScamTypeBadge from './ScamTypeBadge';

const getTypeIcon = (type) => {
  switch (type) {
    case 'PHONE':
      return <Phone className="w-4 h-4 text-cyan-400" />;
    case 'UPI':
      return <CreditCard className="w-4 h-4 text-purple-400" />;
    case 'URL':
      return <LinkIcon className="w-4 h-4 text-blue-400" />;
    case 'EMAIL':
      return <Mail className="w-4 h-4 text-amber-400" />;
    case 'SOCIAL_MEDIA':
      return <Share2 className="w-4 h-4 text-pink-400" />;
    default:
      return <Search className="w-4 h-4 text-slate-400" />;
  }
};

const ReportCard = ({ report, compact = false }) => {
  const [showFull, setShowFull] = useState(false);

  if (!report) return null;

  const {
    _id,
    id,
    identifier,
    identifierType,
    scamType,
    riskScore,
    riskLevel = 'UNKNOWN',
    location,
    createdAt,
    blockchain,
    message,
  } = report;

  const displayId = _id || id;
  const riskColorClass = getRiskColorClass(riskLevel);
  const dotColor = getRiskDotColor(riskLevel);

  const displayedIdentifier = showFull
    ? formatIdentifier(identifier, identifierType)
    : maskIdentifier(identifier, identifierType);

  return (
    <div className="group relative bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-white/5 flex-shrink-0">
              {getTypeIcon(identifierType)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base sm:text-lg tracking-wide truncate">
                  {displayedIdentifier}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowFull(!showFull)}
                  className="text-slate-500 hover:text-cyan-400 p-0.5 transition-colors"
                  title={showFull ? 'Mask identifier' : 'Reveal identifier'}
                  aria-label={showFull ? 'Mask identifier' : 'Reveal identifier'}
                >
                  {showFull ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-cyan-400/80 font-mono uppercase tracking-wider">
                {identifierType?.replace('_', ' ')}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-black/40 text-xs font-semibold ${riskColorClass}`}>
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: dotColor }}
            />
            <span>{riskScore !== undefined ? `${riskScore}/100` : 'N/A'}</span>
          </div>
        </div>

        {/* Badge & Summary */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <ScamTypeBadge type={scamType} />
          {blockchain?.registered && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              <ShieldCheck className="w-3 h-3" /> ON-CHAIN
            </span>
          )}
        </div>

        {message && !compact && (
          <p className="text-slate-300 text-sm line-clamp-2 mb-4 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
            "{message}"
          </p>
        )}
      </div>

      {/* Footer Details */}
      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 mt-2">
        <div className="flex flex-wrap items-center gap-3">
          {location?.city && (
            <div className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{location.city}{location.state ? `, ${location.state}` : ''}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        <Link
          to={`/reports/${displayId}`}
          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors group-hover:translate-x-0.5 duration-200"
        >
          <span>Intel & Proof</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default ReportCard;
