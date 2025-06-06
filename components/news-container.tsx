import { FaShare } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import { fetchSupabaseImage } from '../lib/api';
import type { Post } from '../lib/db/schema';

export function NewsContainer({ news }: { news: Post }) {
  return (
    // Clickable link to the news item
    <Link
      href={`/newsroom/${news.date.split('-')[0]}/${news.date.split('-')[1]}/${news.slug}`}
      className="group bg-steel/25 relative max-w-[400px] min-w-[300px] flex-1 rounded backdrop-blur-sm transition-transform duration-300 hover:scale-102 active:scale-95"
    >
      {/* External link icon */}
      <div className="bg-midnight/90 absolute top-2 right-2 z-20 flex items-center justify-center rounded-full p-2 shadow-lg backdrop-blur-sm">
        <FaShare className="h-4 w-4 text-gray-300" />
      </div>

      {/* Image */}
      {news.cover_image && (
        <Image
          src={fetchSupabaseImage({
            container: 'news',
            path: news.cover_image,
          })}
          alt={news.title}
          width={400}
          height={225}
          className="h-36 w-full rounded-t object-cover md:h-48"
        />
      )}

      {/* Title and date */}
      <div className="p-4">
        <h2 className="mb-2 text-xl font-bold text-gray-200 group-hover:text-white">
          {news.title}
        </h2>

        <div className="flex gap-2 text-sm text-gray-300">
          <span className="text-deep-orange/90 group-hover:text-deep-orange uppercase">
            {news.type}
          </span>
          <span className="text-gray-400 group-hover:text-gray-300">|</span>
          <span className="text-gray-400 group-hover:text-gray-300">
            {new Date(news.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
