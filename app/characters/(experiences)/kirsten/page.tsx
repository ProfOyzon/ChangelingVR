import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Person, WithContext } from 'schema-dts';
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
  const kirsten = charactersData.find((c) => c.id === 'kirsten')!;
  const jsonLd: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://changelingvr.com/characters/${kirsten.id}`,
    name: kirsten.name,
    url: `https://changelingvr.com/characters/${kirsten.id}`,
    description: kirsten.bio,
    image: `https://changelingvr.com/media/characters/${kirsten.image}`,
    gender: 'Female',
    height: {
      '@type': 'QuantitativeValue',
      value: 94,
      unitCode: 'CMT',
    },
    parent: [
      {
        '@type': 'Person',
        '@id': 'https://changelingvr.com/characters/angela',
        name: 'Angela Summers',
        url: 'https://changelingvr.com/characters/angela',
      },
      {
        '@type': 'Person',
        '@id': 'https://changelingvr.com/characters/dylan',
        name: 'Dylan Monelo',
        url: 'https://changelingvr.com/characters/dylan',
      },
    ],
    siblings: [
      {
        '@type': 'Person',
        '@id': 'https://changelingvr.com/characters/douglas',
        name: 'Douglas Summers-Monelo',
        url: 'https://changelingvr.com/characters/douglas',
      },
      {
        '@type': 'Person',
        '@id': 'https://changelingvr.com/characters/tobi',
        name: 'Tobi Summers-Monelo',
        url: 'https://changelingvr.com/characters/tobi',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replaceAll('<', '\\u003c'),
        }}
      />

      <div className="flex min-h-[calc(100dvh-4rem)] w-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Placeholder Kirsten</h1>
      </div>
    </>
  );
}
