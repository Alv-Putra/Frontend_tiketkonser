'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGsap } from '@/lib/gsap';

/** Foto dengan efek parallax. */
export default function ParallaxImage({
  src,
  alt,
  sizes,
  className = '',
  children,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap }) => {
      gsap.fromTo(
        '[data-parallax="img"]',
        { yPercent: -12, scale: 1.25 },
        {
          yPercent: 12,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
      gsap.from(frame.current, {
        scale: 0.86,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: frame.current, start: 'top 80%', once: true },
      });
    },
    frame
  );

  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`}>
      <div data-parallax="img" className="absolute inset-0 will-change-transform">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
      {children}
    </div>
  );
}
