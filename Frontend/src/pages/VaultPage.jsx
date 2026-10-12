import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getVaultCases,
  getVaultCaseById,
  createVaultCase,
  updateVaultCase,
  deleteVaultCase,
  addVaultTimelineEvent,
  addVaultNote,
  addVaultEvidenceFile,
  addVaultTransaction,
} from '../api/vault.api';
import {
  Lock,
  Plus,
  FolderLock,
  FileText,
  Clock,
  Trash2,
  Download,
  ArrowLeft,
  CreditCard,
  Search,
  UploadCloud,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import { SCAM_TYPES } from '../constants/scamTypes';
import BackButton from '../components/common/BackButton';

const VaultPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [caseLoading, setCaseLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // New Case Form
  const [newCaseData, setNewCaseData] = useState({
    caseTitle: '',
    scamType: 'UPI_FRAUD',
    suspectType: 'PHONE',
    suspectValue: '',
    lossAmount: '',
    initialNote: '',
  });

  // Sub-resource form state
  const [timelineForm, setTimelineForm] = useState({ title: '', description: '', timestamp: '' });
  const [txForm, setTxForm] = useState({ referenceId: '', platform: 'UPI', amount: '', date: '' });
  const [noteForm, setNoteForm] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Fetch list of cases
  const fetchCases = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await getVaultCases({
        status: filterStatus || undefined,
        search: searchQuery || undefined,
      });
      if (res.success) {
        setCases(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load vault cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCases();
    }
  }, [isAuthenticated, filterStatus]);

  // Load single case details
  const handleSelectCase = async (caseId) => {
    setCaseLoading(true);
    try {
      const res = await getVaultCaseById(caseId);
      if (res.success) {
        setSelectedCase(res.data);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to open case dossier.' });
    } finally {
      setCaseLoading(false);
    }
  };

  // Create Case
  const handleCreateCase = async (e) => {
    e.preventDefault();
    try {
      const res = await createVaultCase({
        caseTitle: newCaseData.caseTitle,
        scamType: newCaseData.scamType,
        suspectIdentifier: {
          type: newCaseData.suspectType,
          value: newCaseData.suspectValue,
        },
        financialLoss: {
          amount: Number(newCaseData.lossAmount) || 0,
        },
        initialNote: newCaseData.initialNote,
      });

      if (res.success) {
        setFeedback({ type: 'success', text: `Case ${res.data.caseNumber} created in secure vault.` });
        setShowCreateModal(false);
        setNewCaseData({
          caseTitle: '',
          scamType: 'UPI_FRAUD',
          suspectType: 'PHONE',
          suspectValue: '',
          lossAmount: '',
          initialNote: '',
        });
        await fetchCases();
        setSelectedCase(res.data);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to create case.' });
    }
  };

  // Update Case Status
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedCase) return;
    try {
      const res = await updateVaultCase(selectedCase._id, { status: newStatus });
      if (res.success) {
        setSelectedCase(res.data);
        fetchCases();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update status.' });
    }
  };

  // Delete Case
  const handleDeleteCase = async () => {
    if (!selectedCase) return;
    if (!window.confirm(`Permanently delete dossier ${selectedCase.caseNumber}? This cannot be undone.`)) return;

    try {
      await deleteVaultCase(selectedCase._id);
      setFeedback({ type: 'success', text: 'Case dossier deleted from vault.' });
      setSelectedCase(null);
      fetchCases();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete case.' });
    }
  };

  // Add Milestone
  const handleAddTimeline = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    try {
      await addVaultTimelineEvent(selectedCase._id, timelineForm);
      setTimelineForm({ title: '', description: '', timestamp: '' });
      setShowTimelineModal(false);
      handleSelectCase(selectedCase._id);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to add milestone.' });
    }
  };

  // Add Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    try {
      await addVaultNote(selectedCase._id, noteForm);
      setNoteForm('');
      setShowNoteModal(false);
      handleSelectCase(selectedCase._id);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to add note.' });
    }
  };

  // Add Transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    try {
      await addVaultTransaction(selectedCase._id, txForm);
      setTxForm({ referenceId: '', platform: 'UPI', amount: '', date: '' });
      setShowTransactionModal(false);
      handleSelectCase(selectedCase._id);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to add transaction.' });
    }
  };

  // Upload Evidence File
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCase) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File exceeds 5 MB limit.');
      return;
    }

    setUploadingFile(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        await addVaultEvidenceFile(selectedCase._id, {
          filename: file.name,
          fileType: file.type || 'application/octet-stream',
          fileSize: file.size,
          fileData: base64Data,
        });
        setFeedback({ type: 'success', text: `Evidence file '${file.name}' saved to encrypted vault.` });
        handleSelectCase(selectedCase._id);
      } catch (err) {
        setFeedback({ type: 'error', text: err.message || 'Upload failed.' });
      } finally {
        setUploadingFile(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center backdrop-blur-md shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-4 text-teal-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Private Evidence Vault</h2>
          <p className="text-sm text-slate-400 mb-6">
            Secure client-partitioned repository for organizing scam evidence, bank UTRs, timeline events, and notes. Strict user isolation guarantees zero public exposure.
          </p>
          <button
            onClick={() => navigate('/auth', { state: { from: '/vault' } })}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20"
          >
            Sign In to Unlock Vault
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <BackButton fallbackPath="/dashboard" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
                Private Evidence Vault
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                Strictly isolated incident dossiers • Zero public exposure • Victim defense toolkit
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> New Case Dossier
        </button>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`mb-6 p-3.5 rounded-xl text-xs border flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="text-xs opacity-75 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {selectedCase ? (
        /* DETAIL VIEW OF CASE */
        <div>
          {/* Back button and status bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
            <button
              onClick={() => setSelectedCase(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All Cases
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={selectedCase.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="OPEN">OPEN (Under Investigation)</option>
                <option value="UNDER_REVIEW">UNDER REVIEW (Bank/Legal)</option>
                <option value="SUBMITTED_TO_AUTHORITIES">SUBMITTED (FIR / 1930)</option>
                <option value="RESOLVED">RESOLVED (Recovered / Settled)</option>
                <option value="CLOSED">CLOSED</option>
              </select>

              <button
                onClick={handleDeleteCase}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                title="Delete Case Dossier"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dossier Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                CASE NUMBER
              </span>
              <p className="text-lg font-mono font-bold text-teal-400">
                {selectedCase.caseNumber}
              </p>
              <p className="text-xs text-slate-300 mt-2 font-semibold">
                {selectedCase.caseTitle}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                SUSPECT IDENTIFIER
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedCase.suspectIdentifier?.type || 'IDENTIFIER'}
                </span>
                <span className="text-sm font-mono text-slate-100 font-bold">
                  {selectedCase.suspectIdentifier?.value || 'Not registered'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Category: {selectedCase.scamType?.replace(/_/g, ' ')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                FINANCIAL IMPACT
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-red-400 flex items-center">
                  ₹{selectedCase.financialLoss?.amount?.toLocaleString('en-IN') || 0}
                </span>
                {selectedCase.financialLoss?.recoveredAmount > 0 && (
                  <span className="text-xs text-emerald-400 font-semibold">
                    (₹{selectedCase.financialLoss.recoveredAmount.toLocaleString('en-IN')} recovered)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Created on {new Date(selectedCase.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Dossier Tabs / Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Timeline & Transactions */}
            <div className="space-y-6">
              {/* Chronological Timeline */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-400" /> Incident Timeline ({selectedCase.timeline?.length || 0})
                  </h3>
                  <button
                    onClick={() => setShowTimelineModal(true)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-lg text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Milestone
                  </button>
                </div>

                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                  {selectedCase.timeline && selectedCase.timeline.length > 0 ? (
                    selectedCase.timeline.map((item, idx) => (
                      <div key={idx} className="relative pl-6 pb-4 border-l-2 border-slate-800 last:border-none last:pb-0">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-teal-400 ring-4 ring-slate-900"></div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                          <span className="text-[10px] text-slate-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                        )}
                        <span className="text-[10px] text-slate-500 block mt-1">Logged by {item.addedBy}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">No timeline events logged.</p>
                  )}
                </div>
              </div>

              {/* Transaction References */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-cyan-400" /> Transaction References ({selectedCase.transactionReferences?.length || 0})
                  </h3>
                  <button
                    onClick={() => setShowTransactionModal(true)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Log Reference
                  </button>
                </div>

                {selectedCase.transactionReferences && selectedCase.transactionReferences.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedCase.transactionReferences.map((tx, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-mono font-bold text-slate-200">{tx.referenceId}</p>
                          <span className="text-[11px] text-slate-400">
                            {tx.platform} • {tx.date ? new Date(tx.date).toLocaleDateString() : 'Date N/A'}
                          </span>
                        </div>
                        <span className="font-bold text-slate-200">₹{tx.amount?.toLocaleString('en-IN') || 0}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No transaction references attached yet.</p>
                )}
              </div>
            </div>

            {/* Right Column: Evidence Files & Notes */}
            <div className="space-y-6">
              {/* Evidence Files */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" /> Evidence Files ({selectedCase.evidenceFiles?.length || 0})
                  </h3>
                  <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1 cursor-pointer">
                    <UploadCloud className="w-3.5 h-3.5" /> {uploadingFile ? 'Uploading...' : 'Upload File'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,application/pdf,text/plain"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                      className="hidden"
                    />
                  </label>
                </div>

                {selectedCase.evidenceFiles && selectedCase.evidenceFiles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCase.evidenceFiles.map((file, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                        <div className="flex items-start gap-2.5 mb-2">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-slate-200 truncate" title={file.filename}>
                              {file.filename}
                            </p>
                            <span className="text-[10px] text-slate-500">
                              {(file.fileSize / 1024).toFixed(1)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {file.fileData && file.fileData.startsWith('data:image') && (
                          <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-900 mb-2 border border-slate-800">
                            <img src={file.fileData} alt="evidence preview" className="w-full h-full object-cover" />
                          </div>
                        )}

                        {file.fileData && (
                          <a
                            href={file.fileData}
                            download={file.filename}
                            className="text-[11px] font-semibold text-teal-400 hover:underline inline-flex items-center gap-1 self-start mt-1"
                          >
                            <Download className="w-3 h-3" /> Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl">
                    <UploadCloud className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No evidence files attached.</p>
                    <p className="text-[11px] text-slate-600 mt-1">Accepts PNG, JPG, WEBP, PDF up to 5 MB</p>
                  </div>
                )}
              </div>

              {/* Private Notes */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400" /> Private Investigation Notes ({selectedCase.notes?.length || 0})
                  </h3>
                  <button
                    onClick={() => setShowNoteModal(true)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-lg text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Note
                  </button>
                </div>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                  {selectedCase.notes && selectedCase.notes.length > 0 ? (
                    selectedCase.notes.map((note, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                        <span className="text-[10px] text-slate-500 block mt-2">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">No private notes added.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW OF CASES */
        <div>
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl mb-6">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['', 'OPEN', 'UNDER_REVIEW', 'SUBMITTED_TO_AUTHORITIES', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    filterStatus === st
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === '' ? 'All Cases' : st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchCases()}
                placeholder="Search dossier..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Cases Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-400">Accessing private vault partition...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <FolderLock className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-200 mb-1">Vault Empty</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                Create a private incident dossier to securely track fraud evidence, timeline milestones, and bank disputes.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create First Dossier
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cases.map((c) => (
                <div
                  key={c._id}
                  onClick={() => handleSelectCase(c._id)}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-900 transition-all cursor-pointer shadow-lg group relative"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-teal-400">
                      {c.caseNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : c.status === 'SUBMITTED_TO_AUTHORITIES'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-teal-300 transition-colors line-clamp-1 mb-2">
                    {c.caseTitle}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                    <p className="flex items-center justify-between">
                      <span>Category:</span>
                      <span className="text-slate-200 font-medium">
                        {c.scamType?.replace(/_/g, ' ')}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Loss Claimed:</span>
                      <span className="text-red-400 font-bold">
                        ₹{c.financialLoss?.amount?.toLocaleString('en-IN') || 0}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Evidence Files:</span>
                      <span className="text-slate-200 font-medium">
                        {c.evidenceFiles?.length || 0} attachments
                      </span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Updated {new Date(c.updatedAt).toLocaleDateString()}</span>
                    <span className="text-teal-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                      Open Dossier <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: CREATE DOSSIER */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-1">Create Private Evidence Dossier</h3>
            <p className="text-xs text-slate-400 mb-5">
              Securely initialize an incident case in your private partition.
            </p>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Case Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unauthorized Electricity SMS Scam"
                  value={newCaseData.caseTitle}
                  onChange={(e) => setNewCaseData({ ...newCaseData, caseTitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Scam Category
                  </label>
                  <select
                    value={newCaseData.scamType}
                    onChange={(e) => setNewCaseData({ ...newCaseData, scamType: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    {Object.entries(SCAM_TYPES).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label || k}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Loss Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 25000"
                    value={newCaseData.lossAmount}
                    onChange={(e) => setNewCaseData({ ...newCaseData, lossAmount: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Suspect Type
                  </label>
                  <select
                    value={newCaseData.suspectType}
                    onChange={(e) => setNewCaseData({ ...newCaseData, suspectType: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="PHONE">Phone Number</option>
                    <option value="UPI">UPI ID / VPA</option>
                    <option value="URL">URL / Domain</option>
                    <option value="EMAIL">Email Address</option>
                    <option value="BANK_ACCOUNT">Bank Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Suspect Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210 or fraud@upi"
                    value={newCaseData.suspectValue}
                    onChange={(e) => setNewCaseData({ ...newCaseData, suspectValue: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Initial Incident Note
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe initial contact, what suspect demanded, and how payment occurred..."
                  value={newCaseData.initialNote}
                  onChange={(e) => setNewCaseData({ ...newCaseData, initialNote: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-teal-500/20"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TIMELINE MILESTONE */}
      {showTimelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 mb-3">Add Timeline Milestone</h3>
            <form onSubmit={handleAddTimeline} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lodged 1930 Cyber Cell Complaint"
                  value={timelineForm.title}
                  onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Complaint number, officer notes, or response details..."
                  value={timelineForm.description}
                  onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTimelineModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TRANSACTION */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 mb-3">Log Financial Transaction</h3>
            <form onSubmit={handleAddTransaction} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reference ID (UTR / TxID) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPI/2026/091823901"
                  value={txForm.referenceId}
                  onChange={(e) => setTxForm({ ...txForm, referenceId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Platform</label>
                  <input
                    type="text"
                    placeholder="e.g. PhonePe / Google Pay"
                    value={txForm.platform}
                    onChange={(e) => setTxForm({ ...txForm, platform: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="25000"
                    value={txForm.amount}
                    onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransactionModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NOTE */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 mb-3">Add Private Case Note</h3>
            <form onSubmit={handleAddNote} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Encrypted Note Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Private case note, officer contact details, legal strategy..."
                  value={noteForm}
                  onChange={(e) => setNoteForm(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultPage;
