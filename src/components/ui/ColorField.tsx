'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { COLOR_SWATCHES } from '@/lib/seatMap';

/** Pilih warna dari palet cepat atau warna bebas; `name` ikut terkirim bersama form. */
export default function ColorField({ id, name, label, value, defaultValue = COLOR_SWATCHES[0], onChange }: {
  id: string;
  name?: string;
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
}) {
  const [inner, setInner] = useState(defaultValue);
  const current = (value ?? inner).toUpperCase();
  const pick = (color: string) => {
    if (value === undefined) setInner(color);
    onChange?.(color.toUpperCase());
  };

  return (
    <fieldset className="min-w-0">
      <legend className="mb-1.5 text-xs font-bold text-ink">{label}</legend>
      <div className="flex flex-wrap items-center gap-2">
        {COLOR_SWATCHES.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Warna ${color}`}
            aria-pressed={current === color}
            onClick={() => pick(color)}
            className="grid size-8 cursor-pointer place-items-center rounded-sm border border-ink/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze"
            style={{ backgroundColor: color }}
          >
            {current === color && <Check aria-hidden="true" className="size-4" style={{ color: color === '#09090B' ? '#FFFFFF' : '#09090B' }} />}
          </button>
        ))}
        <label htmlFor={id} className="flex cursor-pointer items-center gap-2 rounded-sm border border-ink/15 bg-white px-2 py-1 text-xs font-semibold">
          <input id={id} type="color" value={current.toLowerCase()} onChange={(e) => pick(e.target.value)} className="size-6 cursor-pointer rounded-sm border-0 bg-transparent p-0" />
          {current}
        </label>
      </div>
      {name && <input type="hidden" name={name} value={current} />}
    </fieldset>
  );
}
