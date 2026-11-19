'use client';

import WorkspaceSidebar from './WorkspaceSidebar';
import WorkspaceTopBar from './WorkspaceTopBar';

export default function WorkspaceLayout({ children, title = 'Dashboard' }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090B] text-[#FFFFFF]">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <WorkspaceTopBar pageTitle={title} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#09090B]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
