import { Suspense } from 'react';
import Image from 'next/image';
import { CharacterSkeleton } from '@/app/(www)/character-skeleton';
import { Characters } from '@/app/(www)/characters';
import { NewsContainer } from '@/app/(www)/news-container';
import { PromoSection } from '@/app/(www)/promo-section';
import { Button } from '@/components/button';
import { getCachedPosts } from '@/lib/cache';
import aurelia from '@/public/aurelia.png';
import LivingRoomWatercolor from '@/public/background/living_room_watercolor.png';

export default async function Home() {
  const { data: news } = await getCachedPosts();

  return (
    <>
      {/* Hero Section - Above the fold content */}
      <div className="relative flex h-[88svh] w-full items-center justify-center text-center">
        <video
          className="absolute h-full w-full object-cover brightness-50"
          poster="/background/outside_blurred.webp"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/media/video/ChangelingTrailer2024.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="relative z-5 mx-auto max-w-2xl px-4">
          <div className="mb-4 px-8 brightness-110 drop-shadow-md">
            <Image
              src="/logo.svg"
              alt="Changeling VR Logo"
              width={800}
              height={200}
              priority
              className="mx-auto w-full"
              fetchPriority="high"
            />
          </div>

          <h3 className="mb-2 text-2xl font-light italic drop-shadow-md md:text-3xl">
            A VR Narrative Mystery
          </h3>
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
      </div>

      {/* Overview Section */}
      <div className="my-6 flex w-full flex-col-reverse justify-center rounded md:my-16 md:flex-row">
        <section className="flex w-full flex-col items-start justify-center max-md:p-6 max-md:pb-0 md:p-16 md:pr-0">
          <h1 className="mb-6 text-3xl font-bold text-white uppercase md:text-5xl">
            Remember who you are, for these memories are not yours.
          </h1>
          <p className="mb-6 text-base leading-relaxed text-gray-300 md:text-lg">
            Changeling VR is a first-person VR mystery where you play as detective Aurelia Walker, a
            private eye with the power to dream-walk — seeing the memories of anyone she touches.
            Explore interconnected levels with unique mechanics, immersive visuals, and rich
            storytelling. Uncover the truth through environmental interaction, puzzle-solving, and
            deep character encounters.
          </p>
          <Button
            href="https://youtu.be/B01VZdgthws"
            aria-label="Watch the Changeling VR trailer on YouTube"
            className="max-md:w-full"
          >
            Watch Trailer
          </Button>
        </section>

        <div className="w-full px-6 md:mask-l-from-50% md:p-0">
          <Image
            src="/BannerImage.png"
            alt="Wide shot of the family home"
            width={800}
            height={240}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="h-full w-full rounded object-cover"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* Latest News Section */}
      <div className="my-5 p-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center">
          <h1 className="mb-6 text-3xl font-bold uppercase md:text-5xl">The Latest</h1>

          <div className="mb-6 flex flex-col justify-evenly gap-6 text-gray-100 md:flex-row">
            {news?.slice(0, 3).map((item) => <NewsContainer key={item.id} news={item} />)}
          </div>

          <Button href="/newsroom" aria-label="View all news" className="max-md:w-full">
            View All
          </Button>
        </div>
      </div>

      <PromoSection />

      {/* Characters Section */}
      <div className="bg-light-mustard text-midnight p-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 md:flex-row">
          <div className="w-full">
            <Image
              src={LivingRoomWatercolor}
              alt="Living room watercolor background"
              className="h-auto w-full rounded object-cover"
            />
          </div>

          <div className="flex w-full flex-col items-start justify-between">
            <h3 className="text-2xl font-semibold uppercase md:text-3xl">The Cast</h3>

            <Suspense fallback={<CharacterSkeleton />}>
              <Characters />
            </Suspense>

            <Button
              href="/characters"
              aria-label="Navigate to characters page"
              variant="secondary"
              className="max-md:w-full"
            >
              View All
            </Button>
          </div>
        </div>
      </div>

      {/* Enter the Dream Section */}
      <div className="mx-auto flex w-full max-w-2xl flex-row items-center justify-center gap-2 px-6">
        <div className="pt-8">
          <Image src={aurelia} alt="Aurelia" className="h-80 w-auto" />
        </div>

        <div className="flex max-w-lg flex-1 flex-col items-start py-4">
          <span className="mb-2 text-2xl font-semibold md:text-4xl">Step Into the Mystery</span>

          <p className="mb-4 text-sm text-gray-300 md:text-base">
            Ready to uncover secrets and explore the unknown? Play Changeling VR now and begin your
            journey as Aurelia Walker.
          </p>

          <Button href="/download" className="w-full">
            Play Now
          </Button>
        </div>
      </div>
    </>
  );
}
