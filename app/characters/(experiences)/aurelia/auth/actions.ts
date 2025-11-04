'use server';

import { cookies } from 'next/headers';

export async function setCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('x-session-token', token, {
    path: '/characters/aurelia',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 1 month
  });
}
