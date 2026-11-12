'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Chip({
  children,
  selected = false,
  onClick,
  variant = 'default', // 'default' | 'outline' | 'filled'
  size = 'md', // 'sm' | 'md' | 'lg'
  removable = false,
  onRemove,
  className = '',
  ...props
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = (e) => {
    e.stopPropagation();
    setIsRemoving(true);
    setTimeout(() => {
      onRemove?.();
    }, 150);
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const variants = {
    default: selected
      ? 'bg-primary-accent text-white border-primary-accent'
      : 'bg-surface text-text-secondary border-border hover:border-primary-accent/50',
    outline: selected
      ? 'bg-primary-accent/10 text-primary-accent border-primary-accent'
      : 'bg-transparent text-text-secondary border-border hover:border-primary-accent/50',
    filled: selected
      ? 'bg-primary-accent text-white'
      : 'bg-surface text-text-secondary',
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <motion.div
      initial={false}
      animate={{
        scale: isRemoving ? 0.8 : 1,
        opacity: isRemoving ? 0 : 1,
      }}
      transition={{ duration: 0.15 }}
    >
      <Component
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={`
          inline-flex items-center gap-1.5 rounded-full font-medium border transition-all duration-200
          ${sizes[size]}
          ${variants[variant]}
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
        {removable && selected && (
          <button
            onClick={handleRemove}
            className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
            aria-label="Remove"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </Component>
    </motion.div>
  );
}

export function ChipGroup({
  options = [],
  value = [],
  onChange,
  multiple = true,
  className = '',
}) {
  const handleToggle = (optionValue) => {
    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange?.(newValue);
    } else {
      onChange?.(value === optionValue ? null : optionValue);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => (
        <Chip
          key={option.value}
          selected={value.includes(option.value)}
          onClick={() => handleToggle(option.value)}
          variant="outline"
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );
}
