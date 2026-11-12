'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, X, AlertCircle } from 'lucide-react';

const criteria = [
  { id: 'length', label: 'Minimal 8 karakter', test: (pwd) => pwd.length >= 8 },
  { id: 'uppercase', label: 'Mengandung huruf besar', test: (pwd) => /[A-Z]/.test(pwd) },
  { id: 'lowercase', label: 'Mengandung huruf kecil', test: (pwd) => /[a-z]/.test(pwd) },
  { id: 'number', label: 'Mengandung angka', test: (pwd) => /\d/.test(pwd) },
  { id: 'special', label: 'Mengandung karakter khusus (!@#$%)', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

function getStrengthIndex(password) {
  if (!password) return 0;
  const passed = criteria.filter((c) => c.test(password)).length;
  if (passed <= 1) return 1;
  if (passed === 2) return 2;
  if (passed === 3) return 3;
  if (passed === 4) return 4;
  return 5;
}

const strengthConfig = {
  0: { label: '', color: 'bg-border', width: '0%' },
  1: { label: 'Sangat Lemah', color: 'bg-error', width: '20%' },
  2: { label: 'Lemah', color: 'bg-orange-500', width: '40%' },
  3: { label: 'Sedang', color: 'bg-yellow-500', width: '60%' },
  4: { label: 'Kuat', color: 'bg-blue-500', width: '80%' },
  5: { label: 'Sangat Kuat', color: 'bg-success', width: '100%' },
};

const strengthColors = {
  0: 'text-text-muted',
  1: 'text-error',
  2: 'text-orange-500',
  3: 'text-yellow-500',
  4: 'text-blue-500',
  5: 'text-success',
};

export function PasswordStrengthIndicator({
  password = '',
  showCriteria = true,
  className = '',
}) {
  const strengthIndex = getStrengthIndex(password);
  const strength = strengthConfig[strengthIndex];
  const strengthColor = strengthColors[strengthIndex];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted"> Kekuatan password:</span>
          <span className={`font-medium ${strengthColor}`}>
            {strength.label}
          </span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={false}
            animate={{
              width: strength.width,
              backgroundColor: strength.color,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full rounded-full"
          />
        </div>
      </div>

      {/* Criteria List */}
      {showCriteria && password && (
        <ul className="space-y-1.5">
          {criteria.map((criterion) => {
            const passed = criterion.test(password);
            return (
              <li
                key={criterion.id}
                className={`flex items-center gap-2 text-xs transition-colors ${
                  passed ? 'text-success' : 'text-text-muted'
                }`}
              >
                {passed ? (
                  <Check size={14} className="shrink-0" />
                ) : (
                  <X size={14} className="shrink-0" />
                )}
                <span>{criterion.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function PasswordInput({
  label,
  error,
  value,
  onChange,
  showStrength = true,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
          <Lock size={18} />
        </div>

        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-[#0F172A] border rounded-xl px-4 py-3 pl-12 pr-12 text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-200 ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
          }`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          {showPassword ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-error">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      {showStrength && isFocused && (
        <PasswordStrengthIndicator password={value} />
      )}
    </div>
  );
}

export default PasswordStrengthIndicator;
