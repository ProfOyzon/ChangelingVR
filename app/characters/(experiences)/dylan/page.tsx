import type { Metadata } from 'next';
import Script from 'next/script';
import "./dylan.css";

export const metadata: Metadata = {
  title: 'Dylan',
};

export default function Dylan() {
  return (
    <>
      <div id="app"></div>
		  <div id="wrapper"></div>    

      <Script type="module" src="/scripts/dylan/index.js" strategy="afterInteractive" />
    </>
  );
}
