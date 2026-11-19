import Link from 'next/link';

/** Wordmark Tixo: huruf "o" dibuat seperti lubang sobekan tiket. */
export default function TixoLogo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Tixo beranda"
      className={`group inline-flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-white ${className}`}
    >
      <span
        aria-hidden
        className="grid h-9 w-9 -rotate-6 place-items-center rounded-lg bg-blaze text-ink transition-transform duration-300 group-hover:rotate-6"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V7Zm11 0v2h2V7h-2Zm0 4v2h2v-2h-2Zm0 4v2h2v-2h-2Z" />
        </svg>
      </span>
      <span>
        Tix<span className="text-blaze">o</span>
      </span>
    </Link>
  );
}
