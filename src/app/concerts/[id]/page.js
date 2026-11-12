'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket } from 'lucide-react';

export default function RedirectConcertDetail({ params }) {
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    router.replace(`/festivals/${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center mb-4">
            <Ticket size={24} className="text-violet-400" />
          </div>
          <p className="text-sm text-slate-400">Mengalihkan ke detail konser…</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="animate-pulse bg-[#0F172A] rounded-xl h-64 w-full mb-4" />
          <div className="animate-pulse bg-[#0F172A] rounded-xl h-8 w-3/4 mb-3" />
          <div className="animate-pulse bg-[#0F172A] rounded-xl h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}
