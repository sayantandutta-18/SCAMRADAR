import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { formatDate, formatIdentifier, getRiskColorClass, getRiskDotColor } from '../../utils/formatters';
import ScamTypeBadge from './ScamTypeBadge';
import BlockchainBadge from '../blockchain/BlockchainBadge';
import { Phone, CreditCard, Link as LinkIcon, Mail, Share2, Search } from 'lucide-react';

const getTypeIcon = (type) => {
  switch (type) {
    case 'PHONE': return <Phone className="w-4 h-4" />;
    case 'UPI': return <CreditCard className="w-4 h-4" />;
    case 'URL': return <LinkIcon className="w-4 h-4" />;
    case 'EMAIL': return <Mail className="w-4 h-4" />;
    case 'SOCIAL_MEDIA': return <Share2 className="w-4 h-4" />;
    default: return <Search className="w-4 h-4" />;
  }
};

const ReportCard = ({ report }) => {
  if (!report) return null;

  const {
    _id,
    id,
    identifier,
    identifierType,
    scamType,
    riskScore,
    riskLevel,
    location,
    createdAt,
    blockchain
  } = report;

  const displayId = _id || id;
  const riskColorClass = getRiskColorClass(riskLevel);

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-black/50">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
            {getTypeIcon(identifierType)}
          </div>
          <div>
            <h4 className="font-bold text-white text-lg tracking-wide">
              {formatIdentifier ? formatIdentifier(identifier, identifierType) : identifier}
            </h4>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">
              {identifierType}
            </p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md border ${riskColorClass} bg-opacity-10 bg-current`}>
          <div className={`w-2 h-2 rounded-full ${getRiskDotColor(riskLevel)} animate-pulse`}></div>
          <span className="text-xs font-bold">{riskScore}/100</span>
        </div>
      </div>

      <div className="mb-4">
        <ScamTypeBadge type={scamType} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-slate-400 border-t border-white/5 pt-4 mt-auto">
        <div className="flex flex-col gap-2">
          {location?.city && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{location.city}{location.state ? `, ${location.state}` : ''}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 mt-2 sm:mt-0">
          {blockchain && <BlockchainBadge blockchain={blockchain} compact={true} />}
          <a
            href={`/reports/${displayId}`}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors text-xs uppercase tracking-wider group-hover:underline underline-offset-4"
          >
            View Details <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
