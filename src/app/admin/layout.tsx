'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import { ROLES } from '@/lib/constants';
import { Ticket } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const loadingFallback = (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center text-ink">
      <div className="w-12 h-12 rounded-xl bg-blaze/10 border border-blaze/30 flex items-center justify-center text-blaze animate-pulse mb-4">
        <Ticket className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-sm font-medium text-ink/60">Memeriksa otentikasi admin...</p>
    </div>
  );

  return (
    <ProtectedRoute
      roles={[ROLES.ADMIN]}
      redirectTo="/admin/login"
      fallback={loadingFallback}
    >
      <WorkspaceLayout>{children}</WorkspaceLayout>
    </ProtectedRoute>
  );
}
