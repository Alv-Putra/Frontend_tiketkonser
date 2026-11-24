'use client';

import { brandFonts } from '@/app/fonts';
import WorkspaceSidebar from './WorkspaceSidebar';
import WorkspaceTopBar from './WorkspaceTopBar';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${brandFonts} flex h-dvh w-full overflow-hidden bg-paper font-body text-ink`}>
      <a href="#workspace-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-paper focus:p-3 focus:outline-2 focus:outline-blaze">
        Langsung ke konten utama
      </a>
      <WorkspaceSidebar />
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <WorkspaceTopBar />
        <main id="workspace-content" tabIndex={-1} className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
