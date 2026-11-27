import type { MouseEvent, PointerEvent } from 'react';

type BackdropEvent = MouseEvent<HTMLElement> | PointerEvent<HTMLElement>;

/** Klik tepat di latar (bukan isi); untuk <dialog>, latar = area di luar kotaknya. */
function onBackdrop(event: BackdropEvent) {
  const element = event.currentTarget;
  if (event.target !== element) return false;
  if (!(element instanceof HTMLDialogElement)) return true;
  const box = element.getBoundingClientRect();
  return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
}

/** Tutup saat latar diklik; seret dari dalam form lalu lepas di luar tidak menutup. */
export function closeOnBackdrop(close: () => void) {
  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      event.currentTarget.dataset.backdropDown = String(onBackdrop(event));
    },
    onClick(event: MouseEvent<HTMLElement>) {
      const started = event.currentTarget.dataset.backdropDown === 'true';
      delete event.currentTarget.dataset.backdropDown;
      if (started && onBackdrop(event)) close();
    },
  };
}
