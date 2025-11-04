import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import charactersData from '@/lib/data/characters.json';

export async function generateMetadata(): Promise<Metadata> {
  const character = charactersData.find((c) => c.id === 'kirsten');
  if (!character) return notFound();

  return {
    title: character.name,
    description: character.bio,
    openGraph: {
      title: character.name,
      description: character.bio,
    },
    twitter: {
      card: 'summary',
      title: character.name,
      description: character.bio,
    },
  };
}

export default function Kirsten() {
  return (
    <div className="text-midnight flex h-screen w-screen flex-col items-center justify-center">
      <h1>Placeholder Kirsten</h1>
    </div>
  );
}
