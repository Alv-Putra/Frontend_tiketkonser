'use client';

import ProtectedRoute from '@/components/common/ProtectedRoute';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import { ROLES } from '@/lib/constants';

const roles = [ROLES.ORGANIZER];

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute roles={roles} fallback={<p role="status" className="p-6">Memeriksa sesi organizer…</p>}>
      <WorkspaceLayout>{children}</WorkspaceLayout>
    </ProtectedRoute>
  );
}
