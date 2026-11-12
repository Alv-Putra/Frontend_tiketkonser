'use client';

import { motion } from 'framer-motion';

export default function ProgressBar({
  value = 0,
  max = 100,
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'error'
  showLabel = false,
  label,
  className = '',
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    primary: 'bg-primary-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-text-secondary">{label}</span>
          <span className="text-text-muted font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-surface rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${variants[variant]}`}
        />
      </div>
    </div>
  );
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = 'primary',
  showLabel = true,
  className = '',
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variants = {
    primary: '#0C0435',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#ECECEC"
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={variants[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
