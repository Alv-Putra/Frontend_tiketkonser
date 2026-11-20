import { Bricolage_Grotesque, Spline_Sans } from 'next/font/google';

// Font brand Tixo (landing & login admin).
export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

export const spline = Spline_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-spline',
  display: 'swap',
});

export const brandFonts = `${bricolage.variable} ${spline.variable}`;
