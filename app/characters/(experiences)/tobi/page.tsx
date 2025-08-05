import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import charactersData from '@/lib/data/characters.json';
import type { Character } from '@/types';

export async function generateMetadata(): Promise<Metadata> {
  const character = (charactersData as Character[]).find((c) => c.id === 'tobi');
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

export default function TobiPage() {
  return (
    <Fragment>
      {/* Center experience */}
      <div className="bg-midnight flex h-full w-full items-center justify-center">
        <div id="wrapper"></div>
      </div>

      {/* Script */}
      <Script type="module" src="/scripts/tobi/index.js" strategy="afterInteractive" />
    </Fragment>
  );
}
