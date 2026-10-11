import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertOctagon,
  PhoneCall,
  ShieldAlert,
  Clock,
  CheckSquare,
  Square,
  Copy,
  Check,
  ExternalLink,
  FileText,
  AlertTriangle,
  ArrowRight,
  Building,
  KeyRound,
  Ban
} from 'lucide-react';

const EMERGENCY_STEPS = [
  {
    step: 1,
    title: 'Sever All Communication Immediately',
    icon: Ban,
    badge: 'STOP CONTACT',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    actions: [
      'Hang up any ongoing phone calls or video calls immediately. Do not answer callbacks.',
      'Do not negotiate, argue, or request refunds from the scammer. They will manipulate you further.',
      'NEVER send "processing fees", "tax payments", or "release charges" to unlock your money. It is a secondary trap.',
      'Block the caller across WhatsApp, Telegram, phone dialer, and SMS after capturing screenshots.',
    ],
  },
  {
    step: 2,
    title: 'Act Within the Golden Hour: Freeze Banking & UPI',
    icon: Clock,
    badge: 'GOLDEN HOUR',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    actions: [
      'Call your bank fraud helpline immediately (within 1 to 2 hours of payment for the highest recovery chance).',
      'Request an immediate transaction stop / chargeback and provide the 12-digit UPI UTR or bank reference number.',
      'Block the compromised debit/credit cards and immediately disable net banking / UPI services for that account.',
      'Dial 1930 (National Cyber Crime Helpline) so the Indian Cyber Crime Coordination Centre (I4C) can flag the suspect beneficiary account across banking networks.',
    ],
  },
  {
    step: 3,
    title: 'Purge Malicious Software & Revoke Remote Access',
    icon: KeyRound,
    badge: 'DEVICE SECURITY',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    actions: [
      'Uninstall any screen-sharing or remote desktop apps installed under instructions (AnyDesk, TeamViewer, RustDesk, QuickSupport, AirDroid).',
      'If you downloaded an unknown APK file, disconnect Wi-Fi and mobile data immediately, then uninstall the malicious app or perform a factory reset.',
      'Change passwords for your primary email, net banking, and UPI apps from a different, secure device.',
      'Enable Multi-Factor Authentication (2FA) via authenticator apps (Google Authenticator) instead of SMS OTP where available.',
    ],
  },
  {
    step: 4,
    title: 'Lodge Official Complaints on Government Portals',
    icon: Building,
    badge: 'LEGAL REPORTING',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    actions: [
      'File an official complaint on the National Cyber Crime Reporting Portal at cybercrime.gov.in within 24 hours.',
      'Report the fraudulent phone number and phishing messages on DoT\'s Sanchar Saathi / Chakshu portal at sancharsaathi.gov.in.',
      'For illegal lending apps or fake investment schemes, file a report on the Reserve Bank of India Sachet portal (sachet.rbi.org.in).',
      'Visit your local police station Cyber Crime Cell to file a formal Zero FIR if financial loss is significant.',
    ],
  },
  {
    step: 5,
    title: 'Preserve & Assemble Unaltered Evidence',
    icon: FileText,
    badge: 'EVIDENCE AUDIT',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    actions: [
      'Do not delete any chat messages, voice notes, SMS, or transaction history. Law enforcement requires original timestamps.',
      'Capture full screenshots showing sender phone numbers, handles, and dates before blocking.',
      'Complete our interactive evidence checklist below to compile a formatted incident dossier for your bank and police complaint.',
      'File an immutable incident report on ScamRadar to alert the community and anchor evidence on the blockchain.',
    ],
  },
];

