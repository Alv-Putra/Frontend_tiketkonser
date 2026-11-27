'use client';

import { useEffect } from 'react';
import { brandFonts } from '@/app/fonts';
import { useThemeStore } from '@/stores/themeStore';
import WorkspaceSidebar from './WorkspaceSidebar';
import WorkspaceTopBar from './WorkspaceTopBar';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const workspaceTheme = useThemeStore((state) => state.workspaceTheme);
  const initThemes = useThemeStore((state) => state.initThemes);

  useEffect(() => {
    initThemes();
  }, [initThemes]);

  return (
    <div
      data-workspace-theme={workspaceTheme}
      className={`${brandFonts} workspace-theme workspace-root flex h-dvh w-full overflow-hidden font-body transition-colors duration-200 ${
        workspaceTheme === 'dark' ? 'bg-ink text-white' : 'bg-[#F4F4F6] text-ink'
      }`}
    >
      <a href="#workspace-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-onyx focus:p-3 focus:text-white focus:outline-2 focus:outline-blaze">
        Langsung ke konten utama
      </a>
      <WorkspaceSidebar />
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <WorkspaceTopBar />
        <main id="workspace-content" tabIndex={-1} className={`flex-1 overflow-y-auto px-4 py-6 lg:px-8 transition-colors duration-200 ${
          workspaceTheme === 'dark' ? 'bg-ink' : 'bg-[#F4F4F6]'
        }`}>
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

