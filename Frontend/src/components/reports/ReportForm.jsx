import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { createReport } from '../../api/reports.api';
import { IDENTIFIER_TYPES, INDIAN_STATES } from '../../constants/scamTypes';
import { detectIdentifierType } from '../../utils/identifierDetector';
import { AlertCircle, CheckCircle2, Loader2, MapPin, Send, ArrowRight, Info } from 'lucide-react';
import BlockchainBadge from '../blockchain/BlockchainBadge';
import { formatDate } from '../../utils/formatters';

const ReportForm = ({ hideHeader = false }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    identifierType: IDENTIFIER_TYPES.PHONE,
    message: '',
    location: {
      city: '',
      state: '',
      latitude: null,
      longitude: null,
    },
  });

  const [errors, setErrors] = useState({});
  const [successData, setSuccessData] = useState(null);
  const [duplicateReport, setDuplicateReport] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const { execute: submitReport, loading, error } = useApi(createReport);

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      identifier: val,
      identifierType: detectIdentifierType(val) || prev.identifierType,
    }));
    if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: null }));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: Number(position.coords.latitude.toFixed(4)),
            longitude: Number(position.coords.longitude.toFixed(4)),
          },
        }));
      },
      (geoError) => {
        setIsLocating(false);
        console.warn('Geolocation lookup notice:', geoError.message);
      },
      { timeout: 10000 }
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) newErrors.identifier = 'Identifier is required';
    if (!formData.message.trim()) newErrors.message = 'Description is required';
    else if (formData.message.trim().length < 5) newErrors.message = 'Description must be at least 5 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setDuplicateReport(null);
    setSuccessData(null);

    const payload = {
      identifier: formData.identifier.trim(),
      identifierType: formData.identifierType,
      message: formData.message.trim(),
    };

    const hasCity = formData.location.city && formData.location.city.trim();
    const hasState = formData.location.state && formData.location.state.trim();
    const hasCoords = formData.location.latitude !== null && formData.location.longitude !== null;

    if (hasCity || hasState || hasCoords) {
      payload.location = {};
      if (hasCity) payload.location.city = formData.location.city.trim();
      if (hasState) payload.location.state = formData.location.state.trim();
      if (hasCoords) {
        payload.location.latitude = formData.location.latitude;
        payload.location.longitude = formData.location.longitude;
      }
    }

    try {
      const response = await submitReport(payload);
      const reportObj = response?.data?.report || response?.data || response?.report || response;
      setSuccessData(reportObj);

      setFormData({
        identifier: '',
        identifierType: IDENTIFIER_TYPES.PHONE,
        message: '',
        location: { city: '', state: '', latitude: null, longitude: null },
      });
    } catch (err) {
      const existing = err.existingReport || err.data?.existingReport;
      if (err.status === 409 && existing) {
        setDuplicateReport(existing);
      }
    }
  };

  if (successData) {
    const reportId = successData._id || successData.id;
    return (
      <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto text-center space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
          <CheckCircle2 className="w-9 h-9 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Report Successfully Registered</h2>
          <p className="text-slate-300 text-sm">
            Your report has been analyzed by AI and registered to the threat intelligence registry.
          </p>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-5 text-left border border-white/5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-slate-400 text-sm">Risk Assessment</span>
            <span className="text-lg font-bold text-white font-mono">
              {successData.riskScore !== undefined ? `${successData.riskScore}/100` : 'Assessed'} ({successData.riskLevel || 'EVALUATED'})
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-xs uppercase tracking-wider block mb-1">AI Explanation</span>
            <p className="text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/5">
              {successData.aiExplanation || successData.aiAnalysis || 'Analysis complete. Patterns correlated.'}
            </p>
          </div>

          {successData.blockchain && (
            <div className="pt-3 border-t border-white/10">
              <span className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Blockchain Integrity Status</span>
              <BlockchainBadge blockchain={successData.blockchain} />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {reportId && (
            <Link
              to={`/reports/${reportId}`}
              className="w-full sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>View Full Report & On-Chain Proof</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <button
            onClick={() => setSuccessData(null)}
            className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
      {!hideHeader && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Submit a Scam Report</h2>
          <p className="text-slate-400 text-sm">
            Report suspicious phone numbers, UPI IDs, emails, URLs, or profiles to warn others.
          </p>
        </div>
      )}

      {error && !duplicateReport && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Submission Error</span>
            <p>{error.message || 'Failed to submit report. Please check your network and inputs.'}</p>
          </div>
        </div>
      )}

      {duplicateReport && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col gap-3 text-amber-300 text-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-bold text-white block">Identifier Already Reported</span>
              <p className="text-amber-200/90 text-xs mt-0.5">
                This identifier has already been recorded in the database.
              </p>
            </div>
          </div>
          <div className="bg-black/40 p-3 rounded-lg border border-amber-500/20 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Scam Type:</span>
              <span className="font-semibold text-white">{duplicateReport.scamType?.replace('_', ' ')}</span>
            </div>
            {duplicateReport.createdAt && (
              <div className="flex justify-between">
                <span className="text-slate-400">Recorded:</span>
                <span className="text-slate-300">{formatDate(duplicateReport.createdAt)}</span>
              </div>
            )}
          </div>
          <Link
            to={`/reports/${duplicateReport._id || duplicateReport.id}`}
            className="self-start inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold text-xs mt-1 underline underline-offset-4"
          >
            <span>View Existing Report & Historical Proof &rarr;</span>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Identifier Type</label>
          <select
            value={formData.identifierType}
            onChange={(e) => setFormData((prev) => ({ ...prev, identifierType: e.target.value }))}
            className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-sm"
          >
            {Object.values(IDENTIFIER_TYPES).map((type) => (
              <option key={type} value={type} className="bg-slate-900 text-white">
                {type.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Identifier Details *</label>
          <input
            type="text"
            value={formData.identifier}
            onChange={handleIdentifierChange}
            placeholder="e.g. +91 9876543210 or scammer@upi"
            className={`w-full bg-slate-950/70 border ${errors.identifier ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-sm`}
          />
          {errors.identifier && <span className="text-red-400 text-xs block">{errors.identifier}</span>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Incident Description * (min 5 chars)
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, message: e.target.value }));
            if (errors.message) setErrors((prev) => ({ ...prev, message: null }));
          }}
          placeholder="Describe what happened: what did they ask for, fake job/lottery/KYC claims, payment links provided, etc."
          rows={4}
          className={`w-full bg-slate-950/70 border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none text-sm`}
        />
        {errors.message && <span className="text-red-400 text-xs block">{errors.message}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">State (Optional)</label>
          <select
            value={formData.location.state}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, state: e.target.value },
              }))
            }
            className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-sm"
          >
            <option value="" className="bg-slate-900 text-slate-500">
              Select State
            </option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state} className="bg-slate-900 text-white">
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">City (Optional)</label>
            <button
              type="button"
              onClick={getLocation}
              disabled={isLocating}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors disabled:opacity-50"
            >
              <MapPin className="w-3 h-3" />
              {isLocating ? 'Locating...' : 'GPS Auto-detect'}
            </button>
          </div>
          <input
            type="text"
            value={formData.location.city}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, city: e.target.value },
              }))
            }
            placeholder="e.g. Kolkata, Mumbai, Delhi"
            className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-sm"
          />
          {formData.location.latitude && (
            <span className="text-[11px] text-cyan-400/80 font-mono block">
              Lat: {formData.location.latitude}, Lng: {formData.location.longitude}
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-4 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
            Analyzing with AI & Verifying on Chain...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Scam Report
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
        <Info className="w-3.5 h-3.5" />
        <span>Reports are permanently hashed for evidence preservation and community safety.</span>
      </div>
    </form>
  );
};

export default ReportForm;
