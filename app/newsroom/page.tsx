import type { Metadata } from 'next';
import Image from 'next/image';
import { NewsContainer } from '@/components/news-container';
import { getCachedNews } from '@/lib/cache';

export const metadata: Metadata = {
  title: 'News',
  description: 'Changeling VR News',
};

export default async function News() {
  const { data } = await getCachedNews();

  if (!data) {
    return (
      <div className="flex h-svh flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Unable to fetch news</h1>
        <p className="mt-2 text-sm">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Banner */}
      <div className="relative mb-4 h-[25svh] w-full md:h-[30svh]">
        <Image src="/BannerImage.png" alt="Banner" fill className="object-cover brightness-75" />
        <h1 className="text-light-mustard absolute bottom-4 left-4 text-2xl font-bold uppercase md:text-4xl">
          News
        </h1>
      </div>

      {/* News container */}
      <div className="container mx-auto mb-4 flex flex-row flex-wrap justify-center gap-6 p-4">
        {[...data].reverse().map((news) => (
          <NewsContainer key={news.id} news={news} />
        ))}
      </div>
    </div>
  );
}
