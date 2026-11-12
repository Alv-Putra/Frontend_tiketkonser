'use client';

import { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';

const TabsContext = createContext(null);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className = '',
}) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const currentValue = value !== undefined ? value : internalValue;

  const setValue = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }) {
  return (
    <div className={`flex items-center gap-2 p-1 bg-surface rounded-full inline-flex ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = '', disabled = false }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { value: selectedValue, setValue } = context;
  const isActive = selectedValue === value;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setValue(value)}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
        ${isActive
          ? 'bg-primary-accent text-white'
          : 'text-text-secondary hover:text-text-primary'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = '' }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const { value: selectedValue } = context;

  if (selectedValue !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default Tabs;
