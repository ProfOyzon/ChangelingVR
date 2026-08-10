import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Lato } from 'next/font/google';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { OfflineBanner } from '@/components/offline-banner';
import './globals.css';

const latoSans = Lato({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | ChangelingVR',
    default: 'ChangelingVR - A Narrative Mystery',
  },
  description:
    'ChangelingVR, a narrative mystery game by students in the school of interactive games and media.',
  keywords: ['changeling', 'vr', 'game', 'narrative', 'mystery', 'interactive', 'games', 'media'],
  metadataBase: new URL('https://changelingvr.vercel.app'),
  openGraph: {
    title: 'ChangelingVR - A Narrative Mystery',
    description:
      'ChangelingVR, a narrative mystery game by students in the school of interactive games and media.',
    siteName: 'ChangelingVR',
    url: 'https://changelingvr.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChangelingVR - A Narrative Mystery',
    description:
      'ChangelingVR, a narrative mystery game by students in the school of interactive games and media.',
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
    <html lang="en" suppressHydrationWarning className={`${latoSans.className} antialiased`}>
      <body className="bg-midnight min-dvh flex flex-col overflow-x-hidden text-gray-100">
        <Header />
        <div className="h-16 shrink-0" />
        <main className="min-h-0 flex-1">{children}</main>
        <Footer />

        <OfflineBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
