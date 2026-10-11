import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { createReport } from '../../api/reports.api';
import { IDENTIFIER_TYPES, INDIAN_STATES } from '../../constants/scamTypes';
import { detectIdentifierType } from '../../utils/identifierDetector';
import { AlertCircle, CheckCircle2, Loader2, MapPin, Send } from 'lucide-react';
import BlockchainBadge from '../blockchain/BlockchainBadge';

const ReportForm = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    identifierType: IDENTIFIER_TYPES.PHONE,
    message: '',
    location: {
      city: '',
      state: '',
      latitude: null,
      longitude: null
    }
  });

  const [errors, setErrors] = useState({});
  const [successData, setSuccessData] = useState(null);
  const [duplicateReport, setDuplicateReport] = useState(null);

  const { execute: submitReport, loading, error } = useApi(createReport);

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      identifier: val,
      identifierType: detectIdentifierType(val) || prev.identifierType
    }));
    if (errors.identifier) setErrors(prev => ({ ...prev, identifier: null }));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) newErrors.identifier = 'Identifier is required';
    if (!formData.message.trim()) newErrors.message = 'Description is required';
    else if (formData.message.length < 20) newErrors.message = 'Description must be at least 20 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setDuplicateReport(null);
    setSuccessData(null);

    try {
      const response = await submitReport(formData);
      
      if (response?.data?.report) {
        setSuccessData(response.data.report);
      } else if (response?.report) {
        setSuccessData(response.report);
      } else {
        setSuccessData(response);
      }
      
      setFormData({
        identifier: '',
        identifierType: IDENTIFIER_TYPES.PHONE,
        message: '',
        location: { city: '', state: '', latitude: null, longitude: null }
      });
    } catch (err) {
      if (err.status === 409 && err.data?.existingReport) {
        setDuplicateReport(err.data.existingReport);
      }
    }
  };

  if (successData) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Report Submitted Successfully</h2>
          <p className="text-slate-300">Your report has been analyzed by AI and logged to the blockchain.</p>
        </div>
        
        <div className="bg-slate-900/50 rounded-xl p-6 text-left border border-white/5 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <span className="text-slate-400">Risk Score</span>
            <span className="text-xl font-bold text-white">{successData.riskScore}/100 ({successData.riskLevel})</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">AI Analysis</span>
            <p className="text-sm text-slate-200">{successData.aiAnalysis || 'Analysis complete.'}</p>
          </div>
          {successData.blockchain && (
            <div className="pt-4 mt-2 border-t border-white/10">
              <span className="text-slate-400 block mb-2">Blockchain Status</span>
              <BlockchainBadge blockchain={successData.blockchain} />
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setSuccessData(null)}
          className="text-emerald-400 hover:text-emerald-300 font-medium"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Report a Scam</h2>
        <p className="text-slate-400 text-sm">Help the community by reporting fraudulent identifiers.</p>
      </div>

      {error && !duplicateReport && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error.message || 'Failed to submit report. Please try again.'}</p>
        </div>
      )}

      {duplicateReport && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col gap-3 text-amber-400 text-sm">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>This identifier has already been reported. You can view the existing report.</p>
          </div>
          <a href={`/reports/${duplicateReport._id || duplicateReport.id}`} className="ml-8 underline font-medium hover:text-amber-300">
            View Existing Report
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Identifier Type</label>
          <select 
            value={formData.identifierType}
            onChange={(e) => setFormData(prev => ({ ...prev, identifierType: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          >
            {Object.values(IDENTIFIER_TYPES).map(type => (
              <option key={type} value={type} className="bg-slate-900 text-white">{type.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Identifier Details *</label>
          <input
            type="text"
            value={formData.identifier}
            onChange={handleIdentifierChange}
            placeholder="Phone, Email, UPI, URL..."
            className={`w-full bg-white/5 border ${errors.identifier ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all`}
          />
          {errors.identifier && <span className="text-red-400 text-xs">{errors.identifier}</span>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Detailed Description *</label>
        <textarea
          value={formData.message}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, message: e.target.value }));
            if (errors.message) setErrors(prev => ({ ...prev, message: null }));
          }}
          placeholder="Describe how the scam occurred, what was said, amounts requested, etc."
          rows={4}
          className={`w-full bg-white/5 border ${errors.message ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none`}
        />
        {errors.message && <span className="text-red-400 text-xs">{errors.message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">State (Optional)</label>
          <select
            value={formData.location.state}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              location: { ...prev.location, state: e.target.value } 
            }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          >
            <option value="" className="bg-slate-900 text-slate-500">Select State</option>
            {INDIAN_STATES.map(state => (
              <option key={state} value={state} className="bg-slate-900 text-white">{state}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">City (Optional)</label>
            <button 
              type="button" 
              onClick={getLocation}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" /> Auto-detect
            </button>
          </div>
          <input
            type="text"
            value={formData.location.city}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              location: { ...prev.location, city: e.target.value } 
            }))}
            placeholder="City"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 mt-4"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing with AI & Registering...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Report
          </>
        )}
      </button>
      
      <p className="text-center text-xs text-slate-500 mt-4">
        By submitting, you agree that this information will be permanently recorded on the blockchain.
      </p>
    </form>
  );
};

export default ReportForm;
