import React from 'react';
import { Shield, MessageSquare, CreditCard, Link as LinkIcon, Briefcase, TrendingUp, FileText, AlertOctagon } from 'lucide-react';

const safetyTopics = [
  {
    id: 1,
    title: 'OTP Safety',
    icon: MessageSquare,
    points: [
      'Never share your OTP with anyone over a call or message.',
      'Banks or officials will never ask for your OTP.',
      'Always check the SMS context before entering an OTP.',
      'Be wary of urgency or threats demanding an OTP.'
    ]
  },
  {
    id: 2,
    title: 'UPI Safety',
    icon: CreditCard,
    points: [
      'UPI PIN is only needed to send money, not to receive it.',
      'Verify the recipient\'s name before confirming a transaction.',
      'Do not scan unknown QR codes to receive payments.',
      'Ignore random payment requests from unknown numbers.'
    ]
  },
  {
    id: 3,
    title: 'Banking Scam Awareness',
    icon: Shield,
    points: [
      'Only use official banking apps from verified stores.',
      'Banks will not ask for your ATM PIN or CVV.',
      'Beware of calls claiming your account will be blocked.',
      'Regularly check your bank statements for unauthorized transactions.'
    ]
  },
  {
    id: 4,
    title: 'Phishing Awareness',
    icon: LinkIcon,
    points: [
      'Check URLs carefully for misspellings (e.g., g00gle.com instead of google.com).',
      'Look for HTTPS and the padlock icon on websites.',
      'Do not click on links in unsolicited emails or SMS.',
      'Verify the sender\'s email address, not just the display name.'
    ]
  },
  {
    id: 5,
    title: 'Fake Job Scams',
    icon: Briefcase,
    points: [
      'Genuine employers will never ask for a fee or deposit.',
      'Be cautious of offers that seem too good to be true with minimal effort.',
      'Verify the company and the recruiter\'s credentials.',
      'Do not share personal documents unless verifying the employer.'
    ]
  },
  {
    id: 6,
    title: 'Investment Scams',
    icon: TrendingUp,
    points: [
      'Avoid promises of guaranteed high returns with no risk.',
      'Check if the platform is registered with regulatory authorities.',
      'Do not invest through unknown Telegram or WhatsApp groups.',
      'Take your time; scammers often create a false sense of urgency.'
    ]
  },
  {
    id: 7,
    title: 'KYC Scams',
    icon: FileText,
    points: [
      'Banks do not update KYC via SMS links or calls.',
      'Use only the official app or visit the branch for KYC updates.',
      'Do not download screen-sharing apps (like AnyDesk) if asked by a "support agent".',
      'Ignore messages threatening account suspension due to pending KYC.'
    ]
  },
  {
    id: 8,
    title: 'What To Do After Being Scammed',
    icon: AlertOctagon,
    points: [
      'Immediately block the contact and do not communicate further.',
      'Call the cybercrime helpline (1930 in India) or file a report online.',
      'Contact your bank immediately to freeze your accounts or block cards.',
      'Change passwords for your critical accounts.'
    ]
  }
];

const SafetyPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Safety Center</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Stay informed and stay safe. Learn about common scams and how to protect yourself and your loved ones from digital fraud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safetyTopics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <div key={topic.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <IconComponent className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{topic.title}</h3>
                </div>
                <ul className="space-y-3">
                  {topic.points.map((point, index) => (
                    <li key={index} className="flex items-start text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 mr-3 flex-shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SafetyPage;
