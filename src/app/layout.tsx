import './globals.css';
import { PT_Sans } from 'next/font/google';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const ptSans = PT_Sans({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-pt-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Tixo — Tiket konser favoritmu',
  description: 'Beli tiket konser resmi lewat app Tixo, atau jadi organizer dan jual tiket acaramu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${ptSans.variable} min-h-screen flex flex-col bg-[#09090B] text-[#FFFFFF] font-sans antialiased`}
      >
        <ErrorBoundary>
          <div className="flex-1 flex flex-col min-h-0">{children}</div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
