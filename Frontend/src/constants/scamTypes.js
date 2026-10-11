export const IDENTIFIER_TYPES = [
  { value: 'PHONE', label: 'Phone Number', icon: 'Phone' },
  { value: 'UPI', label: 'UPI ID', icon: 'IndianRupee' },
  { value: 'URL', label: 'Website URL', icon: 'Globe' },
  { value: 'EMAIL', label: 'Email Address', icon: 'Mail' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media', icon: 'AtSign' },
];

export const SCAM_TYPES = [
  { value: 'PHISHING', label: 'Phishing', color: '#EF4444' },
  { value: 'JOB_SCAM', label: 'Job Scam', color: '#F97316' },
  { value: 'UPI_FRAUD', label: 'UPI Fraud', color: '#F59E0B' },
  { value: 'LOAN_SCAM', label: 'Loan Scam', color: '#EAB308' },
  { value: 'INVESTMENT_SCAM', label: 'Investment Scam', color: '#84CC16' },
  { value: 'KYC_SCAM', label: 'KYC Scam', color: '#22C55E' },
  { value: 'LOTTERY_SCAM', label: 'Lottery Scam', color: '#14B8A6' },
  { value: 'IMPERSONATION', label: 'Impersonation', color: '#06B6D4' },
  { value: 'DELIVERY_SCAM', label: 'Delivery Scam', color: '#3B82F6' },
  { value: 'ROMANCE_SCAM', label: 'Romance Scam', color: '#8B5CF6' },
  { value: 'TECH_SUPPORT_SCAM', label: 'Tech Support Scam', color: '#A855F7' },
  { value: 'OTHER', label: 'Other', color: '#64748B' },
];

export const RISK_LEVELS = [
  { value: 'LOW', label: 'Low Risk', color: '#10B981' },
  { value: 'MEDIUM', label: 'Medium Risk', color: '#F59E0B' },
  { value: 'HIGH', label: 'High Risk', color: '#EF4444' },
  { value: 'UNKNOWN', label: 'Unknown', color: '#64748B' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export const SUGGESTED_CHAT_QUESTIONS = [
  "I received a message saying I won a lottery. Is it a scam?",
  "Someone asking for my OTP over phone, what should I do?",
  "Is it safe to click on a link in an SMS from my bank?",
  "I got a job offer asking for registration fee. Is this genuine?",
  "Someone is asking me to install an app to get a refund",
  "What should I do if I've already shared my bank details?",
];
