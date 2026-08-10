import { createRequire } from 'node:module';
import { expect, test } from '@playwright/test';

const require = createRequire(import.meta.url);
const characters = require('@/lib/data/characters.json');
const promos = require('@/lib/data/promos.json');

test.describe('lib/data integrity - characters.json', () => {
  test('is a non-empty array', () => {
    expect(Array.isArray(characters)).toBe(true);
    expect(characters.length).toBeGreaterThan(0);
  });

  test('each character has valid mandatory properties', () => {
    for (const char of characters) {
      expect(typeof char.id).toBe('string');
      expect(char.id.length).toBeGreaterThan(0);

      expect(typeof char.name).toBe('string');
      expect(char.name.length).toBeGreaterThan(0);

      expect(typeof char.role).toBe('string');
      expect(char.role.length).toBeGreaterThan(0);

      expect(typeof char.about).toBe('string');
      expect(char.about.length).toBeGreaterThan(0);
      expect(typeof char.bio).toBe('string');
      expect(char.bio.length).toBeGreaterThan(0);

      expect(typeof char.image).toBe('string');
      expect(char.image).toMatch(/\.(svg|png|webp|jpg)$/);

      expect(Array.isArray(char.personality)).toBe(true);
      expect(Array.isArray(char.hobby)).toBe(true);
      expect(Array.isArray(char.prop)).toBe(true);

      for (const values of [char.personality, char.hobby, char.prop]) {
        expect(
          values.every((value: unknown) => typeof value === 'string' && value.length > 0),
        ).toBe(true);
      }
    }
  });

  test('contains unique character IDs', () => {
    const ids = characters.map((c: { id: string }) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

test.describe('lib/data integrity - promos.json', () => {
  test('is a non-empty array', () => {
    expect(Array.isArray(promos)).toBe(true);
    expect(promos.length).toBeGreaterThan(0);
  });

  test('each promo has valid title, description, image, and alt text', () => {
    for (const promo of promos) {
      expect(typeof promo.title).toBe('string');
      expect(promo.title.length).toBeGreaterThan(0);

      expect(typeof promo.description).toBe('string');
      expect(promo.description.length).toBeGreaterThan(0);

      expect(typeof promo.image).toBe('string');
      expect(promo.image.startsWith('/')).toBe(true);

      expect(typeof promo.alt).toBe('string');
      expect(promo.alt.length).toBeGreaterThan(0);
    }
  });
});
