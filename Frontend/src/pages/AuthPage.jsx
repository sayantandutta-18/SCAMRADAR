import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, User, CheckCircle2, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const { login, register, isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/vault';

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isRegister) {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        setSuccessMsg('Account created successfully! Redirecting to Evidence Vault...');
      } else {
        await login(formData.email, formData.password);
        setSuccessMsg('Authentication verified. Welcome back!');
      }

      setTimeout(() => {
        navigate(redirectPath);
      }, 800);
    } catch (err) {
      setError(err.message || 'Authentication request failed.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing/evaluating
  const handleQuickFill = (roleType) => {
    const testStamp = Date.now().toString().slice(-4);
    if (roleType === 'MODERATOR') {
      setIsRegister(true);
      setFormData({
        name: 'Senior Moderator',
        email: `moderator_${testStamp}@scamradar.org`,
        password: 'ModPassword#2026',
        role: 'MODERATOR',
      });
    } else {
      setIsRegister(true);
      setFormData({
        name: 'Citizen Researcher',
        email: `analyst_${testStamp}@scamradar.org`,
        password: 'UserPassword#2026',
        role: 'USER',
      });
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-900/90 border border-teal-500/30 rounded-2xl p-8 backdrop-blur-md shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-4 text-teal-400">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Session Active</h2>
          <p className="text-sm text-slate-400 mb-6">
            Authenticated as <span className="text-teal-400 font-semibold">{user.name}</span> ({user.email})
          </p>

          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-6">
            Role: {user.role}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/vault')}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-2"
            >
              Go to Private Evidence Vault <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/alerts')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-all"
            >
              View Threat Alerts
            </button>
            <button
              onClick={logout}
              className="w-full py-2 px-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-all text-sm mt-4"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-4 text-teal-400">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">
            {isRegister ? 'Create Security Account' : 'Security Portal Sign In'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isRegister
              ? 'Access private evidence dossiers & custom threat alert feeds'
              : 'Sign in to access your encrypted evidence vault and threat alerts'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-slate-950/80 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isRegister
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isRegister
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name / Handle
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Security Analyst"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="analyst@scamradar.org"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Role Type
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-colors"
              >
                <option value="USER">Citizen / Incident Reporter (Vault & Alerts)</option>
                <option value="MODERATOR">Community Moderator (Moderation Console)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            ) : isRegister ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Quick Demo Evaluation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3 text-center">
            One-Click Demo Account Quick Fill
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('USER')}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all border border-slate-700"
            >
              Demo Citizen
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('MODERATOR')}
              className="py-1.5 px-3 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 text-xs font-medium transition-all border border-cyan-800/40"
            >
              Demo Moderator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
