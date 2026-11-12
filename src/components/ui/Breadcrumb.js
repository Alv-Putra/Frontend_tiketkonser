import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ customItems = [] }) {
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter(Boolean);

  const items = [
    { label: 'Beranda', href: '/' },
    ...pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
      return { label, href };
    }),
    ...customItems,
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.href || index} className="flex items-center gap-1.5">
            {index === 0 && (
              <Link
                href="/"
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <Home size={14} />
              </Link>
            )}
            {index > 0 && (
              <ChevronRight size={14} className="text-text-muted/50" />
            )}
            {isLast ? (
              <span className="text-text-primary font-medium truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-text-muted hover:text-text-primary transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
