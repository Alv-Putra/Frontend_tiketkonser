import { createStore } from 'zustand/vanilla';

export function createDashboardStore<T>(load: () => Promise<T>) {
  return createStore<{
    data: T | null;
    status: 'loading' | 'ready' | 'error';
    refresh: () => Promise<void>;
  }>((set) => {
    let request = 0;
    return {
      data: null,
      status: 'loading',
      async refresh() {
        const current = ++request;
        set({ status: 'loading' });
        try {
          const data = await load();
          if (request === current) set({ data, status: 'ready' });
        } catch {
          if (request === current) set({ status: 'error' });
        }
      },
    };
  });
}
