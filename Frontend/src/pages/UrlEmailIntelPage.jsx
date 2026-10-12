import React, { useState } from 'react';
import {
  Link2,
  Mail,
  ShieldAlert,
  AlertTriangle,
  Globe,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Server,
  FileCode
} from 'lucide-react';
import { analyzeUrlIntelligence, analyzeEmailIntelligence } from '../api/intelligence.api';
import { useApi } from '../hooks/useApi';
import RiskScoreGauge from '../components/scam-checker/RiskScoreGauge';
import BackButton from '../components/common/BackButton';
import { getRiskColorClass } from '../utils/formatters';

const SAMPLE_URLS = [
  {
    label: 'Spoofed Bank Phishing',
    url: 'https://sbi-kyc-verification-urgent.xyz/login',
  },
  {
    label: 'Unregistered Courier Link',
    url: 'http://indiapost-parcel-tracking.click/pay5',
  },
  {
    label: 'SSRF Attack Probe (Blocked)',
    url: 'http://127.0.0.1:8080/internal-admin',
  },
];

const SAMPLE_EMAILS = [
  {
    label: 'Impersonated Bank Alert',
    content: 'Dear valued customer, your netbanking access will be deactivated due to non-compliance with KYC regulations. Verify identity now at http://sbi-kyc-update.xyz to prevent account freeze.',
    headers: `From: State Bank of India <support@sbi.co.in>
Reply-To: refund@attacker-scam.xyz
Return-Path: <bounce@badhost.net>
Authentication-Results: spf=fail dkim=fail`,
  },
  {
    label: 'Fake PayPal Invoice',
    content: 'Thank you for your order #89218 for Apple iPhone 15 Pro. You were charged $1,199. If this was not you, call fraud helpline +1-800-FAKE-NUM immediately to cancel.',
    headers: `From: PayPal Service <service@paypal.com>
Reply-To: support@billing-dispute.top
Authentication-Results: spf=softfail dkim=none`,
  },
];