const EVIDENCE_ITEMS = [
  {
    id: 'utr_reference',
    label: '12-Digit UPI UTR or Bank Transaction Reference Numbers',
    description: 'Found in your bank statement, Google Pay, PhonePe, or Paytm transaction details screen.',
  },
  {
    id: 'scammer_vpa',
    label: 'Scammer Beneficiary UPI VPA / Account Number / IFSC',
    description: 'The receiver Virtual Payment Address (e.g. merchant@okhdfcbank) or beneficiary bank details.',
  },
  {
    id: 'chat_screenshots',
    label: 'Full Screen Captures of Messages & Chats',
    description: 'WhatsApp, Telegram, Instagram, or SMS dialogues showing full phone numbers and timestamps.',
  },
  {
    id: 'call_logs',
    label: 'Call Logs with Exact Timestamps and Duration',
    description: 'Screenshots of incoming and outgoing calls showing caller ID numbers and durations.',
  },
  {
    id: 'fraud_links',
    label: 'Fraudulent URLs, Websites, or Downloaded APK Names',
    description: 'Exact web links, phishing domains, or malicious application packages received.',
  },
  {
    id: 'payment_receipts',
    label: 'Payment Receipts & Bank Debited SMS Screenshots',
    description: 'Official debit notification SMS from your bank showing debit amount, balance, and timestamp.',
  },
  {
    id: 'email_headers',
    label: 'Email Messages with Original Sender Headers (.eml)',
    description: 'If contacted via email, export the email or display full "Show Original" header data.',
  },
  {
    id: 'incident_timeline',
    label: 'Written Chronological Summary of Events',
    description: 'Clear point-by-point notes documenting how the scammer approached you and what actions were taken.',
  },
];

const VERIFIED_HELPLINES = [
  {
    name: 'National Cyber Crime Helpline (India)',
    phone: '1930',
    availability: 'Toll-Free, 24/7',
    desc: 'Government emergency helpline by Ministry of Home Affairs / I4C to freeze defrauded funds.',
    url: 'https://cybercrime.gov.in',
    isPrimary: true,
  },
  {
    name: 'National Cyber Crime Reporting Portal',
    portalOnly: true,
    desc: 'Official platform to register cyber fraud complaints and generate formal police acknowledgment.',
    url: 'https://cybercrime.gov.in',
  },
  {
    name: 'Chakshu / Sanchar Saathi (DoT)',
    portalOnly: true,
    desc: 'Report suspected fraudulent SMS, international spoofed calls, and fake WhatsApp numbers to telecom authorities.',
    url: 'https://sancharsaathi.gov.in',
  },
  {
    name: 'RBI Sachet Portal',
    portalOnly: true,
    desc: 'Reserve Bank of India portal to report illegal deposit schemes, fake investment apps, and predatory loan apps.',
    url: 'https://sachet.rbi.org.in',
  },
];

const BANK_HELPLINES = [
  { bank: 'State Bank of India (SBI)', number: '1800 11 2211' },
  { bank: 'HDFC Bank', number: '1800 1600' },
  { bank: 'ICICI Bank', number: '1800 1080' },
  { bank: 'Axis Bank', number: '1800 419 5959' },
  { bank: 'Punjab National Bank (PNB)', number: '1800 180 2222' },
  { bank: 'Bank of Baroda', number: '1800 258 4455' },
];

const STORAGE_KEY = 'scamradar_emergency_checklist';

