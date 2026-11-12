'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy } from 'lucide-react';

export default function CopyButton({
  text,
  displayText,
  className = '',
  successDuration = 2000,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), successDuration);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5
        bg-surface border border-border rounded-full
        text-xs font-medium text-text-secondary
        hover:text-text-primary hover:border-primary-accent/50
        transition-all cursor-pointer
        ${className}
      `}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1 text-success"
          >
            <Check size={12} />
            Copied!
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1"
          >
            <Copy size={12} />
            {displayText || 'Copy'}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function CopyInput({
  value,
  label,
  className = '',
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          readOnly
          className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary font-mono"
        />
        <CopyButton text={value} />
      </div>
    </div>
  );
}
