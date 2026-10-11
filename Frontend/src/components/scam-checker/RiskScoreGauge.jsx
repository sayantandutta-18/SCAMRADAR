import React from 'react';
import { motion } from 'framer-motion';

const getRiskColor = (level) => {
  switch (level?.toUpperCase()) {
    case 'HIGH': return '#EF4444';
    case 'MEDIUM': return '#F59E0B';
    case 'LOW': return '#10B981';
    default: return '#9CA3AF';
  }
};

const RiskScoreGauge = ({ score = 0, level = 'UNKNOWN', size = 200 }) => {
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degree arc
  const strokeDashoffset = arcLength - ((score / 100) * arcLength);
  
  const color = getRiskColor(level);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(135deg)' }}
        className="overflow-visible"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - arcLength}
          strokeLinecap="round"
        />
        {/* Fill track */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: arcLength + (circumference - arcLength) }}
          animate={{ strokeDashoffset: strokeDashoffset + (circumference - arcLength) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-sm text-slate-400">/100</span>
      </div>
    </div>
  );
};

export default RiskScoreGauge;
