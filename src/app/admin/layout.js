'use client';

import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ROLES } from '@/lib/constants';
import { Ticket } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const loadingFallback = (
    <div className="min-h-screen bg-[#0B0D14] flex flex-col items-center justify-center text-[#F4F5FA]">
      <div className="w-12 h-12 rounded-xl bg-[#2A2240] border border-[#362A54] flex items-center justify-center text-[#A78BFA] animate-pulse mb-4">
        <Ticket className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-sm font-medium text-[#A7AEC3]">Memeriksa otentikasi admin...</p>
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
