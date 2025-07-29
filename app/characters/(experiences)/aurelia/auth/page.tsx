import type { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import './auth.css';

export const metadata: Metadata = {
  title: 'Auth',
};

export default function AureliaAuth() {
  return (
    <>
      <header>
        <h1 id="authH1">One Touch Investigations</h1>
        <p>Private Investigation - Memory Recovery - Magical Expertise</p>
      </header>
      <section id="captcha">
        <div className="spinner">
          <label>
            <input id="checkbox" type="checkbox">
              {' '}
            </input>
            <span className="checkmark">
              <span>&nbsp;</span>
            </span>
          </label>
        </div>
        <p id="checkText">I&apos;m not a demon</p>
        <div id="dcLogo">
          <Image
            id="catcher"
            src="/assets/images/experiences/aurelia/dreamCAPTCHA.svg"
            alt="CAPTCHA"
            width={200}
            height={200}
          />
          <p>
            <b>dreamCAPTCHA</b>
          </p>
        </div>
      </section>

      <Script type="module" src="/scripts/auth/index.js" strategy="afterInteractive" />
    </>
  );
}
