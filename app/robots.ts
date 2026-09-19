import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admissions/status'],
    },
    sitemap: 'https://cliffsidemotariacademy.com/sitemap.xml',
  };
}
