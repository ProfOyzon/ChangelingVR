import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import charactersData from '@/lib/data/characters.json';
import type { Character } from '@/types';

export async function generateMetadata(): Promise<Metadata> {
  const character = (charactersData as Character[]).find((c) => c.id === 'kirsten');
  if (!character) return notFound();

  return {
    title: character.name,
    description: character.bio,
  };
}

export default function Kirsten() {
  return (
    <div className="text-midnight flex h-screen w-screen flex-col items-center justify-center">
      <h1>Placeholder Kirsten</h1>
    </div>
  );
}
