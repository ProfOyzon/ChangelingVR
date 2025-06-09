import { FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { findPost } from '@/app/newsroom/find-post';
import { CopyLink } from '@/components/copy-link';
import { getCachedPosts } from '@/lib/cache';
import type { Post } from '@/lib/db/schema';

export async function generateStaticParams() {
  const { data } = await getCachedPosts();
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
  const { data } = await getCachedPosts();

  const post = findPost({ data, year, month, slug });
  if (!post) return notFound();

  return {
    title: `${post.title} | Changeling VR`,
    description: post?.excerpt,
    authors: post.author?.map((a: string) => ({ name: a })) ?? [],
    openGraph: {
      title: `${post.title} | Changeling VR`,
      description: post?.excerpt ?? '',
      images: post?.cover_image
        ? [
            {
              url: `https://changelingvr.vercel.app/${post.cover_image}`,
            },
          ]
        : [],
    },
    twitter: {
      title: `${post.title} | Changeling VR`,
      description: post?.excerpt ?? '',
      images: post?.cover_image
        ? [
            {
              url: `https://changelingvr.vercel.app/${post.cover_image}`,
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
  const { data } = await getCachedPosts();
  // Get post and import the MDX file
  const post = findPost({ data, year, month, slug });
  if (!post) return notFound();
  const { default: Post } = await import(`@/contents/${post.file_path}`);

  // Get the post URL
  const postUrl = `https://changelingvr.vercel.app/newsroom/${year}/${month}/${slug}`;

  return (
    <div className="mx-auto max-w-7xl space-y-4 rounded-lg bg-gray-900/50 p-6 backdrop-blur-sm">
      <div className="flex flex-row items-center justify-between">
        <span className="rounded border border-gray-500 px-2 py-1 text-sm font-semibold text-gray-300 uppercase">
          {post.type}
        </span>

        <div className="flex flex-row gap-2">
          <CopyLink
            url={postUrl}
            className="rounded border border-gray-500 p-2 hover:cursor-pointer hover:bg-gray-700"
          />
          <a
            className="rounded border border-gray-500 p-2 hover:bg-gray-700"
            href={`https://twitter.com/intent/tweet?text=Check out this post on Changeling VR:&url=${encodeURIComponent(postUrl)}`}
          >
            <FaXTwitter className="size-4" />
          </a>
          <a
            className="rounded border border-gray-500 p-2 hover:bg-gray-700"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
          >
            <FaLinkedin className="size-4" />
          </a>
        </div>
      </div>

      <h1 className="text-4xl font-bold">{post.title}</h1>

      <div className="flex flex-row gap-6 text-sm">
        <span className="flex flex-row gap-2">
          <span className="text-gray-500">By </span>
          <span className="text-gray-300">{post.author?.join(', ')}</span>
        </span>

        <span className="flex flex-row gap-2">
          <span className="text-gray-500">Published </span>
          <span className="text-gray-300">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </span>
      </div>

      {post.cover_image && (
        <Image
          src={`/${post.cover_image}`}
          alt={post.title}
          width={1200}
          height={400}
          className="h-50 w-full rounded-lg object-cover"
        />
      )}

      {/* https://nextjs.org/docs/app/guides/mdx#using-tailwind-typography-plugin */}
      {/* https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file */}
      <div className="prose-invert prose prose-headings:mt-8 prose-headings:font-semibold prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg min-w-full">
        <Post />
      </div>
    </div>
  );
}
