'use client';

import { useEffect } from 'react';
import { brandFonts } from '@/app/fonts';
import MotionProvider from '@/components/landing/MotionProvider';
import LandingNav from '@/components/landing/LandingNav';
import Hero from '@/components/landing/Hero';
import LineupSection from '@/components/landing/LineupSection';
import Manifesto from '@/components/landing/Manifesto';
import TapeMarquee from '@/components/landing/TapeMarquee';
import ChooseSide from '@/components/landing/ChooseSide';
import EventStubs from '@/components/landing/EventStubs';
import AudienceSection from '@/components/landing/AudienceSection';
import OrganizerSection from '@/components/landing/OrganizerSection';
import FinalCta from '@/components/landing/FinalCta';
import LandingFooter from '@/components/landing/LandingFooter';
import { useThemeStore } from '@/stores/themeStore';

export default function LandingView() {
  const landingTheme = useThemeStore((state) => state.landingTheme);
  const initThemes = useThemeStore((state) => state.initThemes);

  useEffect(() => {
    initThemes();
  }, [initThemes]);

  const isLight = landingTheme === 'light';

  return (
    <MotionProvider>
      <div
        data-theme={landingTheme}
        className={`${brandFonts} landing-root min-h-screen font-body transition-colors duration-300 selection:bg-blaze selection:text-ink ${
          isLight ? 'bg-[#FAF7F2] text-ink' : 'bg-ink text-white'
        }`}
      >
        <LandingNav />
        <main>
          <Hero />
          <TapeMarquee />
          <Manifesto />
          <ChooseSide />
          <EventStubs />
          <LineupSection />
          <AudienceSection />
          <OrganizerSection />
          <FinalCta />
        </main>
        <LandingFooter />
      </div>
    </MotionProvider>
  );
}
