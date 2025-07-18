import { Fragment } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Tobi',
  description: 'Find out what Tobi holds dear.',
};

export default function TobiPage() {
  return (
    <Fragment>
      {/* Center experience */}
      <div className="bg-midnight flex h-full w-full items-center justify-center">
        <div id="wrapper"></div>
      </div>

      {/* Script */}
      <Script type="module" src="/scripts/tobi/index.js" strategy="afterInteractive" />
    </Fragment>
  );
}
