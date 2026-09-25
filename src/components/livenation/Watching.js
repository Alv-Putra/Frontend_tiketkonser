'use client';

import { useState, useEffect, useMemo } from 'react';
import { Play, X } from 'lucide-react';
import useFestivalStore from '@/stores/festivalStore';
import Skeleton from '@/components/ui/Skeleton';

function youtubeUrl(query) {
  return `https://www.youtube.com/embed/videoseries?listType=search&list=${encodeURIComponent(query)}`;
}

export default function Watching() {
  const { festivals, isLoading } = useFestivalStore();
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    if (playing) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [playing]);

  const videos = useMemo(
    () =>
      festivals.slice(0, 10).map((f) => ({
        artist: f.artist,
        title: `${f.artist} - Live Performance`,
        image: f.image,
        url: youtubeUrl(`${f.artist} live concert`),
      })),
    [festivals]
  );

  const featured = videos[selected];

  return (
    <section className="font-ln bg-ln-bg">
      <div className="max-w-[1256px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="mb-8 md:mb-12">
          <h2 className="ln-h1 text-ln-text">WHAT WE&apos;RE WATCHING?</h2>
          <p className="text-base text-ln-muted mt-2">
            Cuplikan penampilan dari artis yang sedang tampil di Asia.
          </p>
        </div>

        {isLoading || !featured ? (
          <div className="grid lg:grid-cols-[330px_1fr] gap-8">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <button
              onClick={() => setPlaying(videos[selected])}
              className="lg:w-[330px] shrink-0 text-left group cursor-pointer focused:outline-none"
              aria-label={`Play ${featured.artist}`}
            >
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${featured.image})` }}
                />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="w-16 h-16 rounded-full bg-white/90 text-ln-primary grid place-items-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={26} className="ml-1" />
                  </span>
                </span>
              </div>
              <div className="pt-4">
                <p className="text-sm font-bold text-ln-primary mt-1">{featured.artist}</p>
                <h3 className="ln-h3 text-ln-text mt-1">{featured.title}</h3>
              </div>
            </button>

            <div className="flex-1 min-w-0 lg:h-[430px] overflow-visible lg:overflow-y-auto pr-1">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {videos.map((video, i) => (
                  <li key={`${video.title}-${i}`}>
                    <button
                      onClick={() => {
                        setSelected(i);
                        if (window.innerWidth < 1024) setPlaying(video);
                      }}
                      aria-label={`Play ${video.artist}`}
                      className={`flex w-full items-center text-left rounded-[6px] border transition-colors cursor-pointer ${
                        i === selected
                          ? 'border-ln-primary'
                          : 'border-transparent hover:border-ln-line'
                      }`}
                    >
                      <span className="relative block w-[150px] shrink-0 aspect-video overflow-hidden rounded-md bg-ln-line">
                        <span
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${video.image})` }}
                        />
                        <span className="absolute inset-0 bg-black/25 grid place-items-center">
                          <Play size={20} className="text-white fill-white" />
                        </span>
                      </span>
                      <span className="flex flex-col justify-center min-w-0 px-4 py-3">
                        <span className="text-[15px] font-bold text-ln-text leading-snug line-clamp-3">
                          {video.title}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {playing && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPlaying(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPlaying(null)}
              aria-label="Close video"
              className="absolute -top-12 right-0 w-10 h-10 grid place-items-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src={playing.url}
                title={playing.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}