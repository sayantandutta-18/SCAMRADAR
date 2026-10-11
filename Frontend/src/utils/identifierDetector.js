// Smart identifier type detection from user input
export const detectIdentifierType = (input) => {
  if (!input || !input.trim()) return null;
  
  const trimmed = input.trim();
  
  // Phone: starts with + or is mostly digits, 10+ digits
  const digitsOnly = trimmed.replace(/[\s\-\(\)]/g, '');
  if (/^\+?\d{10,13}$/.test(digitsOnly)) {
    return 'PHONE';
  }
  
  // Email: contains @ with domain
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    // Check if it's a UPI ID (common UPI handles)
    const upiHandles = ['@upi', '@paytm', '@ybl', '@okaxis', '@oksbi', '@okhdfcbank', '@axl', '@ibl', '@sbi', '@icici', '@apl', '@barodampay', '@aubank', '@axisbank', '@centralbank', '@cnrb', '@csbpay', '@dbs', '@federal', '@freecharge', '@hdfcbank', '@hsbc', '@idbi', '@idfc', '@indus', '@iob', '@jkb', '@kotak', '@mahb', '@pnb', '@postbank', '@rbl', '@sib', '@syndicate', '@ubi', '@united', '@utbi', '@vijb', '@yesbank'];
    const lowerInput = trimmed.toLowerCase();
    if (upiHandles.some(handle => lowerInput.endsWith(handle))) {
      return 'UPI';
    }
    return 'EMAIL';
  }
  
  // UPI: contains @ (but not a standard email domain)
  if (trimmed.includes('@') && !trimmed.includes('.com') && !trimmed.includes('.org') && !trimmed.includes('.net') && !trimmed.includes('.edu')) {
    return 'UPI';
  }
  
  // URL: starts with http/https or contains common domain patterns
  if (/^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed) || /\.[a-z]{2,}\//.test(trimmed.toLowerCase())) {
    return 'URL';
  }
  
  // Social media: starts with @ or contains social media platform patterns
  if (trimmed.startsWith('@') || /^(instagram|twitter|facebook|telegram|whatsapp)/i.test(trimmed)) {
    return 'SOCIAL_MEDIA';
  }
  
  return null;
};

// Get label for identifier type
export const getIdentifierLabel = (type) => {
  const labels = {
    PHONE: 'Phone Number',
    UPI: 'UPI ID',
    URL: 'Website URL',
    EMAIL: 'Email Address',
    SOCIAL_MEDIA: 'Social Media',
  };
  return labels[type] || type;
};

// Get placeholder for identifier type
export const getIdentifierPlaceholder = (type) => {
  const placeholders = {
    PHONE: 'e.g. +91 98765 43210',
    UPI: 'e.g. scammer@upi',
    URL: 'e.g. https://suspicious-site.com',
    EMAIL: 'e.g. fraud@example.com',
    SOCIAL_MEDIA: 'e.g. @suspicious_account',
  };
  return placeholders[type] || 'Enter identifier...';
};
