import Image from 'next/image';
import { Button } from '@/components/button';

type Character = {
  id: string;
  name: string;
  role: string;
  age: string | number;
  height: string;
  nationality: string;
  bio: string;
  image: string;
  personality: string[];
  hobby: string[];
  prop: string[];
};

const CHARACTER_ATTRIBUTES = [
  { key: 'age', label: 'Age' },
  { key: 'height', label: 'Height' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'personality', label: 'Personality' },
  { key: 'hobby', label: 'Hobbies' },
] as const;

export function CharacterSection({ character }: { character: Character }) {
  return (
    <>
      <div className="flex w-full items-center justify-center md:w-1/2">
        <Image
          src={`/media/characters/${character.image}`}
          alt={`${character.name}'s portrait`}
          width={320}
          height={320}
          className="object-contain max-md:size-64"
        />
      </div>

      <div className="flex h-auto w-full md:w-1/2 md:items-center md:justify-center">
        <div className="bg-steel/30 border-steel/40 w-full max-w-xl space-y-4 rounded-md border p-6 shadow-lg backdrop-blur-sm">
          <h1 className="text-2xl font-bold tracking-tight md:text-4xl">{character.name}</h1>

          <ul className="space-y-0.5 text-xs md:text-sm">
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

          <p className="text-sm leading-relaxed text-gray-200 md:text-base">{character.bio}</p>

          <Button
            href={`/characters/${character.id}`}
            aria-label={`Enter ${character.name}'s experience`}
            className="w-full"
          >
            Enter Experience
          </Button>
        </div>
      </div>
    </>
  );
}
