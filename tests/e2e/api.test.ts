import { expect, test } from '@playwright/test';

test.describe('API Routes (/api)', () => {
  test('GET /api', async ({ request }) => {
    const response = await request.get('/api');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({
      message: 'Welcome to ChangelingVR API',
      endpoints: [
        { method: 'GET', path: '/characters' },
        { method: 'GET', path: '/devs' },
      ],
    });
  });

  test('GET /api/characters', async ({ request }) => {
    const response = await request.get('/api/characters');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
      ]),
    );
  });
});
