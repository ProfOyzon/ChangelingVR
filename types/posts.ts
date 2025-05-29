import type { Identifiable } from './common';

export interface Post extends Identifiable {
  slug: string;
  title: string;
  date: string;
  type: 'blog' | 'game' | 'event' | 'announcement';
  author: string[];
  published: boolean;
  file_path: string;
  cover_image?: string;
  excerpt?: string;
}
