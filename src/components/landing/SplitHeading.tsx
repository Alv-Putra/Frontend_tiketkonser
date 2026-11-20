'use client';

import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useGsap } from '@/lib/gsap';

/** Bungkus tiap kata dalam masker agar bisa dianimasikan. */
function splitWords(node: ReactNode, keyPrefix = 'w'): ReactNode {
  return Children.map(node, (child, i) => {
    if (typeof child === 'string') {
      return child.split(/(\s+)/).map((part, j) =>
        /^\s+$/.test(part) || part === '' ? (
          part
        ) : (
          <span key={`${keyPrefix}-${i}-${j}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span data-split-word className="inline-block will-change-transform">
              {part}
            </span>
          </span>
        )
      );
    }
    if (isValidElement(child)) {
      const el = child as ReactElement<{ children?: ReactNode }>;
      return cloneElement(el, undefined, splitWords(el.props.children, `${keyPrefix}-${i}`));
    }
    return child;
  });
}

/** Judul yang katanya naik saat terlihat. */
export default function SplitHeading({
  as: Tag = 'h2',
  children,
  className = '',
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    ({ gsap }) => {
      gsap.from('[data-split-word]', {
        yPercent: 110,
        rotate: 6,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        clearProps: 'transform,willChange',
        scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
      });
    },
    ref
  );

  return (
    <Tag ref={ref} className={className}>
      {splitWords(children)}
    </Tag>
  );
}
