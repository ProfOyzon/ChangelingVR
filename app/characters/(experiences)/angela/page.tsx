import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { Person, WithContext } from 'schema-dts';
import charactersData from '@/lib/data/characters.json';
import './angela.css';

export async function generateMetadata(): Promise<Metadata> {
  const character = charactersData.find((c) => c.id === 'angela');
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

export default function Angela() {
  const angela = charactersData.find((c) => c.id === 'angela')!;
  const jsonLd: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://changelingvr.com/characters/${angela.id}`,
    name: angela.name,
    url: `https://changelingvr.com/characters/${angela.id}`,
    description: angela.bio,
    image: `https://changelingvr.com/media/characters/${angela.image}`,
    gender: 'Female',
    height: {
      '@type': 'QuantitativeValue',
      value: 173,
      unitCode: 'CMT',
    },
    spouse: {
      '@type': 'Person',
      '@id': 'https://changelingvr.com/characters/dylan',
      name: 'Dylan Monelo',
      url: 'https://changelingvr.com/characters/dylan',
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

      <div className="relative mx-auto flex w-fit flex-1 items-center justify-center">
        <button id="restartBtn" className="invisible">
          Start a New Day
          <br />
          ☀️
        </button>
        <button id="playBtn" className="invisible">
          Play
        </button>
        <button id="startDayBtn" className="invisible">
          Start my day
        </button>
        <button id="continueBtn" className="invisible">
          Click To Continue
        </button>
        <button id="skipBtn" className="invisible">
          Skip Intro
        </button>

        <canvas id="back"></canvas>

        <div className="vignettesDiv"></div>

        <p id="game-result">
          TIME NOW: <b className="currentTime">5:00 AM</b>
          <br />
          You completed <b className="goodComplete">0</b> good tasks and avoided{' '}
          <b className="badAvoid">0</b> bad tasks.
          <br />
          You missed <b className="goodMiss">0</b> good tasks and completed{' '}
          <b className="badComplete">0</b> bad tasks.
          <br />
          Your current high score is <b className="highScore">0</b> and your all time high score is{' '}
          <b className="allTimeHighScore">0</b>
        </p>
      </div>

      {/* Script */}
      <Script type="module" src="/scripts/angela/index.js" strategy="afterInteractive" />
    </>
  );
}
