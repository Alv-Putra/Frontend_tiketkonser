'use client';

import { motion } from 'framer-motion';

const colorMap = {
  'primary-accent': { bg: 'bg-violet-500/15', text: 'text-violet-400' },
  'primary': { bg: 'bg-violet-500/15', text: 'text-violet-400' },
  'success': { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  'secondary-accent': { bg: 'bg-pink-500/15', text: 'text-pink-400' },
  'info': { bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
  'warning': { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  'error': { bg: 'bg-rose-500/15', text: 'text-rose-400' },
};

export default function StatCard({ icon: Icon, label, value, change, color = 'primary-accent' }) {
  const colors = colorMap[color] || colorMap['primary-accent'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111827] border border-slate-800 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4 gap-3">
        <span className="text-sm text-slate-400">{label}</span>
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
          <Icon size={20} className={colors.text} />
        </div>
      </div>
      <p className="text-2xl font-black text-slate-50 mb-1">{value}</p>
      {change !== undefined && (
        <p className={`text-sm ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {change >= 0 ? '+' : ''}{change}% dari bulan lalu
        </p>
      )}
    </motion.div>
  );
}
