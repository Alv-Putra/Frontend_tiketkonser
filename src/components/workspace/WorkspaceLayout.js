'use client';

import WorkspaceSidebar from './WorkspaceSidebar';
import WorkspaceTopBar from './WorkspaceTopBar';

export default function WorkspaceLayout({ children, title = 'Dashboard' }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0D14] text-[#F4F5FA]">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <WorkspaceTopBar pageTitle={title} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#0B0D14]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
