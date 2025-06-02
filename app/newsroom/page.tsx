import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCachedPosts } from '@/lib/cache';
import type { Post } from '@/types';

export default async function Posts() {
  const { data } = (await getCachedPosts()) as { data: Post[] };
  if (!data) return notFound();

  // Get the first 3 posts as featured posts
  const featuredPost = data.slice(0, 3);
  const otherPosts = data.slice(3);

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-svh">
      <h1 className="text-4xl font-bold my-8">Newsroom</h1>

      {/* Featured row */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {featuredPost.map((post) => (
          <Link
            key={post.slug}
            href={`/newsroom/${post.date.split('-')[0]}/${post.date.split('-')[1]}/${post.slug}`}
            className="flex-1 bg-gray-600 rounded shadow p-4 min-h-50 flex flex-col justify-between hover:bg-gray-500 transition-colors"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
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
            className="flex items-center gap-2 border-b py-2 hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-400 font-mono w-8">{post.id}</span>
            <span className="font-medium">{post.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
