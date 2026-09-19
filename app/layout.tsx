import type { Metadata } from 'next';
import { Spectral, Public_Sans } from 'next/font/google';
import './globals.css';

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-spectral',
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-public-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cliffsidemotariacademy.com'),
  title: {
    default: 'Cliffside Motari Academy',
    template: '%s | Cliffside Motari Academy',
  },
  description:
    'A Competency-Based Education academy on the hills of Manga, Nyamira County, Kenya.',
  openGraph: {
    title: 'Cliffside Motari Academy',
    description:
      'A Competency-Based Education academy on the hills of Manga, Nyamira County, Kenya.',
    url: 'https://cliffsidemotariacademy.com',
    siteName: 'Cliffside Motari Academy',
    locale: 'en_KE',
    type: 'website',
  },
  manifest: '/manifest.json',
  themeColor: '#23483A',
};

// This root layout is intentionally minimal — the public site's
// Header/Footer/AnnouncementBar live in app/(public)/layout.tsx instead, so
// that /admin routes (which use their own app/admin/(dashboard)/layout.tsx)
// don't inherit the public site's chrome. Everything under app/ shares only
// fonts, global CSS, and site-wide <head> metadata from here.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spectral.variable} ${publicSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Cliffside Motari Academy',
              url: 'https://cliffsidemotariacademy.com',
              telephone: '+254117225220',
              email: 'info@cliffsidemotariacademy.com',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Manga',
                addressRegion: 'Nyamira County',
                addressCountry: 'KE',
              },
            }),
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
