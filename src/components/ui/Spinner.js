'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const sizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export default function Spinner({
  size = 'md',
  className = '',
  label = 'Loading...',
  fullScreen = false,
}) {
  const sizeClass = sizes[size] || sizes.md;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-bg/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`${sizeClass} border-2 border-border border-t-primary-accent rounded-full`}
          />
          {label && (
            <p className="text-sm text-text-muted">{label}</p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClass} border-2 border-border border-t-primary-accent rounded-full ${className}`}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </motion.div>
  );
}

export function LoadingOverlay({ isLoading, children }) {
  if (!isLoading) return children;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-primary-bg/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-[18px]">
        <Spinner size="lg" />
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export function PageLoader() {
  return <Spinner fullScreen label="Memuat..." />;
}

export function InlineLoader({ size = 'sm' }) {
  return <Spinner size={size} />;
}
