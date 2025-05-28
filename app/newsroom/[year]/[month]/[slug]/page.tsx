import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchSupabaseImage } from '@/lib/api';
import { getCachedNews } from '@/lib/cache';
import { formatDate } from '@/lib/utils';
import type { NewsItem } from '@/types/news';

export const dynamicParams = true;

// Generate static params
export async function generateStaticParams() {
  const { data } = await getCachedNews();

  return (
    data?.map((post) => ({
      slug: [String(post.year), String(post.month), post.slug],
    })) ?? []
  );
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; slug: string }>;
}): Promise<Metadata> {
  const { year, month, slug } = await params;
  const { data } = await getCachedNews();

  const post = data?.find(
    (p) => p.slug === slug && p.year === Number(year) && p.month === Number(month),
  ) as NewsItem;

  if (!post) return notFound();

  return {
    title: `${post.title} | Changeling News`,
    description: post.excerpt,
    authors: post.authors?.map((a: string) => ({ name: a })) ?? [],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image_url
        ? [
            {
              url: fetchSupabaseImage({
                container: 'news',
                path: post.image_url,
              }),
            },
          ]
        : [],
    },
    twitter: {
      title: post.title,
      description: post.excerpt,
      images: post.image_url
        ? [fetchSupabaseImage({ container: 'news', path: post.image_url })]
        : [],
    },
  };
}

export default async function News({
  params,
}: {
  params: Promise<{ year: string; month: string; slug: string }>;
}) {
  const { year, month, slug } = await params;
  const { data } = await getCachedNews();

  const post = data?.find(
    (p) => p.slug === slug && p.year === Number(year) && p.month === Number(month),
  ) as NewsItem;

  if (!post) return notFound();

  const isoDate = new Date(
    `${post.year}-${String(post.month).padStart(2, '0')}-${String(post.day).padStart(2, '0')}`,
  ).toISOString();

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[35svh] w-full">
        <Image
          src={fetchSupabaseImage({
            container: 'news',
            path: post.image_url,
          })}
          alt={post.title}
          fill
          className="mask-b-from-50% object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="container mx-auto p-4">
        <article className="bg-steel/25 relative rounded-lg p-6 backdrop-blur-sm">
          {/* Header */}
          <header className="space-y-6">
            {/* Breadcrumb */}

            {/* Title and date */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-deep-orange/20 text-deep-orange rounded-full px-3 py-1 uppercase">
                  {post.type}
                </span>
                <time dateTime={isoDate} className="text-gray-400">
                  {formatDate(isoDate)}
                </time>
              </div>

              <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              {/* Author */}
              {post.authors && (
                <div className="text-sm text-gray-400">By {post.authors.join(', ')}</div>
              )}
            </div>
          </header>

          <div className="mt-8 max-w-none">{post.content}</div>
        </article>
      </div>
    </>
  );
}
