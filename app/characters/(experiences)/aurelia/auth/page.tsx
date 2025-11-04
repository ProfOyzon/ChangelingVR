import { Suspense } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import AuthClientPage from './page.client';

export const metadata: Metadata = {
  title: 'dreamCAPTCHA',
  description: 'Are you human?',
};

export default async function AuthPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('x-session-token')?.value;
  if (token) redirect('/characters/aurelia');

  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center p-6">
      <div className="flex w-sm flex-row items-center justify-between gap-4 rounded-md bg-gray-100 p-4 text-black">
        <Suspense fallback={<div>Loading...</div>}>
          <AuthClientPage />
        </Suspense>

        <div className="flex flex-col items-center justify-center gap-1">
          <Image
            src="/media/experiences/aurelia/dreamCAPTCHA.svg"
            alt="CAPTCHA"
            width={50}
            height={50}
            className="size-18"
          />
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs">dreamCAPTCHA</span>
            <div className="flex flex-row items-center justify-center gap-1 text-[0.5rem]">
              <span>Privacy</span>
              <span>-</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
