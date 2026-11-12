'use client';

import { forwardRef } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

const inputBase =
  'w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

const Input = forwardRef(function Input(
  {
    label,
    error,
    icon: Icon,
    suffix,
    className = '',
    disabled = false,
    loading = false,
    ...props
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Icon size={18} />}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled || loading}
          className={`
            ${inputBase}
            ${Icon ? 'pl-12' : 'pl-4'}
            ${suffix ? 'pr-12' : 'pr-4'}
            ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">{suffix}</div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-rose-400 flex items-center gap-1">{error}</p>
      )}
    </div>
  );
});

export default Input;

export function Textarea({
  label,
  error,
  className = '',
  rows = 4,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      )}
      <textarea
        rows={rows}
        className={`
          ${inputBase}
          resize-none
          ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-rose-400">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  error,
  options = [],
  placeholder = 'Pilih...',
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      )}
      <div className="relative">
        <select
          className={`
            ${inputBase}
            appearance-none cursor-pointer pr-11
            ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <p className="mt-1.5 text-sm text-rose-400">{error}</p>}
    </div>
  );
}

export function Checkbox({ label, error, className = '', ...props }) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        className={`
          w-5 h-5 rounded border-slate-700 bg-[#0F172A]
          text-violet-600 focus:ring-violet-500/30 focus:ring-offset-0 cursor-pointer mt-0.5
          ${error ? 'border-rose-500' : ''}
          ${className}
        `}
        {...props}
      />
      {label && (
        <label className="text-sm text-slate-300 cursor-pointer">{label}</label>
      )}
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}

export function Radio({ label, name, value, checked, className = '', ...props }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        className={`
          w-5 h-5 rounded-full border-slate-700 bg-[#0F172A]
          text-violet-600 focus:ring-violet-500/30 focus:ring-offset-0
          ${className}
        `}
        {...props}
      />
      {label && <span className="text-sm text-slate-300">{label}</span>}
    </label>
  );
}
