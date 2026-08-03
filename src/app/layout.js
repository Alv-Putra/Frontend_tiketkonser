import "./globals.css";

export const metadata = {
  title: "ConcertHub - Experience Live Music",
  description: "Temukan dan dapatkan tiket konser terbaik. Download aplikasi ConcertHub untuk pembelian tiket.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-primary-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
