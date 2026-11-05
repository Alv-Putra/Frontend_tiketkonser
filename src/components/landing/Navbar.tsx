'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Concert', href: '#concerts' },
  { label: 'Artists', href: '#artists' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-ln-surface/90 backdrop-blur-xl border-b border-ln-line shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1256px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="text-2xl font-black tracking-tight text-ln-dark">
            Conser<span className="text-ln-primary">Id</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-ln-muted hover:text-ln-dark transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <button
              onClick={() => document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-ln inline-flex items-center gap-2 rounded-full bg-ln-primary px-4 py-2 text-sm font-bold text-white hover:bg-ln-primary-dark transition-colors cursor-pointer"
            >
              <Download size={16} />
              Download App
            </button>
          </div>

          <button
            className="md:hidden p-2 text-ln-dark cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ln-surface border-b border-ln-line"
          >
            <div className="px-5 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-semibold text-ln-text hover:text-ln-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { setMobileOpen(false); document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="font-ln inline-flex items-center justify-center gap-2 rounded-full bg-ln-primary px-4 py-2 text-sm font-bold text-white hover:bg-ln-primary-dark transition-colors cursor-pointer w-full"
              >
                <Download size={16} />
                Download App
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
