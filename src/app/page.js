import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Marquee from '@/components/livenation/Marquee';
import FindEventsSection from '@/components/livenation/FindEventsSection';
import Watching from '@/components/livenation/Watching';
import LastCall from '@/components/livenation/LastCall';
import FirstToKnow from '@/components/livenation/FirstToKnow';
import Footer from '@/components/livenation/Footer';

export default function Home() {
  return (
    <main className="flex-1 bg-[#0B0F19] text-slate-50 min-h-screen">
      <Navbar />
      <Hero />
      <Marquee />
      <FindEventsSection />
      <Watching />
      <LastCall />
      <FirstToKnow />
      <Footer />
    </main>
  );
}
