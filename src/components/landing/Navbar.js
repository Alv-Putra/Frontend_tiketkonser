'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import Button from '@/components/ui/Button';

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
          ? 'bg-primary-bg/80 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="text-2xl font-bold">
            <span className="text-gradient">Concert</span>Hub
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <Button size="sm" onClick={() => document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })}>
              <Download size={16} />
              Download App
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-text-primary cursor-pointer"
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
            className="md:hidden bg-secondary-bg border-b border-border"
          >
            <div className="px-5 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-text-secondary hover:text-text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Button className="w-full" size="sm" onClick={() => { setMobileOpen(false); document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <Download size={16} />
                Download App
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
