'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const contentVariants = {
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.2 },
    },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.2 },
    },
  },
};

export default function Accordion({
  items = [],
  allowMultiple = false,
  className = '',
  itemClassName = '',
  variant = 'default', // 'default' | 'bordered' | 'filled'
  defaultOpen = [],
}) {
  const [openItems, setOpenItems] = useState(new Set(defaultOpen));

  const toggleItem = (index) => {
    setOpenItems((prev) => {
      const next = allowMultiple ? new Set(prev) : new Set();

      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const variantStyles = {
    default: 'border-b border-border last:border-0',
    bordered: 'border border-border rounded-[18px] overflow-hidden',
    filled: 'bg-surface rounded-[18px]',
  };

  const contentStyles = {
    default: '',
    bordered: 'px-6 pb-6',
    filled: 'px-6 pb-6',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        const Wrapper = variant === 'bordered' || variant === 'filled' ? motion.div : motion.div;

        return (
          <div
            key={index}
            className={variantStyles[variant]}
          >
            <button
              onClick={() => toggleItem(index)}
              className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface/50 transition-colors cursor-pointer ${
                variant === 'bordered' || variant === 'filled' ? 'rounded-[18px]' : ''
              }`}
              aria-expanded={isOpen}
            >
              <span className="font-medium text-text-primary">{item.title}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0"
              >
                <ChevronDown size={18} className="text-text-muted" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  variants={contentVariants}
                  className={`overflow-hidden ${contentStyles[variant]}`}
                >
                  <div className="text-sm text-text-secondary leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function AccordionItem({ title, children, defaultOpen = false, className = '' }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-border rounded-[18px] overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface/50 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-text-primary">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} className="text-text-muted" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={contentVariants}
            className="px-6 pb-6 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
