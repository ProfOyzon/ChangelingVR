import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { findPost } from '@/app/newsroom/find-post';
import { getCachedPosts } from '@/lib/cache';
import type { Post } from '@/types';

export async function generateStaticParams() {
  const { data } = (await getCachedPosts()) as { data: Post[] };
  // Only prebuild the 20 most recent posts
  return (data ?? []).slice(0, 20).map((p) => ({
    year: p.date.split('-')[0],
    month: p.date.split('-')[1],
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; slug: string }>;
}): Promise<Metadata> {
  const { year, month, slug } = await params;
  const { data } = (await getCachedPosts()) as { data: Post[] };

  const post = findPost({ data, year, month, slug });
  if (!post || Array.isArray(post)) return notFound();

  return {
    title: post.title,
    description: post?.excerpt,
    authors: post.author?.map((a: string) => ({ name: a })) ?? [],
    openGraph: {
      title: post.title,
      description: post?.excerpt,
      images: post?.cover_image
        ? [
            {
              url: `https://changeling.com/${post.cover_image}`,
            },
          ]
        : [],
    },
    twitter: {
      title: post.title,
      description: post?.excerpt,
      images: post?.cover_image
        ? [
            {
              url: `https://changeling.com/${post.cover_image}`,
            },
          ]
        : [],
    },
  };
}

export default async function Post({
  params,
}: {
  params: Promise<{ year: string; month: string; slug: string }>;
}) {
  const { year, month, slug } = await params;
  const { data } = (await getCachedPosts()) as { data: Post[] };

  const post = findPost({ data, year, month, slug });
  if (!post || Array.isArray(post)) return notFound();
  const { default: Post } = await import(`@/contents/${post.file_path}`);

  return (
    <>
      {post.cover_image ? (
        <Image
          src={`/${post.cover_image}`}
          alt={post.title}
          width={1200}
          height={400}
          className="object-cover w-full h-50"
        />
      ) : (
        // 16(default) - 8(h1) = 8
        <div className="h-8" aria-hidden="true"></div>
      )}

      <h1>{post.title}</h1>
      {/* <div className="flex flex-col gap-2 mb-4">
        <span className="text-sm text-gray-400">{post.date}</span>
        <span className="text-sm text-gray-400">{post.author?.join(', ')}</span>
      </div> */}

      <article className="bg-gray-800 p-4 rounded">
        <Post />
      </article>
    </>
  );
}
