import Image from 'next/image';
import { Button } from '@/app/_components/button';
import { BackgroundVideo } from './background-video';

export function HeroSection() {
  return (
    <section className="relative flex h-[86svh] w-full items-center justify-center text-center">
      <BackgroundVideo />

      <div className="relative z-5 mx-auto max-w-2xl px-4">
        <div className="px-8 brightness-110 drop-shadow-md">
          <Image
            src="/logo-with-name.svg"
            alt="Changeling VR Logo"
            width={800}
            height={200}
            priority
            className="mx-auto w-full shrink-0"
            fetchPriority="high"
          />
        </div>

        <h1 className="mb-2 text-2xl font-light italic drop-shadow-md md:text-3xl">
          A VR Narrative Mystery
        </h1>
        <p className="mb-8 px-8 text-sm drop-shadow-md/100 md:text-base">
          An Original Production from the RIT School of Interactive Games and Media and College of
          Art and Design
        </p>

        <div className="flex justify-center">
          <Button
            href="/download"
            aria-label="Download Changeling VR"
            className="text-midnight px-8 py-3 text-xl"
          >
            Play Now
          </Button>
        </div>
      </div>
    </section>
  );
}
