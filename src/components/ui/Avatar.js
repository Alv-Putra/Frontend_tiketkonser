'use client';

import { motion } from 'framer-motion';

const sizes = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
  '2xl': 'w-16 h-16',
};

const textSizes = {
  xs: 'text-[8px]',
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base',
  '2xl': 'text-lg',
};

export default function Avatar({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  className = '',
}) {
  const sizeClass = sizes[size] || sizes.md;
  const textSizeClass = textSizes[size] || textSizes.md;

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const colors = [
    'bg-gradient-primary',
    'bg-gradient-to-br from-blue-500 to-purple-600',
    'bg-gradient-to-br from-green-500 to-teal-600',
    'bg-gradient-to-br from-orange-500 to-red-600',
    'bg-gradient-to-br from-pink-500 to-rose-600',
  ];

  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  if (src) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`${sizeClass} rounded-full overflow-hidden ring-2 ring-border ${className}`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${sizeClass} rounded-full ${colors[colorIndex]} flex items-center justify-center ring-2 ring-border ${className}`}
    >
      <span className={`${textSizeClass} font-bold text-white`}>
        {initials}
      </span>
    </motion.div>
  );
}
