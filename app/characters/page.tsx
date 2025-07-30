import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CharacterSection } from '@/app/_components/characters/character-section';
import charactersData from '@/lib/data/characters.json';
import { cn } from '@/lib/utils';
import type { Character } from '@/types';

const characters = charactersData as Character[];

export const metadata: Metadata = {
  title: 'Characters',
  description: 'Meet the characters of Changeling',
};

export default async function Characters() {
  if (!characters?.length) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">No Characters Found</h1>
          <p className="text-gray-600">We couldn&apos;t find any characters at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-svh snap-y snap-mandatory overflow-y-scroll">
      <div
        className={cn(
          'absolute top-[10vh] left-0 z-10 flex flex-row gap-1 rounded-md bg-black/25 p-2 backdrop-blur-sm md:ml-6 md:flex-col',
          'max-md:left-1/2 max-md:w-[90%] max-md:-translate-x-1/2 max-md:justify-evenly',
          '[&>a>img]:h-10 [&>a>img]:w-10 [&>a>img]:object-contain',
        )}
      >
        {characters.map((character) => (
          <Link
            href={`#${character.id}`}
            key={character.id}
            className="hover:bg-mardi-grass/35 hover:text-light-mustard flex items-center gap-1 rounded-md p-2 transition-all duration-300 hover:scale-105"
          >
            <Image
              src={`/media/characters/${character.image}`}
              alt={`${character.name}'s icon`}
              width={40}
              height={40}
              loading="lazy"
              className="rounded-full"
            />
            <p className="max-md:hidden">{character.name.split(' ')[0]}</p>
          </Link>
        ))}
      </div>

      {characters.map((character) => (
        <section
          id={character.id}
          key={character.id}
          className="flex h-svh w-full snap-center flex-col items-center justify-end p-6 md:flex-row md:justify-center"
        >
          <CharacterSection character={character} />
        </section>
      ))}
    </div>
  );
}
