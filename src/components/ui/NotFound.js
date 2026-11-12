'use client';

import Link from 'next/link';
import { Home, Frown, Search } from 'lucide-react';
import Button from './Button';

export default function NotFoundPage({
  title = '404',
  message = 'Halaman yang kamu cari tidak ditemukan',
  description = 'Mungkin tautannya salah atau halaman sudah dipindahkan.',
  showHomeButton = true,
  showSearchButton = true,
  className = '',
}) {
  return (
    <div className={`min-h-screen flex items-center justify-center p-5 ${className}`}>
      <div className="text-center max-w-md">
        {/* 404 Visual */}
        <div className="relative mb-8">
          <div className="text-[120px] md:text-[180px] font-black text-gradient leading-none select-none">
            404
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-violet-500/10 border border-violet-500/30 rounded-full flex items-center justify-center">
            <Frown size={48} className="text-violet-400" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              {title}
            </h1>
            <p className="text-text-secondary">
              {message}
            </p>
          </div>

          <p className="text-text-muted text-sm">
            {description}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {showHomeButton && (
              <Link href="/">
                <Button size="lg">
                  <Home size={18} />
                  Kembali ke Beranda
                </Button>
              </Link>
            )}

            {showSearchButton && (
              <Link href="/festivals">
                <Button variant="outline" size="lg">
                  <Search size={18} />
                  Jelajahi Festival
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex items-center justify-center gap-8 opacity-30">
          <div className="w-16 h-1 bg-border rounded-full" />
          <div className="w-2 h-2 bg-primary-accent rounded-full" />
          <div className="w-16 h-1 bg-border rounded-full" />
        </div>
      </div>
    </div>
  );
}
