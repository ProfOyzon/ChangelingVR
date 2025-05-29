import type { Post } from '@/types';

export function findPost({
  data,
  year,
  month,
  slug,
}: {
  data: Post[];
  year: string;
  month?: string;
  slug?: string;
}): Post | Post[] | undefined {
  const matches =
    data?.filter((p) => {
      const [postYear, postMonth] = p.date.split('-');
      if (postYear !== year) return false;
      if (month && postMonth !== month.padStart(2, '0')) return false;
      if (slug && p.slug !== slug) return false;
      return true;
    }) ?? [];

  if (slug) {
    return matches[0] ?? undefined;
  } else {
    return matches.length > 0 ? matches : undefined;
  }
}
