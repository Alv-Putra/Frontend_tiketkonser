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
    <main className="bg-ln-bg text-ln-text min-h-screen">
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