'use client';

import { motion } from 'framer-motion';

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  direction = 'up', // 'up', 'down', 'left', 'right'
}) {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.3,
  className = '',
  scale = 0.95,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  initialDelay = 0,
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: initialDelay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
  direction = 'up',
}) {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...directions[direction] },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: { duration: 0.4, ease: 'easeOut' },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  direction = 'left',
  distance = 100,
  delay = 0,
  duration = 0.5,
  className = '',
}) {
  const offsets = {
    left: { x: -distance },
    right: { x: distance },
    up: { y: -distance },
    down: { y: distance },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverScale({
  children,
  scale = 1.05,
  className = '',
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ButtonHover({
  children,
  className = '',
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Pulse({
  children,
  className = '',
}) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.02, 1],
        opacity: [1, 0.9, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Spin({
  children,
  size = 24,
  className = '',
}) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
