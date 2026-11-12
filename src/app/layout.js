import "./globals.css";
import { Inter, Montserrat, Noto_Sans } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-noto",
});

export const metadata = {
  title: "ConserId - Experience Live Music",
  description: "Temukan dan dapatkan tiket konser terbaik. Download aplikasi ConserId untuk pembelian tiket.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${montserrat.variable} ${notoSans.variable} ${inter.className} min-h-screen flex flex-col bg-primary-bg text-text-primary antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <div className="flex-1 flex flex-col min-h-0">{children}</div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
