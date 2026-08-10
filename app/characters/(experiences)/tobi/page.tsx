import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { Person, WithContext } from 'schema-dts';
import charactersData from '@/lib/data/characters.json';

export async function generateMetadata(): Promise<Metadata> {
  const character = charactersData.find((c) => c.id === 'tobi');
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
  const tobi = charactersData.find((c) => c.id === 'tobi')!;
  const jsonLd: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://changelingvr.com/characters/${tobi.id}`,
    name: tobi.name,
    url: `https://changelingvr.com/characters/${tobi.id}`,
    description: tobi.bio,
    image: `https://changelingvr.com/media/characters/${tobi.image}`,
    gender: 'Female',
    height: {
      '@type': 'QuantitativeValue',
      value: 61,
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
        '@id': 'https://changelingvr.com/characters/kirsten',
        name: 'Kirsten Summers-Monelo',
        url: 'https://changelingvr.com/characters/kirsten',
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

      {/* Center experience */}
      <div className="flex min-h-[calc(100dvh-4rem)] w-full items-center justify-center">
        <div id="wrapper"></div>
      </div>

      {/* Script */}
      <Script type="module" src="/scripts/tobi/index.js" strategy="afterInteractive" />
    </>
  );
}
