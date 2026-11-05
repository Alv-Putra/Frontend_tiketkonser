'use client';

import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-primary-bg">
      <Sidebar />
      <div className="lg:pl-64 transition-all duration-300">
        <main className="p-5 md:p-8 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}
