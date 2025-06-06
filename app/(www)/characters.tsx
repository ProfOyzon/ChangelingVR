'use client';

import { memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useCharacterRotation } from '@/hooks/useCharacterRotation';
import type { Character } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

type CharacterItemProps = {
  character: Character;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
};

// Components
const CharacterItem = memo(function CharacterItem({
  character,
  index,
  isSelected,
  onSelect,
}: CharacterItemProps) {
  const handleClick = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  return (
    <div
      onClick={handleClick}
      role="button"
      aria-label={`Select ${character.name}`}
      className={cn(
        'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-transform duration-300 md:h-12 md:w-12',
        isSelected ? 'bg-steel ring-deep-orange scale-105 ring-2' : 'bg-gray-200 hover:bg-gray-300',
      )}
    >
      <Image
        src={character.icon_url ?? ''}
        alt={character.name}
        width={48}
        height={48}
        className="h-full w-full rounded-full object-cover"
      />
    </div>
  );
});

// Main Component
export const Characters = memo(function Characters({ characters }: { characters: Character[] }) {
  const { selectedCharacter, setSelectedCharacter } = useCharacterRotation(characters);

  // Memoized Values
  const characterList = useMemo(
    () =>
      characters.map((character, index) => (
        <CharacterItem
          key={character.name}
          character={character}
          index={index}
          isSelected={selectedCharacter === index}
          onSelect={setSelectedCharacter}
        />
      )),
    [characters, selectedCharacter, setSelectedCharacter],
  );

  const selectedCharacterDetails = useMemo(() => {
    const character = characters[selectedCharacter];
    if (!character) return { name: 'Loading...', detail: 'No details available' };

    return {
      name: character.name,
      detail: character.detail ? character.detail : 'No details available',
    };
  }, [characters, selectedCharacter]);

  // Render
  return (
    <div className="mb-4">
      <div className="my-4 flex flex-row flex-wrap gap-3 md:gap-4">{characterList}</div>
      <div className="transition-opacity duration-300">
        <h3 className="mb-2 text-2xl font-bold">{selectedCharacterDetails.name}</h3>
        <p className="line-clamp-2 text-base">{selectedCharacterDetails.detail}</p>
      </div>
    </div>
  );
});
