import { Suspense } from 'react';
import OrganizerTicketManager from '@/components/organizer/OrganizerTicketManager';

export default function OrganizerCategoriesPage() {
  // useSearchParams (?event=) butuh Suspense agar halaman tetap bisa di-prerender.
  return <Suspense><OrganizerTicketManager /></Suspense>;
}
