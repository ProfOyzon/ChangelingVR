import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import charactersData from '@/lib/data/characters.json';
import './dylan.css';

export async function generateMetadata(): Promise<Metadata> {
  const character = charactersData.find((c) => c.id === 'dylan');
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

export default function Dylan() {
  return (
    <>
      <div id="app"></div>
      <div id="wrapper"></div>

      <Script type="module" src="/scripts/dylan/index.js" strategy="afterInteractive" />
    </>
  );
}
