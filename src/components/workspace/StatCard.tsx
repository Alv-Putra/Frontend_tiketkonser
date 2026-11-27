'use client';

import type { ReactNode } from 'react';

export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  subtext?: ReactNode;
  trend?: 'up' | 'down' | 'flat' | string;
  trendText?: ReactNode;
}

export default function StatCard({ label, value, subtext, trend, trendText }: StatCardProps) {
  const tone = trend === 'up' ? 'bg-status-success/25 text-status-success' : trend === 'down' ? 'bg-status-danger/25 text-status-danger' : 'bg-status-warning/25 text-status-warning';

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-onyx p-5 transition-colors hover:border-[#3F3F46]">
      <span className="text-xs font-semibold text-mute">{label}</span>
      <div className="font-display text-2xl font-extrabold leading-tight tracking-tight text-white">{value}</div>
      {(trendText || subtext) && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-mute">
          {trendText && <span className={`rounded-full px-2 py-0.5 font-semibold ${tone}`}>{trendText}</span>}
          {subtext}
        </div>
      )}
    </div>
  );
}
