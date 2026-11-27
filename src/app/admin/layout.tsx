'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import { ROLES } from '@/lib/constants';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const loadingFallback = (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center text-ink">
      <div className="relative w-12 h-12 rounded-xl bg-ink/5 border border-line flex items-center justify-center p-2 mb-4">
        <Image src="/LogoTixo.png" alt="Tixo" width={32} height={32} unoptimized priority className="motion-safe:animate-bounce" />
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
