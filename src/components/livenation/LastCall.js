'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import useFestivalStore from '@/stores/festivalStore';
import { formatDateShort } from '@/lib/formatters';
import Skeleton from '@/components/ui/Skeleton';

export default function LastCall() {
  const { festivals, isLoading, fetchFestivals } = useFestivalStore();

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  const picks = useMemo(() => {
    return festivals
      .map((f) => {
        const remaining = (f.ticketTypes || []).reduce(
          (sum, t) => sum + Math.max(0, t.quota - t.sold),
          0
        );
        return { ...f, remaining };
      })
      .filter((f) => f.ticketStatus === 'available' && f.remaining > 0)
      .sort((a, b) => a.remaining - b.remaining)
      .slice(0, 3);
  }, [festivals]);

  return (
    <section className="font-ln bg-ln-bg pb-12 md:pb-16">
      <div className="max-w-[1256px] mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-12">
          <h2 className="ln-h1 text-ln-text">LAST CALL FOR TICKETS</h2>
          <p className="text-base text-ln-muted mt-2">
            Tiket hampir habis. Amankan tempatmu sebelum kehabisan!
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-ln-surface rounded-[6px] p-6">
                <Skeleton className="aspect-video w-full rounded" />
                <Skeleton className="h-5 w-3/4 mt-4" />
                <Skeleton className="h-4 w-1/2 mt-3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {picks.map((festival) => (
              <div
                key={festival.id}
                className="bg-ln-surface rounded-[6px] px-6 pt-6 pb-8 shadow-sm"
              >
                <Link href={`/festivals/${festival.id}`} className="group block">
                  <div className="relative aspect-video overflow-hidden rounded bg-ln-line">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url(${festival.image})` }}
                    />
                  </div>
                  <h3 className="ln-h3 text-ln-text mt-5 line-clamp-1">{festival.title}</h3>
                  <p className="text-sm text-ln-muted mt-2 line-clamp-1">
                    {festival.artist} · {festival.venue}
                  </p>
                  <p className="text-sm text-ln-muted mt-1">
                    {formatDateShort(festival.date)}
                  </p>
                  <p className="text-sm text-ln-error font-bold mt-3">
                    Hanya {festival.remaining} tiket tersisa
                  </p>
                </Link>
                <Link
                  href={`/festivals/${festival.id}`}
                  className="mt-5 inline-flex items-center justify-center gap-2 h-10 w-full rounded-full bg-ln-primary text-white text-sm font-bold hover:bg-ln-primary-dark transition-colors"
                >
                  More Info <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}