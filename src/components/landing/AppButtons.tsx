import { APP_LINKS } from './data';

function StoreIcon({ store }: { store: 'play' | 'apple' }) {
  return store === 'play' ? (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M4.2 2.6a1.4 1.4 0 0 0-.7 1.2v16.4c0 .5.3 1 .7 1.2L13.6 12 4.2 2.6Zm10.8 10.8 2.3 2.3-10.6 6 8.3-8.3Zm0-2.8L6.7 2.3l10.6 6-2.3 2.3Zm3.6.2 2.6 1.5c.9.5.9 1.8 0 2.3l-2.6 1.5-2.6-2.6 2.6-2.7Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9ZM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4Z" />
    </svg>
  );
}

function StoreButton({
  store,
  href,
  label,
}: {
  store: 'play' | 'apple';
  href: string | null;
  label: string;
}) {
  const content = (
    <>
      <StoreIcon store={store} />
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">
          {href ? 'Unduh di' : 'Segera hadir di'}
        </span>
        <span className="font-display text-base font-bold">{label}</span>
      </span>
    </>
  );

  const base =
    'inline-flex items-center gap-3 rounded-2xl border-2 px-5 py-3 transition-transform duration-200';

  if (!href) {
    return (
      <span className={`${base} cursor-default border-line bg-onyx text-mute`} aria-disabled>
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} border-white bg-white text-ink hover:-translate-y-1 hover:-rotate-1`}
    >
      {content}
    </a>
  );
}

export default function AppButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <StoreButton store="play" href={APP_LINKS.playStore} label="Google Play" />
      <StoreButton store="apple" href={APP_LINKS.appStore} label="App Store" />
    </div>
  );
}
