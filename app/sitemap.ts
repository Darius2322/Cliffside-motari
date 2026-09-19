import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://cliffsidemotariacademy.com';
  const routes = [
    '',
    '/about',
    '/academics',
    '/gallery',
    '/news',
    '/academic-calendar',
    '/admissions',
    '/admissions/status',
    '/reviews',
    '/complaints',
    '/opportunities',
    '/opportunities/tenders',
    '/opportunities/vacancies',
    '/partners',
    '/resources',
    '/contact',
    '/privacy',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
