import "./globals.css";
import { Inter, Montserrat, Noto_Sans } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";

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
    <html lang="id" className="h-full">
      <body
        className={`${inter.variable} ${montserrat.variable} ${notoSans.variable} ${inter.className} min-h-full bg-primary-bg text-text-primary antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
