import type { Metadata } from 'next';
import Head from 'next/head';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Tobi',
};

export default function TobiPage() {
  return (
    <>
      <Head>
        {/* Link style sheets */}
        <link rel="stylesheet" href="/styles/base.css" />
        <link rel="stylesheet" href="/styles/tobi.css" />
      </Head>

      <>
        {/* Center experience */}
        <div className="bg-midnight flex h-full w-full items-center justify-center">
          <div id="wrapper"></div>
        </div>

        {/* Script */}
        <Script type="module" src="/scripts/tobi/index.js" strategy="afterInteractive" />
      </>
    </>
  );
}