const EmergencyPage = () => {
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checklist));
    } catch (e) {
      console.warn('Could not save checklist to localStorage', e);
    }
  }, [checklist]);

  const toggleCheck = (id) => {
    setChecklist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const clearChecklist = () => {
    setChecklist({});
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((checkedCount / EVIDENCE_ITEMS.length) * 100);

  const generateEvidenceText = () => {
    const collected = EVIDENCE_ITEMS.filter((item) => checklist[item.id]).map((item) => `[x] ${item.label}`);
    const pending = EVIDENCE_ITEMS.filter((item) => !checklist[item.id]).map((item) => `[ ] ${item.label}`);

    return `SCAMRADAR EMERGENCY EVIDENCE DOSSIER
Generated: ${new Date().toLocaleString()}
Collection Status: ${checkedCount}/${EVIDENCE_ITEMS.length} items verified (${progressPercent}%)

=============================================
COLLECTED EVIDENCE ITEMS:
=============================================
${collected.length > 0 ? collected.join('\n') : 'None recorded yet.'}

=============================================
PENDING EVIDENCE ITEMS:
=============================================
${pending.length > 0 ? pending.join('\n') : 'All items compiled.'}

=============================================
OFFICIAL HELPLINE CONTACTS:
- National Cyber Crime Helpline: 1930
- Cyber Crime Portal: https://cybercrime.gov.in
- Sanchar Saathi (Chakshu): https://sancharsaathi.gov.in
- RBI Sachet: https://sachet.rbi.org.in

NOTICE:
Present this compiled evidence to your bank fraud division within the Golden Hour to expedite account freeze and dispute proceedings.`;
  };

  const copyDossier = () => {
    navigator.clipboard.writeText(generateEvidenceText());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono mb-3">
          <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
          <span>IMMEDIATE INCIDENT RESPONSE SYSTEM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Emergency Help Center: I've Already Been Scammed
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Time is critical. Follow this structured protocol right now to stop further financial loss, initiate bank recovery, and assemble court-admissible evidence.
        </p>

        {/* Urgent Action Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="tel:1930"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Call 1930 Cyber Helpline</span>
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold text-sm transition-colors"
          >
            <span>cybercrime.gov.in Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold text-sm transition-colors"
          >
            <span>File ScamRadar Report</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Critical Anti-Recovery Scam Warning Banner */}
      <div className="mb-10 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-extrabold text-amber-300 text-sm uppercase tracking-wide">
            Critical Warning: Beware of Secondary "Fund Recovery" Scams
          </h3>
          <p className="text-slate-300 leading-relaxed">
            Neither ScamRadar nor genuine law enforcement will ever request fees or guarantee private fund retrieval. Anyone on Telegram, Instagram, or email claiming to be an "ethical hacker" or "funds recovery agent" who asks for advance payment is a secondary scammer exploiting your vulnerability.
          </p>
        </div>
      </div>

      {/* Sequential Response Protocol */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">5-Step Emergency Response Protocol</h2>
            <p className="text-slate-400 text-xs">Execute these actions sequentially to mitigate damages.</p>
          </div>
        </div>

        <div className="space-y-4">
          {EMERGENCY_STEPS.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.step}
                className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-sm">
                      0{step.step}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">{step.title}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border self-start sm:self-auto ${step.badgeColor}`}
                  >
                    {step.badge}
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 pl-2">
                  {step.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 mr-3 flex-shrink-0" />
                      <span className="leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Evidence Checklist */}
      <div className="mb-12 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <CheckSquare className="w-4 h-4" />
              <span>OFFICIAL COMPLAINT READINESS</span>
            </div>
            <h2 className="text-xl font-bold text-white">Interactive Evidence Checklist</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Mark each evidence item as you preserve it. Progress is automatically saved on your device.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyDossier}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSummary ? 'Copied Dossier!' : 'Copy Dossier'}</span>
            </button>
            {checkedCount > 0 && (
              <button
                onClick={clearChecklist}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-black/40 p-4 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-300">Dossier Completion: {checkedCount} / {EVIDENCE_ITEMS.length} Items</span>
            <span className="text-cyan-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {EVIDENCE_ITEMS.map((item) => {
            const isChecked = !!checklist[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-black/30 border-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <h4 className={`text-sm font-semibold ${isChecked ? 'text-emerald-300' : 'text-slate-200'}`}>
                    {item.label}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Verified Official Helplines Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Government Portals */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Building className="w-4 h-4 text-cyan-400" />
            Verified Government Emergency Contacts (India)
          </h3>
          <div className="space-y-3.5">
            {VERIFIED_HELPLINES.map((helpline, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  helpline.isPrimary
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-black/30 border-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{helpline.name}</h4>
                    {helpline.phone && (
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-lg font-mono font-extrabold text-red-400">{helpline.phone}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({helpline.availability})</span>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-1">{helpline.desc}</p>
                  </div>
                  {helpline.phone && (
                    <a
                      href={`tel:${helpline.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 flex-shrink-0"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call
                    </a>
                  )}
                  {helpline.portalOnly && (
                    <a
                      href={helpline.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 text-xs flex items-center gap-1 flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Major Banks Fraud Directory */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-cyan-400" />
            Major Bank Fraud Helplines (24/7 Block Line)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Call your bank immediately to block net banking, UPI VPAs, and dispute transactions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BANK_HELPLINES.map((bank, idx) => (
              <div key={idx} className="p-3.5 bg-black/30 border border-white/5 rounded-xl">
                <span className="text-xs text-slate-300 font-semibold block">{bank.bank}</span>
                <a
                  href={`tel:${bank.number.replace(/\s+/g, '')}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{bank.number}</span>
                </a>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 leading-relaxed">
            <strong>Pro Tip:</strong> Always verify telephone numbers on the back of your physical debit or credit card before calling, in case regional branches have direct dedicated support lines.
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
