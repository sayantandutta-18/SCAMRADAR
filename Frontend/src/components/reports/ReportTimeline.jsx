import React from 'react';
import { Check, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const Step = ({ title, description, isCompleted, isLast, icon: Icon, date }) => {
  return (
    <div className="flex gap-4 relative">
      {!isLast && (
        <div className={`absolute top-8 left-[1.125rem] bottom-[-1rem] w-px ${isCompleted ? 'bg-blue-500' : 'bg-slate-700'}`} />
      )}
      <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
        isCompleted 
          ? 'bg-slate-900 border-blue-500 text-blue-500' 
          : 'bg-slate-900 border-slate-700 text-slate-600'
      }`}>
        {isCompleted ? (Icon ? <Icon className="w-4 h-4" /> : <Check className="w-4 h-4" />) : <Clock className="w-4 h-4" />}
      </div>
      <div className="pb-8">
        <h4 className={`text-sm font-bold ${isCompleted ? 'text-white' : 'text-slate-400'}`}>{title}</h4>
        {date && <p className="text-xs text-slate-500 mt-1">{formatDate(date)}</p>}
        {description && (
          <div className={`mt-2 text-sm ${isCompleted ? 'text-slate-300' : 'text-slate-600'}`}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

const ReportTimeline = ({ report }) => {
  if (!report) return null;

  const hasAIAnalysis = !!report.aiAnalysis || !!report.scamType;
  const hasRiskClassification = !!report.riskScore;
  const isBlockchainRegistered = report.blockchain?.registered;

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">Processing Timeline</h3>
      
      <div className="flex flex-col">
        <Step 
          title="Report Submitted" 
          description={`Identifier ${report.identifier} was reported by user.`}
          isCompleted={true}
          date={report.createdAt}
        />
        
        <Step 
          title="AI Analysis" 
          description={hasAIAnalysis ? "NLP analysis completed. Patterns identified." : "Pending AI analysis"}
          isCompleted={hasAIAnalysis}
          icon={AlertTriangle}
          date={report.createdAt}
        />
        
        <Step 
          title="Risk Classification" 
          description={hasRiskClassification ? `Classified as ${report.riskLevel} risk (${report.riskScore}/100)` : "Pending risk assessment"}
          isCompleted={hasRiskClassification}
          date={report.createdAt}
        />
        
        <Step 
          title="Blockchain Registration" 
          description={isBlockchainRegistered 
            ? <span className="font-mono text-xs break-all text-emerald-400/80">Tx: {report.blockchain.transactionHash}</span>
            : "Awaiting decentralized ledger confirmation..."}
          isCompleted={isBlockchainRegistered}
          isLast={true}
          icon={ShieldCheck}
          date={isBlockchainRegistered ? report.blockchain.timestamp || report.createdAt : null}
        />
      </div>
    </div>
  );
};

export default ReportTimeline;
