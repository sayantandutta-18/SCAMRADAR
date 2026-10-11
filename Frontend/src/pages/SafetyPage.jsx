import React from 'react';
import { Shield, MessageSquare, CreditCard, Link as LinkIcon, Briefcase, TrendingUp, FileText, AlertOctagon, PhoneCall, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const safetyTopics = [
  {
    id: 1,
    title: 'OTP & Authentication Safety',
    icon: MessageSquare,
    badge: 'CRITICAL',
    points: [
      'Never share your One-Time Password (OTP) with anyone over call, SMS, or chat.',
      'Banks and government agencies will never ask for your OTP or password.',
      'Always inspect the SMS header and context before submitting an OTP anywhere.',
      'Beware of urgent calls claiming your account will be blocked without an OTP.',
    ],
  },
  {
    id: 2,
    title: 'UPI & QR Code Protection',
    icon: CreditCard,
    badge: 'PAYMENTS',
    points: [
      'Entering your UPI PIN always sends money; receiving money NEVER requires entering your PIN.',
      'Do not scan QR codes sent by buyers or strangers on OLX/Marketplace.',
      'Always verify the verified merchant name displayed on the UPI app before confirming.',
      'Decline unexpected collect requests sent from unknown virtual payment addresses.',
    ],
  },
  {
    id: 3,
    title: 'Bank & KYC Impersonation',
    icon: Shield,
    badge: 'IMPERSONATION',
    points: [
      'Banks do not update KYC via links in SMS or WhatsApp.',
      'Never download screen-sharing tools (e.g. AnyDesk, TeamViewer, RustDesk) on request.',
      'Always contact your bank through official helpline numbers printed on your physical card.',
      'Never reveal your ATM card PIN, CVV, or net banking credentials.',
    ],
  },
  {
    id: 4,
    title: 'Phishing & Malicious URLs',
    icon: LinkIcon,
    badge: 'CYBER',
    points: [
      'Look closely at domain spellings (e.g., sbi-login-verify.com is not sbi.co.in).',
      'Verify the padlock and valid SSL certificate on login and payment portals.',
      'Do not open APK attachments or shortened URLs sent via SMS or Telegram.',
      'Check unknown links on ScamRadar before opening them in your browser.',
    ],
  },
  {
    id: 5,
    title: 'Work-From-Home & Job Scams',
    icon: Briefcase,
    badge: 'EMPLOYMENT',
    points: [
      'Legitimate companies never ask candidates to pay registration fees or training deposits.',
      'Be alert to Telegram tasks requiring you to "like YouTube videos" for instant cash.',
      'Verify company domains and recruiter profiles directly on official LinkedIn pages.',
      'Do not surrender original identity documents or bank account credentials.',
    ],
  },
  {
    id: 6,
    title: 'Investment & Crypto Schemes',
    icon: TrendingUp,
    badge: 'FINANCIAL',
    points: [
      'Guaranteed high-return offers (e.g., "double your money in 7 days") are always scams.',
      'Check if financial entities are registered with SEBI, RBI, or regulatory authorities.',
      'Do not deposit money into private individual bank accounts for trading platforms.',
      'Scammers fabricate high-profit dashboards to lure you into depositing larger amounts.',
    ],
  },
  {
    id: 7,
    title: 'Delivery & Courier Fraud',
    icon: FileText,
    badge: 'LOGISTICS',
    points: [
      'Scammers send fake SMS stating "package delivery failed—pay ₹5 re-delivery fee".',
      'Clicking that link leads to fake payment screens that harvest banking credentials.',
      'Track shipments exclusively on the official carrier site using your tracking number.',
    ],
  },
  {
    id: 8,
    title: 'Emergency: If You Have Been Scammed',
    icon: AlertOctagon,
    badge: 'IMMEDIATE ACTION',
    points: [
      'Immediately call the National Cyber Crime Helpline: 1930 (India) or visit cybercrime.gov.in.',
      'Contact your bank within the golden hour to freeze payment gateways and dispute transactions.',
      'Preserve all evidence: screenshots, transaction reference IDs, sender handles, and messages.',
      'Report the identifier on ScamRadar so cryptographic evidence is preserved on-chain.',
    ],
  },
];

const SafetyPage = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>CYBERSECURITY AWARENESS DIRECTORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Safety Center & Defense Guides</h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Practical guides, red flags, and defensive rules to safeguard yourself against digital fraud.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {safetyTopics.map((topic) => {
          const IconComponent = topic.icon;
          return (
            <div
              key={topic.id}
              className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800 rounded-xl border border-white/5">
                      <IconComponent className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {topic.badge}
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  {topic.points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 mr-2.5 flex-shrink-0"></span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {topic.id === 8 && (
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-3">
                  <a
                    href="tel:1930"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call 1930 Helpline
                  </a>
                  <Link
                    to="/report"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold transition-colors"
                  >
                    File Scam Report
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SafetyPage;
