import { Button } from '@/components/button';
import { getCachedPosts } from '@/lib/cache';
import { NewsContainer } from './news-container';

export async function NewsSection() {
  const { data: news } = await getCachedPosts();

  return (
    <div className="my-5 p-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <h1 className="mb-6 text-3xl font-bold uppercase md:text-5xl">The Latest</h1>

        <div className="mb-6 flex flex-col justify-evenly gap-6 text-gray-100 md:flex-row">
          {news?.slice(0, 3).map((item) => (
            <NewsContainer key={item.id} news={item} />
          ))}
        </div>

        <Button href="/newsroom" aria-label="View all news" className="max-md:w-full">
          View All
        </Button>
      </div>
    </div>
  );
}
