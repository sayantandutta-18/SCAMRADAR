import React from 'react';
import { SCAM_TYPES, INDIAN_STATES } from '../../constants/scamTypes';
import { Filter, X } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange }) => {
  
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  const handleClear = () => {
    onFilterChange({ scamType: '', state: '', city: '', page: 1 });
  };

  const hasFilters = filters.scamType || filters.state || filters.city;

  return (
    <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
      <div className="flex items-center gap-2 text-slate-300 md:mr-2 w-full md:w-auto">
        <Filter className="w-5 h-5" />
        <span className="font-semibold">Filters:</span>
      </div>

      <select
        value={filters.scamType || ''}
        onChange={(e) => handleChange('scamType', e.target.value)}
        className="w-full md:w-auto bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">All Scam Types</option>
        {Object.values(SCAM_TYPES).map(type => (
          <option key={type} value={type}>{type.replace('_', ' ')}</option>
        ))}
      </select>

      <select
        value={filters.state || ''}
        onChange={(e) => handleChange('state', e.target.value)}
        className="w-full md:w-auto bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">All States</option>
        {INDIAN_STATES.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search City..."
        value={filters.city || ''}
        onChange={(e) => handleChange('city', e.target.value)}
        className="w-full md:w-auto flex-grow bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {hasFilters && (
        <button
          onClick={handleClear}
          className="w-full md:w-auto flex items-center justify-center gap-1 px-3 py-2 text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
        >
          <X className="w-4 h-4" /> Clear
        </button>
      )}
    </div>
  );
};

export default FilterBar;
