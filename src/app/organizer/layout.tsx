'use client';

import { useRouter } from 'next/navigation';
import OrganizerSidebar from '@/components/organizer/OrganizerSidebar';

export default function OrganizerLayout({ children }) {
  const router = useRouter();

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
