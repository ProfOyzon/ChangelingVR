import type { BaseContent, Identifiable } from './common';

export interface NewsItem extends BaseContent, Identifiable {
  year: number;
  month: number;
  day: number;
  slug: string;
  title: string;
  type: string;
  excerpt: string;
  content: string;
  authors: string[];
  image_url: string;
}
