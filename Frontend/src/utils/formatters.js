// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date with time
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateString);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format risk score display
export const formatRiskScore = (score) => {
  if (score === undefined || score === null) return 'N/A';
  return `${score}/100`;
};

// Get risk level color classes
export const getRiskColorClass = (level) => {
  switch (level) {
    case 'HIGH': return 'text-red-400';
    case 'MEDIUM': return 'text-amber-400';
    case 'LOW': return 'text-emerald-400';
    default: return 'text-slate-400';
  }
};

export const getRiskBgClass = (level) => {
  switch (level) {
    case 'HIGH': return 'bg-red-500/10 border-red-500/30';
    case 'MEDIUM': return 'bg-amber-500/10 border-amber-500/30';
    case 'LOW': return 'bg-emerald-500/10 border-emerald-500/30';
    default: return 'bg-slate-500/10 border-slate-500/30';
  }
};

export const getRiskDotColor = (level) => {
  switch (level) {
    case 'HIGH': return '#EF4444';
    case 'MEDIUM': return '#F59E0B';
    case 'LOW': return '#10B981';
    default: return '#64748B';
  }
};

// Format scam type for display
export const formatScamType = (type) => {
  if (!type) return 'Unknown';
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

// Format transaction hash for display
export const formatHash = (hash, chars = 8) => {
  if (!hash) return 'N/A';
  if (hash.length <= chars * 2) return hash;
  return `${hash.substring(0, chars)}...${hash.substring(hash.length - chars)}`;
};

// Format identifier for display
export const formatIdentifier = (identifier, type) => {
  if (!identifier) return 'N/A';
  if (type === 'PHONE' && identifier.length === 10) {
    return `+91 ${identifier.substring(0, 5)} ${identifier.substring(5)}`;
  }
  return identifier;
};

// Mask sensitive identifier for privacy in public views
export const maskIdentifier = (identifier, type) => {
  if (!identifier) return 'N/A';
  const str = String(identifier).trim();
  if (type === 'PHONE') {
    if (str.length >= 10) {
      const last4 = str.slice(-4);
      const prefix = str.length > 10 ? `${str.slice(0, -8)} ` : '+91 ';
      return `${prefix}*****${last4}`;
    }
    return str.slice(0, 2) + '****' + str.slice(-2);
  }
  if (type === 'EMAIL') {
    const parts = str.split('@');
    if (parts.length === 2) {
      const name = parts[0];
      const domain = parts[1];
      const visible = name.slice(0, 2);
      return `${visible}***@${domain}`;
    }
    return str.slice(0, 2) + '***';
  }
  if (type === 'UPI') {
    const parts = str.split('@');
    if (parts.length === 2) {
      return `${parts[0].slice(0, 3)}***@${parts[1]}`;
    }
    return str.slice(0, 3) + '***';
  }
  if (type === 'URL') {
    try {
      const url = new URL(str.startsWith('http') ? str : `https://${str}`);
      return `${url.hostname}${url.pathname.length > 1 ? '/...' : ''}`;
    } catch {
      return str.length > 28 ? `${str.slice(0, 25)}...` : str;
    }
  }
  return str.length > 6 ? `${str.slice(0, 3)}***${str.slice(-2)}` : `${str.slice(0, 2)}***`;
};