const UrlEmailIntelPage = () => {
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'email'

  // URL state
  const [urlInput, setUrlInput] = useState('');

  // Email state
  const [emailContent, setEmailContent] = useState('');
  const [emailHeaders, setEmailHeaders] = useState('');
  const [showHeadersInput, setShowHeadersInput] = useState(false);

  // API hooks
  const {
    execute: runUrlAnalysis,
    loading: urlLoading,
    error: urlError,
    data: urlData,
  } = useApi(analyzeUrlIntelligence);

  const {
    execute: runEmailAnalysis,
    loading: emailLoading,
    error: emailError,
    data: emailData,
  } = useApi(analyzeEmailIntelligence);

  const handleAnalyzeUrl = (e) => {
    e?.preventDefault();
    if (!urlInput.trim()) return;
    runUrlAnalysis({ url: urlInput.trim() });
  };

  const handleAnalyzeEmail = (e) => {
    e?.preventDefault();
    if (!emailContent.trim()) return;
    runEmailAnalysis({
      emailContent: emailContent.trim(),
      emailHeaders: emailHeaders.trim(),
    });
  };

  const urlResult = urlData?.data || urlData;
  const emailResult = emailData?.data || emailData;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <BackButton fallbackPath="/" />
      </div>

      {/* Header */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span>ADVANCED THREAT HEURISTICS & REPUTATION ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          URL & Email Intelligence Center
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Dissect suspicious links, spoofed domain architectures, and fraudulent email headers. Clearly distinguishes verified technical facts from AI risk interpretation.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'url'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>URL Structure & SSRF Analysis</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'email'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email & Header Intelligence</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: URL INTELLIGENCE */}
      {/* ============================================================ */}
      {activeTab === 'url' && (
        <div className="space-y-8">
          {/* Input Box */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
            <form onSubmit={handleAnalyzeUrl} className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Enter Web Link or Domain to Inspect:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="e.g. https://sbi-kyc-update.xyz/login or http://192.168.1.1"
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={urlLoading || !urlInput.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
                >
                  {urlLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Inspecting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Inspect URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sample Chips */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold mr-1">Sample Links:</span>
                {SAMPLE_URLS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setUrlInput(s.url)}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 text-xs transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Error Message */}
          {urlError && (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <span>{urlError.message || 'URL inspection failed.'}</span>
            </div>
          )}

          {/* Results Card */}
          {urlResult && (
            <div className="space-y-6">
              {/* SSRF Security Block Banner */}
              {urlResult.isBlockedBySecurity && (
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-4">
                  <ShieldAlert className="w-6 h-6 flex-shrink-0 text-red-400 mt-0.5" />
                  <div>
                    <h3 className="font-extrabold text-base text-red-200 uppercase tracking-wide">
                      Security Alert: Server-Side Request Forgery (SSRF) Blocked
                    </h3>
                    <p className="text-xs sm:text-sm text-red-300/90 mt-1 leading-relaxed">
                      {urlResult.securityAlert}
                    </p>
                    <p className="text-[11px] text-red-400/80 mt-2 font-mono">
                      ScamRadar strictly denies requests to loopback addresses (127.0.0.0/8), RFC 1918 private subnets (10/8, 172.16/12, 192.168/16), and cloud metadata endpoints (169.254.169.254).
                    </p>
                  </div>
                </div>
              )}

              {/* Side-by-Side: Verified Deterministic Facts vs AI Risk Interpretation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Verified Deterministic Facts */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Verified Technical Facts
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 ml-auto">
                      DETERMINISTIC
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-slate-400">Target Hostname:</span>
                      <span className="font-mono text-cyan-300 font-semibold">{urlResult.verifiedFacts?.hostname}</span>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-slate-400">Top-Level Domain (TLD):</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white font-bold">{urlResult.verifiedFacts?.tld}</span>
                        {urlResult.verifiedFacts?.isHighRiskTld && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                            HIGH-RISK TLD
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-slate-400">Protocol & Encryption:</span>
                      <span className="font-mono text-slate-200">
                        {urlResult.verifiedFacts?.hasHttps ? 'HTTPS (SSL Encrypted)' : 'Insecure HTTP (No SSL)'}
                      </span>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-slate-400">IP Host / Punycode:</span>
                      <span className="font-mono text-slate-200">
                        {urlResult.verifiedFacts?.isIpHost ? 'Yes (Direct IP)' : urlResult.verifiedFacts?.isPunycode ? 'Yes (Punycode)' : 'Standard Domain'}
                      </span>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-slate-400">Prior ScamRadar Reports:</span>
                      <span className="font-mono text-cyan-300 font-bold">
                        {urlResult.verifiedFacts?.dbReportCount} incidents recorded
                      </span>
                    </div>

                    {urlResult.verifiedFacts?.detectedBrandKeywords?.length > 0 && (
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <span className="text-slate-400 block mb-1">Detected Target Brand Keywords:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {urlResult.verifiedFacts.detectedBrandKeywords.map((kw, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono text-[11px]">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. AI Threat Interpretation & Reputation */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        AI Risk Interpretation
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 ml-auto">
                        HEURISTIC
                      </span>
                    </div>

                    {/* Risk Badge and Gauge */}
                    <div className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-white/5 mb-4">
                      <div className="w-20 h-20 flex-shrink-0">
                        <RiskScoreGauge
                          score={urlResult.aiInterpretation?.riskScore || 0}
                          level={urlResult.aiInterpretation?.riskLevel || 'UNKNOWN'}
                        />
                      </div>
                      <div>
                        <div className={`text-base font-bold uppercase ${getRiskColorClass(urlResult.aiInterpretation?.riskLevel)}`}>
                          {urlResult.aiInterpretation?.riskLevel} RISK ({urlResult.aiInterpretation?.riskScore}/100)
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Reputation Signal: <strong className="text-slate-200">{urlResult.reputation}</strong>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 mb-4">
                      {urlResult.aiInterpretation?.threatSummary}
                    </p>

                    {urlResult.aiInterpretation?.indicators?.length > 0 && (
                      <div className="space-y-1.5 mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                          Red Flags Identified:
                        </span>
                        {urlResult.aiInterpretation.indicators.map((ind, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                            <span>{ind}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 text-xs text-slate-400">
                    <strong>Recommended Action:</strong> {urlResult.aiInterpretation?.recommendedAction}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: EMAIL INTELLIGENCE */}
      {/* ============================================================ */}
      {activeTab === 'email' && (
        <div className="space-y-8">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
            <form onSubmit={handleAnalyzeEmail} className="space-y-5">
              {/* Email Content Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Email Message Body Content:
                </label>
                <textarea
                  rows={5}
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Paste the received email body text here..."
                  className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
                />
              </div>

              {/* Optional RFC Headers Input */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowHeadersInput(!showHeadersInput)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{showHeadersInput ? 'Hide Technical Email Headers' : '+ Add Optional RFC Email Headers (For SPF/DKIM & Sender Mismatch)'}</span>
                </button>

                {showHeadersInput && (
                  <div className="mt-3 space-y-2">
                    <p className="text-[11px] text-slate-400">
                      Copy "Show Original" or raw headers from your mail client. <strong>ScamRadar never requests mailbox passwords or login access.</strong>
                    </p>
                    <textarea
                      rows={5}
                      value={emailHeaders}
                      onChange={(e) => setEmailHeaders(e.target.value)}
                      placeholder="Paste raw headers: From: ..., Reply-To: ..., Authentication-Results: spf=..., etc."
                      className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Sample Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold mr-1">Load Test Scenarios:</span>
                {SAMPLE_EMAILS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setEmailContent(s.content);
                      setEmailHeaders(s.headers);
                      setShowHeadersInput(true);
                    }}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 text-xs transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={emailLoading || !emailContent.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
                >
                  {emailLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Email...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Email Threats</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Email Error */}
          {emailError && (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <span>{emailError.message || 'Email analysis failed.'}</span>
            </div>
          )}

          {/* Email Results Display */}
          {emailResult && (
            <div className="space-y-6">
              {/* Header Verification Card */}
              {emailResult.verifiedHeaderFacts && (
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7">
                  <div className="flex items-center gap-2 mb-4">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Verified Email Header Facts
                    </h3>
                  </div>

                  {/* Mismatch Alert */}
                  {emailResult.verifiedHeaderFacts.hasReplyToMismatch && (
                    <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
                      <div>
                        <strong>Sender vs Reply-To Mismatch Detected!</strong>
                        <p className="mt-0.5 text-red-300/90">
                          The email claims to be sent from <code>{emailResult.verifiedHeaderFacts.fromDomain}</code>, but responses are secretly routed to a completely different domain <code>{emailResult.verifiedHeaderFacts.replyToDomain}</code>. This is a hallmark of phishing impersonation.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-slate-400 block text-[10px] uppercase">Claimed From</span>
                      <span className="font-mono text-white truncate block">{emailResult.verifiedHeaderFacts.fromEmail || 'Unspecified'}</span>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-slate-400 block text-[10px] uppercase">Reply-To Route</span>
                      <span className="font-mono text-cyan-300 truncate block">{emailResult.verifiedHeaderFacts.replyToEmail || 'None'}</span>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-slate-400 block text-[10px] uppercase">SPF Validation</span>
                      <span className={`font-mono font-bold ${emailResult.verifiedHeaderFacts.spfStatus === 'PASS' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {emailResult.verifiedHeaderFacts.spfStatus}
                      </span>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-slate-400 block text-[10px] uppercase">DKIM Signature</span>
                      <span className={`font-mono font-bold ${emailResult.verifiedHeaderFacts.dkimStatus === 'PASS' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {emailResult.verifiedHeaderFacts.dkimStatus}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Content Analysis Card */}
              {emailResult.aiInterpretation && (
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center justify-center p-6 bg-black/30 rounded-2xl border border-white/5">
                      <span className="text-xs uppercase font-mono font-bold text-slate-400 mb-2">
                        Risk Rating
                      </span>
                      <div className="w-36 h-36 mb-2">
                        <RiskScoreGauge
                          score={emailResult.aiInterpretation.riskScore || 0}
                          level={emailResult.aiInterpretation.riskLevel || 'UNKNOWN'}
                        />
                      </div>
                      <div className={`text-base font-bold uppercase ${getRiskColorClass(emailResult.aiInterpretation.riskLevel)}`}>
                        {emailResult.aiInterpretation.riskLevel} RISK ({emailResult.aiInterpretation.riskScore}/100)
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Threat Explanation</h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                          {emailResult.aiInterpretation.explanation}
                        </p>
                      </div>

                      {emailResult.aiInterpretation.redFlags?.length > 0 && (
                        <div>
                          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                            Detected Red Flags:
                          </span>
                          <div className="space-y-1.5">
                            {emailResult.aiInterpretation.redFlags.map((flag, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                <span>{flag}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {emailResult.aiInterpretation.safeRecommendations?.length > 0 && (
                        <div>
                          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                            Recommended Next Steps:
                          </span>
                          <div className="space-y-1.5">
                            {emailResult.aiInterpretation.safeRecommendations.map((rec, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UrlEmailIntelPage;
