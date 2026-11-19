'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { ROLES } from '@/lib/constants';
import { Ticket } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const loadingFallback = (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-[#FFFFFF]">
      <div className="w-12 h-12 rounded-xl bg-[#2A1000] border border-[#FF4D00]/30 flex items-center justify-center text-[#FF7A00] animate-pulse mb-4">
        <Ticket className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-sm font-medium text-[#A1A1AA]">Memeriksa otentikasi admin...</p>
    </div>
  );

  return (
    <ProtectedRoute
      roles={[ROLES.ADMIN]}
      redirectTo="/admin/login"
      fallback={loadingFallback}
    >
      {children}
    </ProtectedRoute>
  );
}
