'use client';

import CustomerNavbar from './CustomerNavbar';
import CustomerFooter from './CustomerFooter';

export default function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-primary-bg">
      <CustomerNavbar />
      <main className="flex-1 pt-20">{children}</main>
      <CustomerFooter />
    </div>
  );
}