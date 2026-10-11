import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scan,
  Upload,
  FileText,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Trash2,
  Sparkles,
  Lock,
  Eye
} from 'lucide-react';
import { scanScreenshotOcr, analyzeEvidenceText } from '../api/intelligence.api';
import { useApi } from '../hooks/useApi';
import RiskScoreGauge from '../components/scam-checker/RiskScoreGauge';
import { getRiskColorClass } from '../utils/formatters';

const SAMPLE_MESSAGES = [
  {
    title: 'Electricity Bill Disconnection',
    text: 'Dear consumer your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Please immediately contact power officer on 9876543210 to update bill and avoid power cut.',
  },
  {
    title: 'Fake Courier Redelivery',
    text: 'Your India Post parcel failed delivery due to wrong street address. Please update your address within 24 hours at http://indiapost-update.xyz and pay nominal re-delivery fee ₹5 to confirm dispatch.',
  },
  {
    title: 'Telegram Part-Time Task',
    text: 'Earn ₹2000-5000 daily from home! Just like 3 YouTube videos and receive instant money on Google Pay. Send screenshot to our Telegram manager @vip_task_manager to claim your welcome bonus.',
  },
];

const ScannerPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('screenshot'); // 'screenshot' | 'paste'

  // Screenshot upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  // Review & Extracted text state
  const [extractedText, setExtractedText] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // Direct paste text state
  const [pastedText, setPastedText] = useState('');

  // API hooks
  const {
    execute: runOcr,
    loading: ocrLoading,
    error: ocrError,
    data: ocrData,
  } = useApi(scanScreenshotOcr);

  const {
    execute: runAnalysis,
    loading: analysisLoading,
    error: analysisError,
    data: analysisData,
  } = useApi(analyzeEvidenceText);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setExtractedText('');

    // Safe File Type Check
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setFileError('Invalid file format. Please upload PNG, JPEG, or WebP images only.');
      return;
    }

    // Safe File Size Check (Max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds the 5 MB limit. Please upload a smaller image.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Read base64 in memory (never saved on client disk)
    const reader = new FileReader();
    reader.onload = () => {
      setBase64Image(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setBase64Image(null);
    setExtractedText('');
    setFileError(null);
  };

  // Perform OCR extraction
  const handleExtractOcr = async () => {
    if (!base64Image || !selectedFile) return;

    const res = await runOcr({
      imageBase64: base64Image,
      mimeType: selectedFile.type,
    });

    if (res?.data?.extractedText || res?.extractedText) {
      const text = res?.data?.extractedText || res?.extractedText;
      setExtractedText(text);
    }
  };

  // Run Threat Analysis
  const handleAnalyze = async () => {
    const textToAnalyze = activeTab === 'screenshot' ? extractedText.trim() : pastedText.trim();
    if (!textToAnalyze) return;

    await runAnalysis({
      text: textToAnalyze,
      context: activeTab === 'screenshot' ? 'screenshot' : 'manual',
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const activeText = activeTab === 'screenshot' ? extractedText : pastedText;
  const analysisResult = analysisData?.data || analysisData;

  const handlePrefillReport = () => {
    navigate('/report', {
      state: {
        prefilledMessage: activeText,
        prefilledScamType: analysisResult?.scamType,
      },
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
          <Scan className="w-3.5 h-3.5" />
          <span>OPTICAL THREAT RECOGNITION & MESSAGE SCANNER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Screenshot & Message Scanner
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Upload suspicious screenshots or paste raw messages. Our OCR engine transcribes text for your review before running AI scam indicator analysis.
        </p>
      </div>

      {/* Ephemeral Privacy Guarantee Notice */}
      <div className="mb-8 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-3.5">
        <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-cyan-300 uppercase tracking-wide text-[11px] block">
            Zero File Retention & Privacy Guarantee
          </span>
          <p className="text-slate-400 leading-relaxed">
            Uploaded evidence is processed ephemerally in-memory for optical character recognition and immediately discarded. Images are never written to permanent disk storage. <strong>Please do not upload private government IDs (Aadhaar, Passport) or banking passwords.</strong>
          </p>
        </div>
      </div>

      {/* Dual Tab Mode Selector */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('screenshot')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'screenshot'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Screenshot (OCR)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'paste'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Suspicious Message</span>
          </button>
        </div>

        {/* Tab 1: Screenshot Upload & OCR */}
        {activeTab === 'screenshot' && (
          <div className="space-y-6">
            {!previewUrl ? (
              <label className="border-2 border-dashed border-white/15 hover:border-cyan-500/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/20 hover:bg-cyan-500/5 group">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Click to upload or drag and drop screenshot
                </h3>
                <p className="text-xs text-slate-400">
                  PNG, JPEG, WebP (Max 5 MB)
                </p>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={previewUrl}
                    alt="Uploaded screenshot"
                    className="w-20 h-20 object-cover rounded-xl border border-white/10 flex-shrink-0"
                  />
                  <div>
                    <span className="text-sm font-semibold text-white block truncate max-w-xs">
                      {selectedFile?.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {(selectedFile?.size / 1024).toFixed(1)} KB &bull; {selectedFile?.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleExtractOcr}
                    disabled={ocrLoading}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {ocrLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Extracting OCR...</span>
                      </>
                    ) : (
                      <>
                        <Scan className="w-3.5 h-3.5" />
                        <span>Transcribe Text (OCR)</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {fileError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{fileError}</span>
              </div>
            )}

            {ocrError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{ocrError.message || 'OCR extraction failed. Please try pasting the message directly.'}</span>
              </div>
            )}

            {/* Review & Edit OCR Extracted Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  Review & Edit Extracted Text Before Analysis:
                </label>
                {extractedText && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(extractedText)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
                  </button>
                )}
              </div>

              <textarea
                rows={5}
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Extracted text will appear here. You can edit, append, or correct any OCR typos before running threat analysis..."
                className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Direct Paste Text */}
        {activeTab === 'paste' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Paste SMS, WhatsApp, or Email Message Text:
              </label>
              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the suspicious message content here..."
                className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Sample Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold mr-1">Load Test Scenarios:</span>
              {SAMPLE_MESSAGES.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPastedText(s.text)}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 text-xs transition-colors"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Trigger Button */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analysisLoading || !activeText.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {analysisLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Threat Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Scam Risk & Indicators</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Error */}
      {analysisError && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3.5 mb-8">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-200">Threat Evaluation Error</h4>
            <p className="mt-1 leading-relaxed text-red-300/90">
              {analysisError.message || 'Unable to complete threat analysis. Please verify your connection.'}
            </p>
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Gauge & Risk Level */}
              <div className="flex flex-col items-center justify-center p-6 bg-black/30 rounded-2xl border border-white/5">
                <span className="text-xs uppercase font-mono font-bold text-slate-400 mb-2">
                  Risk Assessment
                </span>
                <div className="w-44 h-44 mb-3">
                  <RiskScoreGauge
                    score={analysisResult.riskScore || 0}
                    level={analysisResult.riskLevel || 'UNKNOWN'}
                  />
                </div>
                <div
                  className={`text-xl font-extrabold uppercase tracking-wider ${getRiskColorClass(
                    analysisResult.riskLevel
                  )}`}
                >
                  {analysisResult.riskLevel} RISK ({analysisResult.riskScore}/100)
                </div>
                <span className="text-xs font-mono px-3 py-1 mt-2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {analysisResult.scamType?.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Right Columns: Indicators & Explanation */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-cyan-400" />
                    Threat Analysis & Mechanism
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                    {analysisResult.explanation}
                  </p>
                </div>

                {/* Specific Detected Scam Indicators */}
                {analysisResult.indicators?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Specific Threat Indicators Detected:
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.indicators.map((ind, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed">{ind}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Safe Next Steps Checklist */}
            {analysisResult.safeNextSteps?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Recommended Safe Next Steps (Actionable Defenses):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisResult.safeNextSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Reporting CTA */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Would you like to report this incident to ScamRadar to warn other users and anchor evidence?
              </span>
              <button
                type="button"
                onClick={handlePrefillReport}
                className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <span>Prefill Incident Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerPage;
