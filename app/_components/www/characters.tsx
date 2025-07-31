import { Suspense } from 'react';
import Image from 'next/image';
import { Button } from '@/components/button';
import LivingRoomWatercolor from '@/public/background/living_room_watercolor.png';
import { CharacterOverview } from './characters-overview';

function CharacterSkeleton() {
  return (
    <div className="mb-4 animate-pulse">
      <div className="my-4 flex flex-row flex-wrap gap-3 md:gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-10 rounded-full bg-gray-700 md:h-12 md:w-12" />
        ))}
      </div>
      <div className="mb-2 h-6 w-1/4 rounded-md bg-gray-700" />
      <div className="h-4 w-3/4 rounded-md bg-gray-700" />
    </div>
  );
}

export function CharactersSection() {
  return (
    <section className="bg-light-mustard text-midnight p-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 md:flex-row">
        <figure className="w-full">
          <Image
            src={LivingRoomWatercolor}
            alt="Living room watercolor background"
            className="h-auto w-full rounded-md object-cover"
          />
        </figure>

        <div className="flex w-full flex-col items-start justify-between">
          <h2 className="text-2xl font-semibold uppercase md:text-3xl">The Cast</h2>

          <Suspense fallback={<CharacterSkeleton />}>
            <CharacterOverview />
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
    </section>
  );
}
