'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  name?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /** Tampilkan kolom cari; bawaan aktif bila pilihan lebih dari 8. */
  searchable?: boolean;
  /** field: senada dengan input form (latar paper); plain: filter di atas latar paper. */
  variant?: 'field' | 'plain';
  className?: string;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function Select({
  id, name, options, value, defaultValue = '', onChange, placeholder = 'Pilih', disabled = false, required = false,
  searchable, variant = 'plain', className = '', ...aria
}: SelectProps) {
  const uid = useId();
  const listId = `${uid}-list`;
  const reduced = useReducedMotion();
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [inner, setInner] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);

  const current = value ?? inner;
  const selected = options.find((option) => option.value === current);
  const withSearch = searchable ?? options.length > 8;
  const filtered = query
    ? options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  function show() {
    if (disabled) return;
    const node = trigger.current!;
    // Dialog modal ada di top layer; portal ke dialog agar daftar tidak tertutup.
    setHost(node.closest('dialog') ?? document.body);
    setRect(node.getBoundingClientRect());
    setQuery('');
    setActive(Math.max(0, options.findIndex((option) => option.value === current)));
    setOpen(true);
  }

  function close(focusTrigger = true) {
    setOpen(false);
    if (focusTrigger) trigger.current?.focus();
  }

  function choose(option: SelectOption | undefined) {
    if (!option) return;
    if (value === undefined) setInner(option.value);
    onChange?.(option.value);
    close();
  }

  useLayoutEffect(() => {
    if (!open) return;
    (withSearch ? search.current : list.current)?.focus();
  }, [open, withSearch]);

  useEffect(() => {
    if (!open) return;
    const follow = () => setRect(trigger.current?.getBoundingClientRect() ?? null);
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !list.current?.parentElement?.contains(target)) close(false);
    };
    window.addEventListener('scroll', follow, true);
    window.addEventListener('resize', follow);
    document.addEventListener('pointerdown', outside);
    return () => {
      window.removeEventListener('scroll', follow, true);
      window.removeEventListener('resize', follow);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open]);

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView?.({ block: 'nearest' });
  }, [active, open]);

  function onTriggerKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      show();
    }
  }

  function onListKey(event: KeyboardEvent<HTMLElement>) {
    const last = filtered.length - 1;
    const moves: Record<string, () => number> = {
      ArrowDown: () => Math.min(active + 1, last),
      ArrowUp: () => Math.max(active - 1, 0),
      Home: () => 0,
      End: () => last,
    };
    if (moves[event.key]) {
      event.preventDefault();
      setActive(moves[event.key]());
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(filtered[active]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') {
      close(false);
    }
  }

  const below = !rect || rect.bottom + 280 < window.innerHeight || rect.top < 280;

  return (
    <>
      <button
        ref={trigger}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-required={required || undefined}
        disabled={disabled}
        onClick={() => (open ? close() : show())}
        onKeyDown={onTriggerKey}
        className={`flex min-h-11 w-full min-w-0 cursor-pointer items-center justify-between gap-2 border px-3 py-2 text-left text-sm text-ink hover:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze disabled:cursor-default disabled:opacity-60 ${variant === 'field' ? 'rounded-md bg-paper' : 'rounded-md bg-white'} ${aria['aria-invalid'] ? 'border-[#EF4444]' : variant === 'field' ? 'border-ink/20' : 'border-ink/15'} ${className}`}
        {...aria}
      >
        <span className={`min-w-0 truncate ${selected ? 'font-semibold' : 'text-ink/55'}`}>{selected?.label ?? placeholder}</span>
        <ChevronDown aria-hidden="true" className={`size-4 shrink-0 text-ink/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {name && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          name={name}
          value={current}
          required={required}
          onChange={() => undefined}
          onFocus={() => trigger.current?.focus()}
        />
      )}

      {host && createPortal(
        <AnimatePresence>
          {open && rect && (
            <m.div
              initial={reduced ? false : { opacity: 0, y: below ? -6 : 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: below ? -6 : 6, scale: 0.98 }}
              transition={{ duration: 0.18, ease }}
              style={{
                position: 'fixed',
                left: rect.left,
                width: Math.max(rect.width, 200),
                ...(below ? { top: rect.bottom + 6 } : { bottom: window.innerHeight - rect.top + 6 }),
                transformOrigin: below ? 'top' : 'bottom',
              }}
              className="z-[100] overflow-hidden rounded-md border border-ink/10 bg-white text-ink shadow-[0_18px_40px_-16px_rgba(9,9,11,0.35)]"
              onKeyDown={onListKey}
            >
              {withSearch && (
                <div className="flex items-center gap-2 border-b border-ink/10 px-3">
                  <Search aria-hidden="true" className="size-4 shrink-0 text-ink/50" />
                  <input
                    ref={search}
                    type="text"
                    role="searchbox"
                    aria-label="Cari pilihan"
                    aria-controls={listId}
                    aria-activedescendant={filtered[active] ? `${uid}-${active}` : undefined}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                    placeholder="Cari…"
                    className="min-h-10 w-full bg-transparent text-sm outline-none placeholder:text-ink/45"
                  />
                </div>
              )}
              <ul
                ref={list}
                id={listId}
                role="listbox"
                tabIndex={-1}
                aria-labelledby={id}
                aria-activedescendant={!withSearch && filtered[active] ? `${uid}-${active}` : undefined}
                className="max-h-64 overflow-y-auto overscroll-contain p-1 outline-none"
              >
                {filtered.map((option, index) => {
                  const isSelected = option.value === current;
                  return (
                    <li
                      key={option.value}
                      id={`${uid}-${index}`}
                      data-index={index}
                      role="option"
                      aria-selected={isSelected}
                      onPointerEnter={() => setActive(index)}
                      onClick={() => choose(option)}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-sm px-2.5 py-2 text-sm ${index === active ? 'bg-paper' : ''} ${isSelected ? 'font-semibold' : ''}`}
                    >
                      <span className="min-w-0 break-words">{option.label}</span>
                      {isSelected && <Check aria-hidden="true" className="size-4 shrink-0 text-blaze" />}
                    </li>
                  );
                })}
                {!filtered.length && <li className="px-2.5 py-2 text-sm text-ink/55">Tidak ada yang cocok.</li>}
              </ul>
            </m.div>
          )}
        </AnimatePresence>,
        host,
      )}
    </>
  );
}
