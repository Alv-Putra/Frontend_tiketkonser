'use client';

import { motion } from 'framer-motion';

const colorMap = {
  'primary-accent': { bg: 'bg-primary-accent/10', text: 'text-primary-accent' },
  'success': { bg: 'bg-success/10', text: 'text-success' },
  'secondary-accent': { bg: 'bg-secondary-accent/10', text: 'text-secondary-accent' },
  'warning': { bg: 'bg-warning/10', text: 'text-warning' },
};

export default function StatCard({ icon: Icon, label, value, change, color = 'primary-accent' }) {
  const colors = colorMap[color] || colorMap['primary-accent'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary-bg border border-border rounded-[18px] p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-muted">{label}</span>
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Icon size={20} className={colors.text} />
        </div>
      </div>
      <p className="text-2xl font-bold text-text-primary mb-1">{value}</p>
      {change !== undefined && (
        <p className={`text-sm ${change >= 0 ? 'text-success' : 'text-error'}`}>
          {change >= 0 ? '+' : ''}{change}% dari bulan lalu
        </p>
      )}
    </motion.div>
  );
}
