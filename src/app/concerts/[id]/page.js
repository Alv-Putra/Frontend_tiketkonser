'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectConcertDetail({ params }) {
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    router.replace(`/festivals/${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="animate-pulse bg-surface rounded-xl h-8 w-3/4 mx-auto mb-4" />
        <div className="animate-pulse bg-surface rounded-xl h-64 w-full" />
      </div>
    </div>
  );
}