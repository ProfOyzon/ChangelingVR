import type { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Auth',
};

export default function AureliaAuth() {
  return (
    <>
      <header className="mx-auto flex max-w-fit flex-col items-center justify-center text-white">
        <h1 className="font-victoria mb-0 text-[42pt] font-medium">One Touch Investigations</h1>
        <p className="font-victoria mt-2 text-[13pt] font-medium">
          Private Investigation - Memory Recovery - Magical Expertise
        </p>
      </header>

      <section
        id="captcha"
        className="mx-auto mt-20 flex h-[150px] w-[90%] max-w-[400px] flex-row items-center justify-center rounded-lg border border-gray-400 bg-white font-sans"
      >
        <div className="relative flex flex-[0_0_20%] items-center justify-center">
          <label className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded border-[2.5px] border-[#c3c3c3] bg-[#fcfcfc]">
            <input id="checkbox" type="checkbox" className="peer absolute -z-10 opacity-0" />
            <span className="peer-checked:animate-fadein relative h-5 w-3 rotate-45 opacity-0 peer-checked:opacity-100">
              <span className="peer-checked:animate-bottomslide absolute bottom-0 left-0 h-[3px] w-0 bg-[#029f56]"></span>
              <span className="peer-checked:animate-rightslide absolute right-0 bottom-0 h-0 w-[3px] bg-[#029f56]"></span>
            </span>
          </label>
        </div>

        <p
          id="checkText"
          className="m-0 mr-[10%] flex-[0_0_30%] text-center whitespace-nowrap text-black"
        >
          I'm not a demon
        </p>

        <div
          id="dcLogo"
          className="flex flex-[0_0_40%] flex-col items-center justify-center text-[#555]"
        >
          <Image
            id="catcher"
            src="/assets/images/experiences/aurelia/dreamCAPTCHA.svg"
            alt="CAPTCHA"
            width={110}
            height={110}
          />
          <p className="mt-1 mb-0 font-bold">dreamCAPTCHA</p>
        </div>
      </section>

      <Script type="module" src="/scripts/auth/index.js" strategy="afterInteractive" />
    </>
  );
}
