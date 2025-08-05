import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import charactersData from '@/lib/data/characters.json';
import type { Character } from '@/types';
import AureliaClientPage from './page.client';

const sidebarContactInfo = [
  {
    icon: '/media/experiences/aurelia/phoneIcon.png',
    label: 'Phone',
    value: '555-824-2345',
  },
  {
    icon: '/media/experiences/aurelia/homeIcon.png',
    label: 'Address',
    value: '123 Fake Loc\nNew York, NY\n1234-5678',
  },
  {
    icon: '/media/experiences/aurelia/mailIcon.png',
    label: 'Email',
    value: 'Awalker@dreams.com',
  },
  {
    icon: '/media/experiences/aurelia/scryglass.png',
    label: 'Scryglass',
    value: '🜀 - 🜚 - 🝒 - 🜛 - 🝆 - 🜾',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const character = (charactersData as Character[]).find((c) => c.id === 'aurelia');
  if (!character) return notFound();

  return {
    title: character.name,
    description: character.bio,
    openGraph: {
      title: character.name,
      description: character.bio,
      images: [
        {
          url: `https://changelingvr.vercel.app/media/characters/${character.image}`,
          width: 512,
          height: 512,
          alt: character.name,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: character.name,
      description: character.bio,
      images: [
        {
          url: `https://changelingvr.vercel.app/media/characters/${character.image}`,
          width: 512,
          height: 512,
          alt: character.name,
        },
      ],
    },
  };
}

export default async function Aurelia({ searchParams }: { searchParams: Promise<{ t: string }> }) {
  const token = (await searchParams).t;
  if (!token) redirect('/characters/aurelia/auth');

  return (
    <div className="flex flex-row bg-[#171a21]">
      <div className="hidden h-[calc(100svh-4rem)] w-64 flex-col justify-start gap-4 border-r-4 border-[saddlebrown] p-4 md:flex">
        <Image
          src="/media/experiences/aurelia/pfp.png"
          alt="Logo"
          width={100}
          height={160}
          className="h-56 w-auto self-center"
        />

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold underline">My Abilities</h2>
          <p className="text-sm">
            I am specialized in dealing with mind altering or otherwise psychological effects and
            creatures, but I can also diagnose most magical disturbances and refer you to an expert
            when physical force is required.
            <br />
            <br />
            In addition to my expertise, I also possess the ability to enter the minds of my clients
            when physical contact is made, allowing me to screen for any magical influnces directly.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold underline">Contact Information</h2>
          {sidebarContactInfo.map((info) => (
            <div key={info.label} className="flex flex-row items-center justify-start gap-2">
              <Image
                src={info.icon}
                alt={info.label}
                width={12}
                height={12}
                className="h-auto w-4"
              />
              <p className="text-sm whitespace-pre-line">{info.value}</p>
            </div>
          ))}
        </section>
      </div>

      <div className="flex w-full flex-col">
        <div className="flex flex-col gap-2 p-4 md:gap-4">
          <h1 className="text-3xl font-bold md:text-5xl">One Touch Investigations</h1>
          <p className="text-lg md:text-2xl">
            Private Investigation - Magical Expertise - Memory Recovery
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <AureliaClientPage />
        </Suspense>
      </div>
    </div>
  );
}
