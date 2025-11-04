import Image from 'next/image';
import { BackgroundVideo } from '@/app/(.)/components/background-video';
import { CharactersSection } from '@/app/(.)/components/characters';
import { FinalCTASection } from '@/app/(.)/components/end-cta';
import { MarqueeComponent } from '@/app/(.)/components/marquee';
import { OverviewSection } from '@/app/(.)/components/overview';
import { PromoSection } from '@/app/(.)/components/promo-section';
import { Button } from '@/components/button';

export default async function Home() {
  'use cache';

  return (
    <>
      <div className="relative flex h-[86svh] w-full items-center justify-center text-center">
        <BackgroundVideo />

        <div className="relative z-5 mx-auto max-w-2xl px-4">
          <div className="px-8 brightness-110 drop-shadow-md">
            <Image
              src="/logo-with-name.svg"
              alt="Changeling VR Logo"
              width={800}
              height={200}
              priority
              className="mx-auto shrink-0"
              fetchPriority="high"
            />
          </div>

          <div className="flex flex-col items-center gap-2 px-8">
            <h1 className="text-2xl font-light italic drop-shadow-md md:text-3xl">
              A VR Narrative Mystery
            </h1>
            <p className="mb-6 text-sm drop-shadow-md md:text-base">
              An Original Production from the RIT School of Interactive Games and Media and College
              of Art and Design
            </p>

            <Button
              href="/download"
              aria-label="Download Changeling VR"
              className="text-midnight w-fit px-8 py-3 text-xl"
            >
              Play Now
            </Button>
          </div>
        </div>
      </div>

      <OverviewSection />
      <MarqueeComponent />
      <PromoSection />
      <CharactersSection />
      <FinalCTASection />
    </>
  );
}
