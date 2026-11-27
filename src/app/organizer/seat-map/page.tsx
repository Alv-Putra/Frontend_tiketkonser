import { Suspense } from 'react';
import OrganizerSeatMap from '@/components/organizer/OrganizerSeatMap';

export default function OrganizerSeatMapPage() {
  // useSearchParams (?event=) butuh Suspense agar halaman tetap bisa di-prerender.
  return <Suspense><OrganizerSeatMap /></Suspense>;
}
