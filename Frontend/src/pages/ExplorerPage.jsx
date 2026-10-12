import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Database,
  Lock,
  Cpu,
  FileCode,
  ArrowRight,
  Info
} from 'lucide-react';
import { verifyReportOnChain } from '../api/reports.api';
import { useApi } from '../hooks/useApi';
import { formatDateTime } from '../utils/formatters';
import BackButton from '../components/common/BackButton';

const SAMPLE_REPORTS = [
  {
    id: '6a914e6632a4ccf1de34b5fc',
    label: 'Verified On-Chain Sample',
    desc: 'KYC Phishing SMS (Contract Anchored)',
    expected: 'VERIFIED',
  },
  {
    id: '6a9093432608fd4d03a894a6',
    label: 'Unregistered Record Sample',
    desc: 'Lottery Scam (Off-Chain Pending)',
    expected: 'NOT_REGISTERED_ON_CHAIN',
  },
];

const ExplorerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [reportIdInput, setReportIdInput] = useState(initialId);
  const [copiedKey, setCopiedKey] = useState(null);

  const { data, loading, error, execute } = useApi(verifyReportOnChain);

  useEffect(() => {
    if (initialId) {
      setReportIdInput(initialId);
      execute(initialId);
    }
  }, [initialId, execute]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const cleanId = reportIdInput.trim();
    if (!cleanId) return;
    setSearchParams({ id: cleanId });
    execute(cleanId);
  };

  const handleSelectSample = (sampleId) => {
    setReportIdInput(sampleId);
    setSearchParams({ id: sampleId });
    execute(sampleId);
  };

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const verificationResult = data?.data || data;

  const renderStatusBanner = () => {
    if (!verificationResult) return null;

    const { status, verified } = verificationResult;

    if (status === 'VERIFIED' && verified) {
      return (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base uppercase tracking-wider text-emerald-400">
                  Cryptographically Verified on Smart Contract
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/40">
                  SHA-256 MATCH
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                The computed hash of the current report payload exactly matches the tamper-evident hash stored in the Ethereum/Polygon smart contract registry.
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 self-end md:self-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              IMMUTABLE RECORD
            </span>
          </div>
        </div>
      );
    }

    if (status === 'NOT_REGISTERED_ON_CHAIN') {
      return (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base uppercase tracking-wider text-amber-400">
                  Record Present Off-Chain Only
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/40">
                  UNANCHORED
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                This scam report exists in the ScamRadar operational database, but has not yet been registered or anchored on the blockchain smart contract.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            AWAITING ON-CHAIN SYNC
          </span>
        </div>
      );
    }

    if (status === 'HASH_MISMATCH') {
      return (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 mt-0.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base uppercase tracking-wider text-red-400">
                  Integrity Alert: Cryptographic Hash Mismatch
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono border border-red-500/40">
                  TAMPER DETECTED
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                An on-chain record exists for this ID, but its cryptographic fingerprint does not match the recalculated canonical hash of this report. Data may have been altered.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-400/20 text-red-300 border border-red-400/30">
            VALIDATION FAILED
          </span>
        </div>
      );
    }

    if (status === 'RPC_UNAVAILABLE') {
      return (
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-700 text-amber-400 mt-0.5">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base uppercase tracking-wider text-slate-200">
                  Blockchain RPC Node Unavailable
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                Could not connect to the Hardhat/Polygon RPC endpoint ({verificationResult.rpcError || 'Connection refused'}). Please ensure the blockchain node is running.
              </p>
            </div>
          </div>
          <button
            onClick={() => execute(reportIdInput.trim())}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold"
          >
            Retry RPC
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-6">
        <BackButton label="Back to Home" fallbackPath="/" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          <Database className="w-3.5 h-3.5" />
          <span>DECENTRALIZED IMMUTABILITY AUDIT</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Blockchain Proof Explorer
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Verify cryptographic integrity of incident reports on the smart contract registry. ScamRadar asserts cryptographic SHA-256 equivalence rather than merely trusting database records.
        </p>
      </div>

      {/* Search Bar & Sample Chips */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={reportIdInput}
              onChange={(e) => setReportIdInput(e.target.value)}
              placeholder="Enter Report ID (e.g. 6a914e6632a4ccf1de34b5fc)"
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !reportIdInput.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Audit Proof</span>
              </>
            )}
          </button>
        </form>

        {/* Sample Badges */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Quick Test Reports:</span>
          {SAMPLE_REPORTS.map((sample) => (
            <button
              type="button"
              key={sample.id}
              onClick={() => handleSelectSample(sample.id)}
              className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                reportIdInput === sample.id
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <span className="font-sans font-medium">{sample.label}</span>
              <span className="text-[10px] text-slate-400">({sample.id.slice(0, 8)}...)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center bg-slate-900/40 border border-white/10 rounded-2xl space-y-4">
          <div className="inline-block p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 animate-spin">
            <Cpu className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Querying Smart Contract & Computing Digest...</h3>
          <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
            Computing canonical SHA-256 serialization and requesting report state from contract ScamReportRegistry...
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-4 mb-8">
          <AlertTriangle className="w-6 h-6 flex-shrink-0 text-red-400" />
          <div>
            <h3 className="font-bold text-base text-red-200">Incident Query Error</h3>
            <p className="text-xs sm:text-sm text-red-300/90 mt-1">
              {error.message || 'The specified incident report could not be found or verified.'}
            </p>
          </div>
        </div>
      )}

      {/* Result Cards */}
      {!loading && verificationResult && (
        <div className="space-y-6">
          {/* Banner */}
          {renderStatusBanner()}

          {/* Side-by-Side Cryptographic Hash Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Computed Canonical Hash */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                      Recalculated Canonical Hash
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Generated from operational report payload
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(verificationResult.calculatedHash, 'calculated')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Copy calculated hash"
                >
                  {copiedKey === 'calculated' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3.5 bg-black/50 border border-white/5 rounded-xl font-mono text-xs text-cyan-300 break-all select-all">
                {verificationResult.calculatedHash}
              </div>

              <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                Generated via standard SHA-256 algorithm on the canonical stringified payload:
                <code className="text-cyan-400 ml-1">JSON.stringify(&#123; reportId, identifier, ... &#125;)</code>
              </p>
            </div>

            {/* Smart Contract Hash */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                      Smart Contract On-Chain Hash
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Stored in ScamReportRegistry mapping
                    </span>
                  </div>
                </div>
                {verificationResult.onChain?.reportHash && (
                  <button
                    onClick={() => copyToClipboard(verificationResult.onChain.reportHash, 'onChain')}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Copy on-chain hash"
                  >
                    {copiedKey === 'onChain' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>

              <div className="p-3.5 bg-black/50 border border-white/5 rounded-xl font-mono text-xs break-all select-all">
                {verificationResult.onChain?.reportHash ? (
                  <span className="text-purple-300">{verificationResult.onChain.reportHash}</span>
                ) : (
                  <span className="text-slate-500 italic">No record found in smart contract storage</span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs mt-3">
                <span className="text-slate-400">Match Evaluation:</span>
                {verificationResult.verified ? (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> EXACT BYTE-FOR-BYTE MATCH
                  </span>
                ) : (
                  <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {verificationResult.status === 'NOT_REGISTERED_ON_CHAIN' ? 'NOT ANCHORED' : 'HASH MISMATCH'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contract & Transaction Details */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              On-Chain Transaction & Identity Attestation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 bg-black/30 border border-white/5 rounded-xl space-y-1">
                <span className="text-slate-500 font-sans block text-[10px] uppercase font-bold">
                  Target Report ID
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-semibold">{verificationResult.reportId}</span>
                  <Link
                    to={`/reports/${verificationResult.reportId}`}
                    className="text-slate-400 hover:text-cyan-300 font-sans text-[11px] flex items-center gap-0.5"
                  >
                    View Report <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="p-3.5 bg-black/30 border border-white/5 rounded-xl space-y-1">
                <span className="text-slate-500 font-sans block text-[10px] uppercase font-bold">
                  Submitter Signer Address
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 truncate mr-2">
                    {verificationResult.onChain?.submittedBy || 'N/A (Off-Chain)'}
                  </span>
                  {verificationResult.onChain?.submittedBy && (
                    <button
                      onClick={() => copyToClipboard(verificationResult.onChain.submittedBy, 'signer')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'signer' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-black/30 border border-white/5 rounded-xl space-y-1">
                <span className="text-slate-500 font-sans block text-[10px] uppercase font-bold">
                  Block Timestamp
                </span>
                <span className="text-slate-300">
                  {verificationResult.onChain?.timestamp
                    ? formatDateTime(new Date(Number(verificationResult.onChain.timestamp) * 1000))
                    : 'N/A'}
                </span>
              </div>

              <div className="p-3.5 bg-black/30 border border-white/5 rounded-xl space-y-1 md:col-span-2 lg:col-span-3">
                <span className="text-slate-500 font-sans block text-[10px] uppercase font-bold">
                  Transaction Hash
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 break-all mr-2">
                    {verificationResult.databaseBlockchain?.transactionHash || 'No Transaction Hash Recorded'}
                  </span>
                  {verificationResult.databaseBlockchain?.transactionHash && (
                    <button
                      onClick={() => copyToClipboard(verificationResult.databaseBlockchain.transactionHash, 'tx')}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex-shrink-0"
                    >
                      {copiedKey === 'tx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Canonical Payload Inspector */}
          {verificationResult.canonicalPayload && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    Exact Canonical Payload JSON
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    The deterministic JSON representation that generated the SHA-256 fingerprint during smart contract anchoring.
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(verificationResult.canonicalPayload, null, 2), 'payload')
                  }
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'payload' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied JSON</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Canonical JSON</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-black/60 border border-white/10 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                {JSON.stringify(verificationResult.canonicalPayload, null, 2)}
              </pre>
            </div>
          )}

          {/* Cryptographic Architecture Guarantee */}
          <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-300 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
              <Info className="w-4 h-4" />
              ScamRadar Zero-Knowledge & Cryptographic Privacy Principles
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>Zero Private Key Exposure:</strong> This explorer only executes read-only JSON-RPC queries (<code className="text-cyan-300">getReport()</code>). No signing keys are ever stored or requested in browser memory.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>No False Verification:</strong> A report is only verified when smart contract storage confirms matching SHA-256 bytes. A transaction hash alone is never accepted as proof.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>PII Protection:</strong> Raw telephone numbers, victim names, and sensitive narratives are never stored directly in public blockchain ledger state—only irreversible 256-bit hashes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>Tamper Detection:</strong> If any single byte of a report (timestamp, risk score, identifier) is altered in the database, recalculation fails and flags an immediate hash mismatch.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorerPage;
