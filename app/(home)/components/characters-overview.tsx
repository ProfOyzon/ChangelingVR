'use client';

import Image from 'next/image';
import charactersData from '@/lib/data/characters.json';
import { cn } from '@/lib/utils';
import { useCharacterRotation } from './use-character-rotation';

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

type CharacterItemProps = {
  character: Character;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
};

function CharacterItem({ character, index, isSelected, onSelect }: CharacterItemProps) {
  return (
    <button
      onClick={() => onSelect(index)}
      role="tab"
      aria-selected={isSelected}
      aria-controls={`character-panel-${index}`}
      id={`character-${index}`}
      aria-label={`Select ${character.name}`}
      className={cn(
        'flex size-10 cursor-pointer items-center justify-center rounded-full transition-transform duration-300 md:h-12 md:w-12',
        isSelected ? 'bg-steel ring-deep-orange scale-105 ring-2' : 'bg-gray-200 hover:bg-gray-300',
      )}
    >
      <Image
        src={`/media/characters/${character.image}`}
        alt={character.name}
        width={48}
        height={48}
        className="h-full w-auto rounded-full object-cover"
      />
    </button>
  );
}

export function CharacterOverview() {
  const { selectedCharacter, setSelectedCharacter } = useCharacterRotation(charactersData);
  const character = charactersData[selectedCharacter];

  return (
    <div className="space-y-4">
      <div
        className="flex flex-row flex-wrap gap-4"
        role="tablist"
        aria-label="Character selection"
      >
        {charactersData.map((character, index) => (
          <CharacterItem
            key={character.name}
            character={character}
            index={index}
            isSelected={selectedCharacter === index}
            onSelect={setSelectedCharacter}
          />
        ))}
      </div>
      <div
        id={`character-panel-${selectedCharacter}`}
        role="tabpanel"
        aria-labelledby={`character-${selectedCharacter}`}
        className="space-y-2 transition-opacity duration-300"
      >
        <h3 className="text-2xl font-semibold">{character?.name || 'Loading...'}</h3>
        <p className="line-clamp-2 min-h-12 text-base">
          {character?.bio || 'No details available'}
        </p>
      </div>
    </div>
  );
}
