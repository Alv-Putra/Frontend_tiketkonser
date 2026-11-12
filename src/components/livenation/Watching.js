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
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setPlaying(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
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
    <section className="bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-50">
            WHAT WE&apos;RE WATCHING?
          </h2>
          <p className="text-slate-400 mt-3">
            Cuplikan penampilan dari artis yang sedang tampil di Asia.
          </p>
        </div>

        {isLoading || !featured ? (
          <div className="grid lg:grid-cols-[330px_1fr] gap-8">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
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
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-800">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${featured.image})` }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="w-16 h-16 rounded-full bg-slate-800 text-violet-400 border border-slate-700 grid place-items-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={26} className="ml-1" />
                  </span>
                </span>
              </div>
              <div className="pt-4">
                <p className="text-sm font-bold text-violet-400 mt-1 truncate">{featured.artist}</p>
                <h3 className="text-xl font-bold text-slate-50 mt-1 line-clamp-2 break-words">
                  {featured.title}
                </h3>
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
                      className={`flex w-full items-center text-left rounded-xl border transition-colors cursor-pointer ${
                        i === selected
                          ? 'border-violet-500 bg-slate-800/50'
                          : 'border-transparent hover:border-slate-700 hover:bg-slate-800/30'
                      }`}
                    >
                      <span className="relative block w-[150px] shrink-0 aspect-video overflow-hidden rounded-lg bg-slate-800">
                        <span
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${video.image})` }}
                        />
                        <span className="absolute inset-0 bg-black/40 grid place-items-center">
                          <Play size={20} className="text-violet-400 fill-violet-400" />
                        </span>
                      </span>
                      <span className="flex flex-col justify-center min-w-0 px-4 py-3">
                        <span className="text-[15px] font-bold text-slate-100 leading-snug line-clamp-3 break-words">
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
              aria-label="Tutup video"
              className="absolute -top-12 right-0 w-10 h-10 grid place-items-center rounded-full bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
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