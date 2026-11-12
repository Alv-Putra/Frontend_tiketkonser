'use client';

import Link from 'next/link';
import {
  ArrowUp,
  AtSign,
  Camera,
  MessageSquareShare,
  Music2,
  MapPin,
  Radio,
  Share2,
  Smartphone,
  Mail,
  Headphones,
} from 'lucide-react';

const aboutLinks = [
  { label: 'Tentang Kami', href: '/about' },
  { label: 'Syarat & Ketentuan', href: '/terms' },
  { label: 'Kebijakan Privasi', href: '/privacy' },
  { label: 'Kebijakan Refund', href: '/refund' },
  { label: 'Pusat Bantuan', href: '/help' },
];

const quickLinks = [
  { label: 'Semua Festival', href: '/festivals' },
  { label: 'Festival Musik', href: '/festivals?genre=musik' },
  { label: 'Tiket Saya', href: '/my-tickets' },
  { label: 'Masuk', href: '/auth/login' },
  { label: 'Daftar', href: '/auth/register' },
];

const socials = [
  { icon: AtSign, label: 'Instagram', href: 'https://instagram.com/conserid' },
  { icon: MessageSquareShare, label: 'Facebook', href: 'https://facebook.com/conserid' },
  { icon: Share2, label: 'X / Twitter', href: 'https://twitter.com/conserid' },
  { icon: Camera, label: 'YouTube', href: 'https://youtube.com/conserid' },
  { icon: Radio, label: 'TikTok', href: 'https://tiktok.com/@conserid' },
  { icon: Music2, label: 'Spotify', href: 'https://open.spotify.com/' },
];

const footerNav = [
  { label: 'Beranda', href: '/' },
  { label: 'Festival', href: '/festivals' },
  { label: 'Tiket Saya', href: '/my-tickets' },
  { label: 'Pesanan', href: '/orders' },
  { label: 'Pusat Bantuan', href: '/help' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080B12] text-slate-400 border-t border-slate-800/80 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-black tracking-tight text-slate-50">
                Conser<span className="text-violet-500">Id</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mt-4 text-slate-400 max-w-sm">
              Platform informasi &amp; penjualan tiket konser dan festival musik resmi terbesar
              di Indonesia. Akses presale, tiket eksklusif, dan e-ticket dengan
              QR Code terverifikasi.
            </p>

            {/* Spotify Link */}
            <a
              href="https://open.spotify.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-slate-100 hover:text-violet-400 transition-colors"
            >
              <Music2 size={18} />
              Dengarkan Playlist di Spotify
            </a>

            {/* Download App Section */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Aplikasi Mobile:</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <Smartphone size={14} className="text-violet-400" />
                Segera Hadir di iOS &amp; Android
              </div>
            </div>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase mb-5">Tentang</h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-slate-50 transition-colors break-words">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase mb-5">Tautan Cepat</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-slate-50 transition-colors break-words">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Contact */}
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase mb-5">Bantuan &amp; Kontak</h3>
            <p className="text-sm leading-relaxed mb-4 text-slate-400">
              Butuh bantuan terkait tiket atau pesanan? Tim kami siap melayani setiap hari.
            </p>
            <div className="space-y-2.5 text-xs text-slate-300 mb-5">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-violet-400 shrink-0" />
                <span>support@conserid.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones size={14} className="text-violet-400 shrink-0" />
                <span>09.00 - 21.00 WIB (Senin - Minggu)</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid place-items-center w-9 h-9 rounded-full border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-50 hover:border-violet-500 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
              {footerNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-slate-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Copyright and Location */}
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                Indonesia
              </span>
              <span className="text-slate-600">|</span>
              <p>© {new Date().getFullYear()} ConserId. All rights reserved.</p>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="grid place-items-center w-9 h-9 rounded-full border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-50 hover:border-violet-500 transition-colors cursor-pointer"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
