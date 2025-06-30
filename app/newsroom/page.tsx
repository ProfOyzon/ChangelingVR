import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCachedPosts } from '@/lib/cache';

export default async function Posts() {
  const { data } = await getCachedPosts();
  if (!data) return notFound();

  // Get the first 3 posts as featured posts
  const featuredPost = data.slice(0, 3);
  const otherPosts = data.slice(3);

  return (
    <div className="mx-auto min-h-svh max-w-7xl p-6">
      <h1 className="my-8 text-4xl font-bold">Newsroom</h1>

      {/* Featured row */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        {featuredPost.map((post) => (
          <Link
            key={post.slug}
            href={`/newsroom/${post.date.split('-')[0]}/${post.date.split('-')[1]}/${post.slug}`}
            className="flex min-h-50 flex-1 flex-col justify-between rounded-md bg-gray-600 p-4 shadow transition-colors hover:bg-gray-500"
          >
            <div>
              <h2 className="mb-2 text-xl font-bold">{post.title}</h2>
              <p className="text-sm">{post.date}</p>
            </div>
            <div className="mt-4">{post?.excerpt || 'No excerpt available'}</div>
          </Link>
        ))}
      </div>

      {/* List view for the rest */}
      <div className="space-y-2">
        {otherPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/newsroom/${post.date.split('-')[0]}/${post.date.split('-')[1]}/${post.slug}`}
            className="flex items-center gap-2 border-b py-2 transition-colors hover:bg-gray-100"
          >
            <span className="w-8 font-mono text-gray-400">{post.id}</span>
            <span className="font-medium">{post.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
