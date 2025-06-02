import { FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { findPost } from '@/app/newsroom/find-post';
import { CopyLink } from '@/components/copy-link';
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
  if (!post) return notFound();

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
              url: `https://changelingvr.vercel.app/${post.cover_image}`,
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
  const { data } = (await getCachedPosts()) as { data: Post[] };

  // Get post and import the MDX file
  const post = findPost({ data, year, month, slug });
  if (!post) return notFound();
  const { default: Post } = await import(`@/contents/${post.file_path}`);

  // Get the post URL
  const postUrl = `https://changelingvr.vercel.app/newsroom/${year}/${month}/${slug}`;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg space-y-4">
      <div className="flex flex-row justify-between items-center">
        <span className="uppercase rounded border border-gray-500 text-gray-300 text-sm font-semibold py-1 px-2">
          {post.type}
        </span>

        <div className="flex flex-row gap-2">
          <CopyLink
            url={postUrl}
            className="p-2 rounded border border-gray-500 hover:bg-gray-700 hover:cursor-pointer"
          />
          <a
            className="p-2 rounded border border-gray-500 hover:bg-gray-700"
            href={`https://twitter.com/intent/tweet?text=Check out this post on Changeling VR:&url=${encodeURIComponent(postUrl)}`}
          >
            <FaXTwitter className="size-4" />
          </a>
          <a
            className="p-2 rounded border border-gray-500 hover:bg-gray-700"
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
          className="object-cover w-full h-50 rounded-lg"
        />
      )}

      {/* https://nextjs.org/docs/app/guides/mdx#using-tailwind-typography-plugin */}
      {/* https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file */}
      <div className="min-w-full prose-invert prose prose-headings:mt-8 prose-headings:font-semibold prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg">
        <Post />
      </div>
    </div>
  );
}
