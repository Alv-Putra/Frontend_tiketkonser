import { useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { createDashboardStore } from '@/stores/dashboardStore';

export function useDashboardData<T>(load: () => Promise<T>) {
  // Mount dengan key baru saat parameter pemuatan berubah.
  const [store] = useState(() => createDashboardStore(load));
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void store.getState().refresh();
  }, [store]);

  return useStore(store);
}
