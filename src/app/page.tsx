import type { Metadata } from 'next';
import { Bricolage_Grotesque, Spline_Sans } from 'next/font/google';
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

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const spline = Spline_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-spline',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tixo — Beli tiket konser di app, atau jual tiket acaramu',
  description:
    'Tixo menaruhmu di barisan depan. Beli tiket konser resmi lewat app, atau jadi organizer dan jual tiket acaramu ke ribuan penonton.',
};

export default function HomePage() {
  return (
    <MotionProvider>
    <div className={`${bricolage.variable} ${spline.variable} min-h-screen bg-ink font-body text-white selection:bg-blaze selection:text-ink`}>
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
