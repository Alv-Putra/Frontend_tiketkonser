'use client';

export default function StatCard({ label, value, subtext, trend, trendText }) {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] hover:border-[#2A2E40] transition-colors">
      <div className="text-xs font-medium text-[#A7AEC3] mb-2">{label}</div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F4F5FA]">{value}</span>
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
      {subtext && <div className="text-xs text-[#7F89A0]">{subtext}</div>}
    </div>
  );
}
