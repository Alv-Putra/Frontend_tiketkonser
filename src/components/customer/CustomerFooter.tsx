'use client';

import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import TixoLogo from '@/components/landing/TixoLogo';

const footerLinks = {
  Navigasi: [
    { label: 'Beranda', href: '/' },
    { label: 'Festival', href: '/festivals' },
    { label: 'Tiket Saya', href: '/my-tickets' },
    { label: 'Riwayat Pesanan', href: '/orders' },
  ],
  Dukungan: [
    { label: 'Pusat Bantuan', href: '/help' },
    { label: 'Syarat & Ketentuan', href: '/terms' },
    { label: 'Kebijakan Privasi', href: '/privacy' },
    { label: 'Kebijakan Refund', href: '/refund' },
  ],
  Kontak: [
    { label: 'hello@conserid.com', href: 'mailto:hello@conserid.com', external: true },
    { label: '+62 21 1234 5678', href: 'tel:+622112345678', external: true },
    { label: 'Jakarta, Indonesia', href: '#' },
  ],
};

const socialLinks = [
  {
    icon: 'facebook',
    href: 'https://facebook.com/conserid',
    label: 'Facebook',
    svg: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>',
  },
  {
    icon: 'instagram',
    href: 'https://instagram.com/conserid',
    label: 'Instagram',
    svg: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>',
  },
  {
    icon: 'twitter',
    href: 'https://twitter.com/conserid',
    label: 'Twitter',
    svg: '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>',
  },
  {
    icon: 'youtube',
    href: 'https://youtube.com/conserid',
    label: 'YouTube',
    svg: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>',
  },
];

const quickLinks = [
  { label: 'Kebijakan Privasi', href: '/privacy' },
  { label: 'Syarat & Ketentuan', href: '/terms' },
  { label: 'Kebijakan Refund', href: '/refund' },
  { label: 'Pusat Bantuan', href: '/help' },
];

export default function CustomerFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#09090B] pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <TixoLogo />
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-sm">
              Platform penjualan tiket festival dan konser terlengkap di Indonesia.
              Temukan pengalaman musik terbaik dan beli tiket dengan mudah.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-primary-accent hover:bg-primary-accent/10 transition-all"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: social.svg }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Navigasi</h4>
            <ul className="space-y-3">
              {footerLinks.Navigasi.map((link) => (
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

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Dukungan</h4>
            <ul className="space-y-3">
              {footerLinks.Dukungan.map((link) => (
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

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-text-muted mt-0.5 shrink-0" />
                <a
                  href="mailto:hello@conserid.com"
                  className="text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  hello@conserid.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="text-text-muted mt-0.5 shrink-0" />
                <a
                  href="tel:+622112345678"
                  className="text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  +62 21 1234 5678
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-text-muted mt-0.5 shrink-0" />
                <span className="text-sm text-text-muted">
                  Jl. Sudirman No. 123<br />
                  Jakarta Pusat 10220
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Links Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-6 border-t border-border mb-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-text-muted hover:text-primary-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-border gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} ConserId. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-primary-accent hover:bg-primary-accent/10 transition-all cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
