import { notFound } from 'next/navigation';
import { findPost } from '@/app/newsroom/find-post';
import { getCachedPosts } from '@/lib/cache';
import type { Post } from '@/types';

export default async function Posts({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const { data } = (await getCachedPosts()) as { data: Post[] };

  const posts = findPost({ data, year, month });
  if (!posts || !Array.isArray(posts)) return notFound();

  // TODO: same as posts/page.tsx, but with the posts filtered by year and month
  return (
    <div className="max-w-7xl mx-auto p-6 min-h-svh">
      <div className="h-16" aria-hidden="true"></div>
      <h1 className="text-3xl font-bold mb-8">
        Posts for {year}/{month}
      </h1>
    </div>
  );
}
