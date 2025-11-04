import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Lato } from 'next/font/google';
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
  metadataBase: new URL('https://changelingvr.vercel.app'),
  openGraph: {
    title: 'Changeling VR - A Narrative Mystery',
    description:
      'Changeling VR, a narrative mystery game by students in the school of interactive games and media.',
    siteName: 'Changeling VR',
    url: 'https://changelingvr.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changeling VR - A Narrative Mystery',
    description:
      'Changeling VR, a narrative mystery game by students in the school of interactive games and media.',
  },
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
    <html lang="en" className={`${latoSans.className} antialiased`} suppressHydrationWarning>
      <body className="bg-midnight w-screen overflow-x-hidden text-gray-100">
        <Header />
        <div className="h-16" aria-hidden="true"></div>
        <main className="min-h-[calc(100svh-4rem)] w-full items-center">{children}</main>
        <Footer />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
