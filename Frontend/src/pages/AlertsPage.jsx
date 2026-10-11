import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getAlerts,
  markAlertAsRead,
  markAllAlertsAsRead,
  syncAlerts,
} from '../api/alerts.api';
import {
  Bell,
  BellRing,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  RefreshCw,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Inbox,
  Filter,
} from 'lucide-react';
import { SCAM_TYPES } from '../constants/scamTypes';

const AlertsPage = () => {
  const { user, isAuthenticated, updateAlertPreferences } = useAuth();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Preference form state
  const [prefCategories, setPrefCategories] = useState([]);
  const [prefMinRisk, setPrefMinRisk] = useState('MEDIUM');
  const [prefLocations, setPrefLocations] = useState([]);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [inAppAlerts, setInAppAlerts] = useState(true);

  // Initialize preference state from user
  useEffect(() => {
    if (user?.alertPreferences) {
      setPrefCategories(user.alertPreferences.categories || []);
      setPrefMinRisk(user.alertPreferences.minRiskLevel || 'MEDIUM');
      setPrefLocations(user.alertPreferences.locations || []);
      setInAppAlerts(user.alertPreferences.inAppAlerts !== false);
    }
  }, [user]);

  const fetchAlertsData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await getAlerts({ unreadOnly: filterUnread });
      if (res.success) {
        setAlerts(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAlertsData();
    }
  }, [isAuthenticated, filterUnread]);

  const handleSyncAlerts = async () => {
    setSyncing(true);
    setFeedback(null);
    try {
      const res = await syncAlerts();
      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Evaluation complete: Detected ${res.data?.generated || 0} new threat matching rules.`,
        });
        await fetchAlertsData();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'Threat alert sync failed.',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAlertsAsRead();
      setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
      setUnreadCount(0);
      setFeedback({ type: 'success', text: 'All threat alerts marked as read.' });
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to mark all as read.' });
    }
  };

  const handleToggleRead = async (alertId) => {
    try {
      await markAlertAsRead(alertId);
      setAlerts((prev) =>
        prev.map((a) => (a._id === alertId ? { ...a, isRead: true } : a))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSavingPrefs(true);
    setFeedback(null);
    try {
      await updateAlertPreferences({
        categories: prefCategories,
        minRiskLevel: prefMinRisk,
        locations: prefLocations,
        inAppAlerts,
      });
      setFeedback({
        type: 'success',
        text: 'Threat alert preferences saved successfully. Triggering alert sync...',
      });
      setShowPreferences(false);
      handleSyncAlerts();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to save preferences.' });
    } finally {
      setSavingPrefs(false);
    }
  };

  const toggleCategory = (catKey) => {
    setPrefCategories((prev) =>
      prev.includes(catKey) ? prev.filter((k) => k !== catKey) : [...prev, catKey]
    );
  };

  const handleAddLocation = () => {
    if (newLocationInput.trim() && !prefLocations.includes(newLocationInput.trim())) {
      setPrefLocations((prev) => [...prev, newLocationInput.trim()]);
      setNewLocationInput('');
    }
  };

  const handleRemoveLocation = (loc) => {
    setPrefLocations((prev) => prev.filter((l) => l !== loc));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center backdrop-blur-md shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-4 text-teal-400">
            <Bell className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Threat Alert System</h2>
          <p className="text-sm text-slate-400 mb-6">
            Sign in to configure personalized threat alerts, monitor high-risk scam waves in your region, and receive instant warnings.
          </p>
          <button
            onClick={() => navigate('/auth', { state: { from: '/alerts' } })}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20"
          >
            Sign In to Access Alerts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
                Threat Alert Center
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                Real-time automated warnings derived exclusively from verified database intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              showPreferences
                ? 'bg-teal-500/20 text-teal-400 border-teal-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Sliders className="w-4 h-4" /> Preferences
          </button>

          <button
            onClick={handleSyncAlerts}
            disabled={syncing}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Detecting...' : 'Sync Alerts'}
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`mb-6 p-3.5 rounded-xl text-xs border flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-75 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Preferences Drawer / Panel */}
      {showPreferences && (
        <div className="mb-8 p-6 rounded-2xl bg-slate-900/90 border border-teal-500/30 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" /> Alert Trigger Rules & Preferences
            </h2>
            <button
              onClick={() => setShowPreferences(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-6">
            {/* Minimum Risk Threshold */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Minimum Threat Risk Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['LOW', 'MEDIUM', 'HIGH'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPrefMinRisk(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      prefMinRisk === lvl
                        ? lvl === 'HIGH'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-lg shadow-red-500/10'
                          : lvl === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lvl} Risk & Above
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Monitored Scam Categories ({prefCategories.length} selected)
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(SCAM_TYPES).map(([key, info]) => {
                  const selected = prefCategories.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleCategory(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selected
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {info.label || key}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Geographic Locations */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Geographic Filters (Leave empty to monitor all regions)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newLocationInput}
                  onChange={(e) => setNewLocationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLocation();
                    }
                  }}
                  placeholder="e.g. Mumbai, Delhi, Bengaluru, Kolkata"
                  className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700"
                >
                  Add City
                </button>
              </div>

              {prefLocations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {prefLocations.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    >
                      <MapPin className="w-3 h-3" /> {loc}
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(loc)}
                        className="hover:text-red-400 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between pt-2">
              <label className="text-xs font-semibold text-slate-300 cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inAppAlerts}
                  onChange={(e) => setInAppAlerts(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-teal-500 focus:ring-teal-500"
                />
                Enable In-App Threat Notification Center
              </label>

              <button
                type="submit"
                disabled={savingPrefs}
                className="py-2 px-5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-teal-500/20 disabled:opacity-50"
              >
                {savingPrefs ? 'Saving...' : 'Apply Alert Preferences'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterUnread(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !filterUnread
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilterUnread(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterUnread
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Unread Only ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-medium text-slate-400 hover:text-teal-400 flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark all as read
          </button>
        )}
      </div>

      {/* Alerts Feed */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading threat alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-200 mb-1">
            {filterUnread ? 'No Unread Threat Alerts' : 'No Threat Alerts Active'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            ScamRadar scans database incidents against your configured category and risk preferences.
          </p>
          <button
            onClick={handleSyncAlerts}
            disabled={syncing}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-400 font-semibold text-xs rounded-xl border border-slate-700 transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} /> Scan Database Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const isHigh = alert.riskLevel === 'HIGH';
            return (
              <div
                key={alert._id}
                className={`p-4 rounded-xl border transition-all ${
                  !alert.isRead
                    ? isHigh
                      ? 'bg-slate-900/90 border-red-500/30 shadow-lg shadow-red-500/5'
                      : 'bg-slate-900/90 border-teal-500/30 shadow-lg shadow-teal-500/5'
                    : 'bg-slate-900/40 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isHigh
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                      }`}
                    >
                      {isHigh ? (
                        <ShieldAlert className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isHigh
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {alert.riskLevel} RISK
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {alert.scamType?.replace(/_/g, ' ')}
                        </span>
                        {alert.city && (
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {alert.city}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">
                          • {new Date(alert.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-100 mb-1">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {alert.relatedReportId && (
                      <button
                        onClick={() =>
                          navigate(
                            `/reports/${
                              alert.relatedReportId._id || alert.relatedReportId
                            }`
                          )
                        }
                        className="p-1.5 text-slate-400 hover:text-teal-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="View Related Incident"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}

                    {!alert.isRead ? (
                      <button
                        onClick={() => handleToggleRead(alert._id)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 transition-all"
                      >
                        Mark Read
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" /> Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
