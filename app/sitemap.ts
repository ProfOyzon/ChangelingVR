import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://changelingvr.vercel.app';
  const lastModified = new Date();

  const characters = ['angela', 'aurelia', 'douglas', 'kirsten', 'tobi'];

  const staticPages: MetadataRoute.Sitemap[0][] = [
    { url: `${baseUrl}`, priority: 1.0, changeFrequency: 'yearly' },
    { url: `${baseUrl}/characters`, priority: 0.8, changeFrequency: 'yearly' },
    { url: `${baseUrl}/team`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${baseUrl}/newsroom`, priority: 0.6, changeFrequency: 'weekly' },
  ];

  const characterPages: MetadataRoute.Sitemap[0][] = characters.map((slug) => ({
    url: `${baseUrl}/characters/${slug}`,
    priority: 0.6,
    changeFrequency: 'yearly',
  }));

  const legalPages: MetadataRoute.Sitemap[0][] = [
    { url: `${baseUrl}/terms`, priority: 0.2, changeFrequency: 'never' },
    { url: `${baseUrl}/privacy`, priority: 0.2, changeFrequency: 'never' },
  ];

  return [
    ...staticPages.map((page) => ({ ...page, lastModified })),
    ...characterPages.map((page) => ({ ...page, lastModified })),
    ...legalPages.map((page) => ({ ...page, lastModified })),
  ];
}
