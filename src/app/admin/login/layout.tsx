import type { Metadata } from 'next';
import { brandFonts } from '@/app/fonts';

export const metadata: Metadata = {
  title: 'Backstage — Login Admin Tixo',
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${brandFonts} font-body`}>{children}</div>;
}
