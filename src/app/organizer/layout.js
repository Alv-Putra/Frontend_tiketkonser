'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import OrganizerSidebar from '@/components/organizer/OrganizerSidebar';

export default function OrganizerLayout({ children }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace('/auth/login?redirect=%2Forganizer');
    } else if (user.role !== 'organizer' && user.role !== 'admin') {
      router.replace('/');
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user) return null;
  if (user.role !== 'organizer' && user.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-[#0B0F19]">
      <OrganizerSidebar />
      <div className="flex-1 min-w-0 p-6 pt-16 lg:p-8 lg:pt-8 bg-[#0B0F19]">
        {children}
      </div>
    </div>
  );
}
