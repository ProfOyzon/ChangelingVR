import Image from 'next/image';
import AuthClientPage from './page.client';

export default function AuthPage() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center p-6">
      <div className="flex w-sm flex-row items-center justify-between gap-4 rounded-md bg-gray-100 p-4 text-black">
        <AuthClientPage />

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
