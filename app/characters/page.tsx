import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CharacterSection } from '@/app/characters/character-section';
import charactersData from '@/lib/data/characters.json';
import { cn } from '@/lib/utils';
import { CharacterScroller } from './character-scroller';

export const metadata: Metadata = {
  title: 'Characters',
  description: 'Meet the characters of ChangelingVR',
};

export default async function Characters() {
  if (!charactersData?.length) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">No Characters Found</h1>
          <p className="text-gray-600">We couldn&apos;t find any characters at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="character-scroll"
      className="h-[calc(100dvh-4rem)] snap-y snap-mandatory overflow-y-auto"
    >
      <Suspense>
        <CharacterScroller />
      </Suspense>

      <div
        className={cn(
          'absolute top-[10vh] left-0 z-10 flex flex-row gap-1 rounded-md bg-black/25 p-2 backdrop-blur-sm md:ml-6 md:flex-col',
          'max-md:left-1/2 max-md:w-[90%] max-md:-translate-x-1/2 max-md:justify-evenly',
        )}
      >
        {charactersData.map((character) => (
          <Link
            key={character.id}
            href={`/characters?c=${character.id}`}
            className="hover:bg-mardi-grass/35 hover:text-light-mustard flex items-center gap-1 rounded-md p-2 transition-all duration-200 hover:scale-105"
          >
            <Image
              src={`/media/characters/${character.image}`}
              alt={`${character.name}'s icon`}
              width={40}
              height={40}
              loading="lazy"
              className="size-10 rounded-full object-contain"
            />
            <p className="max-md:hidden">{character.name.split(' ')[0]}</p>
          </Link>
        ))}
      </div>

      {charactersData.map((character) => (
        <section
          id={character.id}
          key={character.id}
          className="flex h-[calc(100dvh-4rem)] w-full snap-center flex-col items-center justify-end p-6 md:flex-row md:justify-center"
        >
          <CharacterSection character={character} />
        </section>
      ))}
    </div>
  );
}
