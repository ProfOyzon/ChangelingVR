import { Fragment } from 'react';
import Image from 'next/image';
import { Button } from '@/components/button';
import type { Character } from '@/types';

const CHARACTER_ATTRIBUTES = [
  { key: 'age', label: 'Age' },
  { key: 'height', label: 'Height' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'personality', label: 'Personality' },
  { key: 'hobby', label: 'Hobbies' },
] as const;

export function CharacterSection({ character }: { character: Character }) {
  return (
    <Fragment>
      <div className="hidden w-full items-center justify-center md:flex md:w-1/2">
        <Image
          src={`/media/characters/${character.image}`}
          alt={`${character.name}'s portrait`}
          width={320}
          height={320}
          className="object-contain"
        />
      </div>

      {Array.isArray(character.prop) && character.prop.length > 0 && (
        <div className="flex w-full items-center justify-center md:hidden">
          {character.prop.map((prop: string) => (
            <div key={prop} className="flex items-center justify-center">
              <Image
                src={`/media/characters/${prop}`}
                alt={prop}
                width={72}
                height={72}
                className="h-12 w-12 object-contain"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex h-auto w-full md:w-1/2 md:items-center md:justify-center">
        <div className="bg-steel/30 border-steel/40 w-full max-w-xl rounded-md border p-4 shadow-lg backdrop-blur-sm">
          <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">{character.name}</h1>

          <ul className="mb-4 space-y-0.5 text-xs md:text-sm">
            {CHARACTER_ATTRIBUTES.map(({ key, label }) => (
              <li key={key} className="flex items-center gap-2">
                <span className="font-semibold text-gray-100">{label}:</span>
                <span className="truncate text-gray-200">
                  {Array.isArray(character[key as keyof Character])
                    ? (character[key as keyof Character] as string[]).join(', ')
                    : character[key as keyof Character]}
                </span>
              </li>
            ))}
          </ul>

          <p className="mb-6 text-sm leading-relaxed text-gray-200 md:text-base">{character.bio}</p>

          <Button
            href={`/characters/${character.id}`}
            aria-label={`Enter ${character.name}'s experience`}
            className="mt-2 w-full"
          >
            Enter Experience
          </Button>
        </div>
      </div>
    </Fragment>
  );
}
