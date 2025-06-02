import type { Post } from '@/types';

export function findPost({
  data,
  year,
  month,
  slug,
}: {
  data: Post[];
  year: string;
  month: string;
  slug: string;
}): Post | undefined {
  return (
    data?.find((p) => {
      const [postYear, postMonth] = p.date.split('-');
      return postYear === year && postMonth === month.padStart(2, '0') && p.slug === slug;
    }) ?? undefined
  );
}
