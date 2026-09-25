'use client';

import { ArrowUp } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  Navigasi: [
    { label: 'Beranda', href: '/' },
    { label: 'Festival', href: '/festivals' },
  ],
  Dukungan: [
    { label: 'Help Center', href: '#' },
    { label: 'Syarat & Ketentuan', href: '#' },
    { label: 'Kebijakan Privasi', href: '#' },
    { label: 'Kebijakan Refund', href: '#' },
  ],
  Kontak: [
    { label: 'hello@conserid.com', href: 'mailto:hello@conserid.com' },
    { label: '+62 812 3456 7890', href: 'tel:+6281234567890' },
    { label: 'Jakarta, Indonesia', href: '#' },
  ],
};

export default function CustomerFooter() {
  return (
    <footer className="border-t border-border pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-gradient">Conser</span>Id
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Platform penjualan tiket festival dan konser terlengkap di Indonesia.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-text-primary mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-border">
          <p className="text-xs text-text-muted">
            &copy; 2026 ConserId. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-primary-accent hover:bg-primary-accent/10 transition-all duration-300 cursor-pointer"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}