'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function OrganizerDialog({ title, onClose, busy = false, error, className, children }: {
  title: string;
  onClose: () => void;
  busy?: boolean;
  error?: unknown;
  className: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current!;
    const trigger = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, []);

  useEffect(() => {
    if (error) dialogRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [error]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto overscroll-contain rounded-3xl border border-line bg-white p-0 text-ink shadow-xl [color-scheme:light] backdrop:bg-ink/60 ${className}`}
    >
      {children}
    </dialog>
  );
}
