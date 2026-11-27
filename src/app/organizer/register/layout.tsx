import type { Metadata } from 'next';
import { brandFonts } from '@/app/fonts';

export const metadata: Metadata = {
  title: 'Daftar Organizer Tixo',
};

export default function OrganizerRegisterLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${brandFonts} font-body`}>{children}</div>;
}
