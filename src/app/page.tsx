import type { Metadata } from 'next';
import LandingView from '@/components/landing/LandingView';

export const metadata: Metadata = {
  title: 'Tixo — Beli tiket konser di app, atau jual tiket acaramu',
  description:
    'Tixo menaruhmu di barisan depan. Beli tiket konser resmi lewat app, atau jadi organizer dan jual tiket acaramu ke ribuan penonton.',
};

export default function HomePage() {
  return <LandingView />;
}
