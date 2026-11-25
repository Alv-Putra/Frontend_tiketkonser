'use client';

import { useEffect, useRef, useState } from 'react';
import { getItem, StorageKeys } from '@/lib/storage';
import type { SeatStatusDelta } from '@/types/dashboard';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

/**
 * Langganan perubahan status kursi (seat:status-changed) untuk satu denah.
 * Server hanya mengirim kursi yang berubah, bukan seluruh denah. Socket butuh login.
 */
export function useSeatStatusStream(mapId: string | null, onDelta: (delta: SeatStatusDelta) => void) {
  const handler = useRef(onDelta);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    handler.current = onDelta;
  }, [onDelta]);

  useEffect(() => {
    const token = getItem(StorageKeys.AUTH_TOKEN);
    if (!mapId || typeof token !== 'string') return;

    let cancelled = false;
    let disconnect = () => {};
    // Klien socket dimuat lazy agar tidak membebani halaman tanpa denah.
    import('socket.io-client').then(({ io }) => {
      if (cancelled) return;
      // Transport websocket langsung: tidak lewat long-polling sehingga tidak bergantung pada CORS HTTP.
      const socket = io(SOCKET_URL, { auth: { token }, transports: ['websocket'] });
      socket.on('connect', () => setConnected(true));
      socket.on('disconnect', () => setConnected(false));
      socket.on('seat:status-changed', (delta: SeatStatusDelta) => {
        if (String(delta.seat_map_id) === String(mapId)) handler.current(delta);
      });
      disconnect = () => socket.disconnect();
    });

    return () => {
      cancelled = true;
      disconnect();
      setConnected(false);
    };
  }, [mapId]);

  return connected;
}
