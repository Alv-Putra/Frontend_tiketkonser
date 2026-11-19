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
  title: 'ConserId - Platform Tiket Konser & Festival Musik Resmi',
  description: 'Satu tiket. Seribu cerita. Temukan konser favoritmu, beli tiket resmi dengan mudah dan aman.',
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
