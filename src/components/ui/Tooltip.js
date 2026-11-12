'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';

const positions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrows = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-border',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-border',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-border',
  right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-border',
};

export default function Tooltip({
  children,
  content,
  position = 'top',
  disabled = false,
}) {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled || !content) return children;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${positions[position]}`}
          >
            <div className="bg-secondary-bg border border-border rounded-[12px] px-3 py-2 shadow-xl min-w-[120px] max-w-[280px]">
              <p className="text-xs text-text-primary leading-relaxed whitespace-normal">
                {content}
              </p>
            </div>
            <div
              className={`absolute w-0 h-0 border-4 ${arrows[position]}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InfoTooltip({ content, className = '' }) {
  return (
    <Tooltip content={content} position="right">
      <button
        type="button"
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full bg-surface text-text-muted hover:text-text-primary hover:bg-border transition-colors ${className}`}
        aria-label="Informasi"
      >
        <Info size={12} />
      </button>
    </Tooltip>
  );
}

export function HintTooltip({ children, content }) {
  return (
    <Tooltip content={content} position="top">
      {children}
    </Tooltip>
  );
}
