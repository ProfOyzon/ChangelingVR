import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { Person, WithContext } from 'schema-dts';
import charactersData from '@/lib/data/characters.json';

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
  const dylan = charactersData.find((c) => c.id === 'dylan')!;
  const jsonLd: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://changelingvr.com/characters/${dylan.id}`,
    name: dylan.name,
    url: `https://changelingvr.com/characters/${dylan.id}`,
    description: dylan.bio,
    image: `https://changelingvr.com/media/characters/${dylan.image}`,
    gender: 'Male',
    height: {
      '@type': 'QuantitativeValue',
      value: 180,
      unitCode: 'CMT',
    },
    spouse: {
      '@type': 'Person',
      '@id': 'https://changelingvr.com/characters/angela',
      name: 'Angela Summers',
      url: 'https://changelingvr.com/characters/angela',
    },
    children: [
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

      <div id="app" />
      <div id="wrapper" className="flex min-h-[calc(100dvh-4rem)] items-center justify-center" />

      <Script type="module" src="/scripts/dylan/index.js" strategy="afterInteractive" />
    </>
  );
}
