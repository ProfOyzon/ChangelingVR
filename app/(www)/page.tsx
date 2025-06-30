import { Suspense } from 'react';
import { CharactersSection } from './_components/characters';
import { FinalCTASection } from './_components/end-cta';
import { HeroSection } from './_components/hero';
import { OverviewSection } from './_components/overview';
import { NewsSection } from './_components/posts';
import { PromoSection } from './_components/promo-section';

function NewsSkeleton() {
  return (
    <div className="my-5 p-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <h1 className="mb-6 text-3xl font-bold uppercase md:text-5xl">The Latest</h1>
        <div className="mb-6 flex flex-col justify-evenly gap-6 text-gray-100 md:flex-row">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 animate-pulse">
              <div className="h-48 w-full rounded-t-lg bg-gray-700"></div>
              <div className="p-4">
                <div className="mb-2 h-6 w-3/4 rounded-md bg-gray-700"></div>
                <div className="h-4 w-1/2 rounded-md bg-gray-700"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-12 w-32 rounded-md bg-gray-700"></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <OverviewSection />

      {/* Only suspense news since it fetches from db */}
      <Suspense fallback={<NewsSkeleton />}>
        <NewsSection />
      </Suspense>

      <PromoSection />
      <CharactersSection />
      <FinalCTASection />
    </>
  );
}
