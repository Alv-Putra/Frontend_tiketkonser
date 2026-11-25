'use client';

import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import { ROLES } from '@/lib/constants';

const roles = [ROLES.ORGANIZER];

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/organizer/login' || pathname === '/organizer/register') {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute roles={roles} redirectTo="/organizer/login" rememberPath={false} fallback={<p role="status" className="p-6">Memeriksa sesi organizer…</p>}>
      <WorkspaceLayout>{children}</WorkspaceLayout>
    </ProtectedRoute>
  );
}
