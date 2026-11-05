'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUp, AtSign, Camera, MessageSquareShare, Music2, MapPin, Radio, Share2, Check } from 'lucide-react';

const aboutLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Terms and Conditions', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Sustainability Charter', href: '#' },
  { label: 'Cookie Policy', href: '#' },
  { label: 'Accessibility Statement', href: '#' },
];

const quickLinks = [
  { label: 'All Concerts & Events', href: '/festivals' },
  { label: 'Festivals', href: '/festivals' },
  { label: 'VIP Experiences', href: '/festivals' },
  { label: 'My Tickets', href: '/my-tickets' },
  { label: 'Sign In / Register', href: '/auth/login' },
];

const socials = [
  { icon: AtSign, label: 'Instagram' },
  { icon: MessageSquareShare, label: 'Facebook' },
  { icon: Share2, label: 'X / Twitter' },
  { icon: Camera, label: 'YouTube' },
  { icon: Radio, label: 'TikTok' },
  { icon: Music2, label: 'Spotify' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <footer className="font-ln bg-ln-dark text-ln-muted">
      <div className="max-w-[1256px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <span className="text-2xl font-black tracking-tight text-white">
              Conser<span className="text-ln-primary">Id</span>
            </span>
            <p className="text-sm leading-relaxed mt-4 text-ln-muted/90">
              Platform informasi & penjualan tiket konser dan festival terbesar
              di Indonesia. Akses presale, event eksklusif, dan e-ticket dengan
              QR Code dari satu tempat.
            </p>
            <a
              href="https://open.spotify.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-white hover:text-ln-sky transition-colors"
            >
              <Music2 size={18} />
              Listen on Spotify
            </a>
          </div>

          <div>
            <h3 className="ln-h5 text-white uppercase mb-5">About Us</h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="ln-h5 text-white uppercase mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="ln-h5 text-white uppercase mb-5">Never Miss A Show</h3>
            <p className="text-sm leading-relaxed mb-4">
              Daftar newsletter untuk dapat info presale & event terbaru di
              inbox kamu.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-[6px] border border-ln-line px-4 py-3">
                <Check size={16} className="text-ln-sky shrink-0" />
                <p className="text-sm text-white">Terima kasih sudah berlangganan!</p>
              </div>
            ) : (
              <form onSubmit={subscribe} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Alamat email"
                  className="w-full rounded-[6px] border border-ln-line bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white transition-colors placeholder:text-ln-muted"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-ln-primary text-white font-bold px-6 py-3 text-sm hover:bg-ln-primary-dark transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid place-items-center w-9 h-9 rounded-full border border-ln-line text-ln-muted hover:text-white hover:border-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="max-w-[1256px] mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2026 ConserId. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} />
              Indonesia
            </span>
            <Link href="/festivals" className="hover:text-white transition-colors">
              All Concerts & Events
            </Link>
            <Link href="/my-tickets" className="hover:text-white transition-colors">
              My Tickets
            </Link>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="grid place-items-center w-9 h-9 rounded-full border border-ln-line text-ln-muted hover:text-white hover:border-white transition-colors cursor-pointer"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}