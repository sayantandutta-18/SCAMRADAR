import React, { useEffect, useState } from 'react';
import { Phone, CreditCard, Link as LinkIcon, Mail, Share2, X, Search, Loader2 } from 'lucide-react';
import { IDENTIFIER_TYPES } from '../../constants/scamTypes';
import { detectIdentifierType, getIdentifierPlaceholder } from '../../utils/identifierDetector';

const TypeIcon = ({ type, className }) => {
  switch (type) {
    case IDENTIFIER_TYPES.PHONE: return <Phone className={className} />;
    case IDENTIFIER_TYPES.UPI: return <CreditCard className={className} />;
    case IDENTIFIER_TYPES.URL: return <LinkIcon className={className} />;
    case IDENTIFIER_TYPES.EMAIL: return <Mail className={className} />;
    case IDENTIFIER_TYPES.SOCIAL_MEDIA: return <Share2 className={className} />;
    default: return <Search className={className} />;
  }
};

const IdentifierInput = ({ value, onChange, identifierType, onTypeChange, onSubmit, loading }) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    onChange(val);
    
    if (val) {
      const detected = detectIdentifierType(val);
      if (detected && detected !== identifierType) {
        onTypeChange(detected);
      }
    }
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && localValue.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Type Selectors */}
      <div className="flex flex-wrap gap-2">
        {Object.values(IDENTIFIER_TYPES).map((type) => (
          <button
            type="button"
            key={type}
            onClick={() => onTypeChange(type)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 border cursor-pointer ${
              identifierType === type
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-sm'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
            }`}
          >
            <TypeIcon type={type} className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">{type.replace('_', ' ')}</span>
          </button>
        ))}
      </div>

      {/* Main Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <TypeIcon type={identifierType} className="w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
        </div>
        
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={getIdentifierPlaceholder(identifierType) || "Enter identifier to check..."}
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl py-4 pl-12 pr-24 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-lg text-sm"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
          {localValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear identifier input"
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          <button
            type="button"
            onClick={onSubmit}
            disabled={!localValue.trim() || loading}
            aria-label="Search identifier"
            className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center w-10 h-10 cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentifierInput;
