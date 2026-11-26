import Image from 'next/image';
import Link from 'next/link';

/** Logo Tixo. */
export default function TixoLogo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Tixo beranda"
      className={`group inline-flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight ${className || 'text-white'}`}
    >
      <span
        aria-hidden
        className="relative flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
      >
        <Image
          src="/LogoTixo.png"
          alt=""
          width={36}
          height={36}
          unoptimized
          priority
          className="h-full w-full object-contain"
        />
      </span>
      <span>
        Tix<span className="text-blaze">o</span>
      </span>
    </Link>
  );
}
