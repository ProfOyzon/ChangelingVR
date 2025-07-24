'use server';

import { cookies } from 'next/headers';
import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const key = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return await hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return await compare(password, hash);
}

type SessionData = {
  user: { id: string };
  expires: string;
};

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 day from now')
    .sign(key);
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as SessionData;
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  return await verifyToken(session);
}

export async function setSession(uuid: string) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: { id: uuid },
    expires: expiresInOneDay.toISOString(),
  };
  const encryptedSession = await signToken(session);
  (await cookies()).set('session', encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresInOneDay,
  });
}
