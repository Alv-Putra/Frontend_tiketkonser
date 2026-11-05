'use client';

import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  onClick,
  ...props
}) {
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : undefined}
      onClick={onClick}
      className={`bg-secondary-bg border border-border rounded-[18px] overflow-hidden ${hover ? 'hover:shadow-lg hover:shadow-primary-accent/5' : ''} transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
