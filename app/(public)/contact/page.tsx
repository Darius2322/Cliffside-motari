import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { site } from '@/lib/content';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">CONTACT</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">
            Visit or reach us
          </h1>
          <p className="max-w-xl text-mist">
            We&apos;re just outside Manga town, Nyamira County, next to Sengera Manga
            High School.
          </p>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid gap-8 md:grid-cols-3">
            <a href={site.phoneHref} className="border-t-2 border-loam pt-5">
              <h4 className="mb-2 text-xs font-bold tracking-wide text-mist">CALL US</h4>
              <p className="font-serif text-lg text-canopy">{site.phone}</p>
            </a>
            <a href={`mailto:${site.email}`} className="border-t-2 border-loam pt-5">
              <h4 className="mb-2 text-xs font-bold tracking-wide text-mist">EMAIL US</h4>
              <p className="font-serif text-lg text-canopy">{site.email}</p>
            </a>
            <a
              href="https://www.google.com/maps/search/Manga,+Nyamira+County,+Kenya"
              target="_blank"
              rel="noopener noreferrer"
              className="border-t-2 border-loam pt-5"
            >
              <h4 className="mb-2 text-xs font-bold tracking-wide text-mist">FIND US</h4>
              <p className="font-serif text-lg text-canopy">Manga, Nyamira County</p>
            </a>
          </div>

          <div className="mb-16 h-[340px] overflow-hidden rounded-sm border border-border">
            <iframe
              title="Map of Manga, Nyamira County"
              loading="lazy"
              className="h-full w-full border-0"
              src="https://www.openstreetmap.org/export/embed.html?bbox=34.80,-0.65,34.95,-0.50&layer=mapnik"
            />
          </div>

          <h2 className="mb-3 font-serif text-2xl font-semibold text-canopy">
            Send us a message
          </h2>
          <p className="mb-6 max-w-lg text-mist">
            Have a question before applying? Reach out and we&apos;ll get back to you.
          </p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
