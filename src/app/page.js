import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import SearchFilter from '@/components/landing/SearchFilter';
import FeaturedConcerts from '@/components/landing/FeaturedConcerts';
import UpcomingConcerts from '@/components/landing/UpcomingConcerts';
import PopularArtists from '@/components/landing/PopularArtists';
import CategoriesSection from '@/components/landing/CategoriesSection';
import MobileAppPreview from '@/components/landing/MobileAppPreview';
import FAQ from '@/components/landing/FAQ';
import Sponsor from '@/components/landing/Sponsor';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SearchFilter />
      <FeaturedConcerts />
      <UpcomingConcerts />
      <PopularArtists />
      <CategoriesSection />
      <MobileAppPreview />
      <FAQ />
      <Sponsor />
      <Footer />
    </main>
  );
}
