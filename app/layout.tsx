import type { Metadata, Viewport } from 'next';
import { Lato } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import './globals.css';

const latoSans = Lato({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Changeling VR',
    default: 'Changeling VR - A Narrative Mystery',
  },
  description:
    'Changeling VR, a narrative mystery game by students in the school of interactive games and media.',
  keywords: ['changeling', 'vr', 'game', 'narrative', 'mystery', 'interactive', 'games', 'media'],
};

export const viewport: Viewport = {
  themeColor: '#313131',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${latoSans.className} bg-midnight min-w-svw text-gray-100 antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
