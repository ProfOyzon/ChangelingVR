import { Suspense } from 'react';
import Image from 'next/image';
import { Button } from '@/components/button';
import LivingRoomWatercolor from '@/public/media/background/living_room_watercolor.png';
import { CharacterOverview } from './characters-overview';

export function CharactersSection() {
  return (
    <section className="bg-light-mustard text-midnight p-6">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 md:flex-row">
        <figure className="w-full">
          <Image
            src={LivingRoomWatercolor}
            alt="Living room watercolor background"
            className="h-auto w-full rounded-md object-cover"
          />
        </figure>

        <div className="flex w-full flex-col items-start justify-between gap-6">
          <h2 className="text-3xl font-bold uppercase md:text-5xl">The Cast</h2>

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

function CharacterSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex flex-row flex-wrap gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="size-10 rounded-full bg-gray-700 md:h-12 md:w-12" />
        ))}
      </div>
      <div className="mb-2 h-6 w-1/4 rounded-md bg-gray-700" />
      <div className="h-4 w-3/4 rounded-md bg-gray-700" />
    </div>
  );
}
