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
    <div className="min-h-screen bg-primary-bg">
      <OrganizerSidebar />
      <div className="lg:pl-64 transition-all duration-300">
        <main className="p-5 md:p-8 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}