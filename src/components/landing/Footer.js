'use client';

import { Globe, Music, Radio, MessageSquareShare, ArrowUp } from 'lucide-react';

const footerLinks = {
  Navigation: ['Home', 'Concerts', 'Artists', 'FAQ'],
  Support: ['Help Center', 'Terms of Service', 'Privacy Policy', 'Refund Policy'],
  Contact: ['hello@concerthub.com', '+62 812 3456 7890', 'Jakarta, Indonesia'],
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-gradient">Concert</span>Hub
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Platform informasi konser terbesar di Indonesia.
              Download aplikasi kami untuk pengalaman terbaik.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, Music, Radio, MessageSquareShare].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-primary-accent hover:bg-primary-accent/10 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-text-primary mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-text-muted hover:text-text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-border">
          <p className="text-xs text-text-muted">
            &copy; 2026 ConcertHub. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-primary-accent hover:bg-primary-accent/10 transition-all duration-300 cursor-pointer"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
