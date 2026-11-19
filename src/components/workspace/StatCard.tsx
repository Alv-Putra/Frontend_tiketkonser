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
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <div className="p-5 rounded-2xl bg-[#141417] border border-[#27272A] hover:border-[#3F3F46] transition-colors">
      <div className="text-xs font-medium text-[#A1A1AA] mb-2">{label}</div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-[#FFFFFF]">{value}</span>
        {trendText && (
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              isUp
                ? 'text-[#8DE2BD] bg-[#193029]'
                : isDown
                ? 'text-[#FFA4B8] bg-[#36202C]'
                : 'text-[#F1C875] bg-[#332B1B]'
            }`}
          >
            {trendText}
          </span>
        )}
      </div>
      {subtext && <div className="text-xs text-[#71717A]">{subtext}</div>}
    </div>
  );
}
