'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login/');

  // The admin login page owns its own centred, chrome-free layout.
  if (isLogin) {
    return <div className="min-h-screen bg-[#0B0F19]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F19]">
      <Sidebar />
      <div className="flex-1 min-w-0 p-6 pt-16 lg:p-8 lg:pt-8 bg-[#0B0F19]">
        {children}
      </div>
    </div>
  );
}
