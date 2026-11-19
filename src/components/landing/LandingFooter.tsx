import Link from 'next/link';
import TixoLogo from './TixoLogo';
import { ORGANIZER_HREF } from './data';

const COLUMNS = [
  {
    title: 'Tixo',
    links: [
      { href: '/about', label: 'Tentang kami' },
      { href: '/help', label: 'Bantuan' },
    ],
  },
  {
    title: 'Organizer',
    links: [
      { href: ORGANIZER_HREF, label: 'Dashboard organizer' },
      { href: '#organizer', label: 'Kenapa Tixo' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/terms', label: 'Syarat & ketentuan' },
      { href: '/privacy', label: 'Kebijakan privasi' },
      { href: '/refund', label: 'Kebijakan refund' },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="bg-ink pb-10 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <TixoLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute">
              Tiket konser favoritmu, dari gig kecil sampai stadion.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} prefetch={false} className="text-sm text-mute transition-colors hover:text-tangerine">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-line pt-6 text-xs text-mute">
          <p>© {new Date().getFullYear()} Tixo. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
