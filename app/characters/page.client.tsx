'use client';

import Image from 'next/image';
import { Button } from '@/components/button';
import { fetchSupabaseImage } from '@/lib/api';
import type { Character } from '@/types';
import { motion } from 'motion/react';

const CHARACTER_ATTRIBUTES = [
  { key: 'age', label: 'Age' },
  { key: 'height', label: 'Height' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'personality', label: 'Personality' },
  { key: 'hobbies', label: 'Hobbies' },
] as const;

export function CharacterClientPage({ characters }: { characters: Character[] }) {
  return (
    <>
      {characters.map((character) => (
        <section
          id={character.id}
          key={character.id}
          className="flex h-svh w-full snap-center flex-col items-center justify-end p-6 md:flex-row md:justify-center"
        >
          {/* Portrait */}
          <motion.div
            className="hidden w-full items-center justify-center md:flex md:w-1/2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <Image
              src={fetchSupabaseImage({
                container: 'characters',
                path: character.icon_url,
              })}
              alt={`${character.name}'s portrait`}
              width={320}
              height={320}
              className="object-contain"
            />
          </motion.div>

          {Array.isArray(character.props) && character.props.length > 0 && (
            <div className="flex w-full items-center justify-center md:hidden">
              {character.props.map((prop) => (
                <motion.div key={prop} className="flex items-center justify-center">
                  <Image
                    src={fetchSupabaseImage({
                      container: 'characters',
                      path: prop,
                    })}
                    alt={prop}
                    width={72}
                    height={72}
                    className="h-12 w-12 object-contain"
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Info Card */}
          <div className="flex h-auto w-full md:w-1/2 md:items-center md:justify-center">
            <div className="bg-steel/30 border-steel/40 w-full max-w-xl rounded border p-4 shadow-lg backdrop-blur-sm">
              <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
                {character.name}
              </h1>

              <ul className="mb-4 space-y-0.5 text-xs md:text-sm">
                {CHARACTER_ATTRIBUTES.map(({ key, label }) => (
                  <li key={key} className="flex items-center gap-2">
                    <span className="font-semibold text-gray-100">{label}:</span>
                    <span className="truncate text-gray-200">
                      {Array.isArray(character[key as keyof Character])
                        ? (character[key as keyof Character] as string[]).join(', ')
                        : character[key as keyof Character]}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mb-6 text-sm leading-relaxed text-gray-200 md:text-base">
                {character.detail}
              </p>

              <Button
                href={`/characters/${character.id}`}
                aria-label={`Enter ${character.name}'s experience`}
                className="mt-2 w-full"
              >
                Enter Experience
              </Button>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
