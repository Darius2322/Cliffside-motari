import Image from 'next/image';
import type { Metadata } from 'next';
import { mission, vision, whyChooseUs } from '@/lib/content';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">ABOUT US</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">
            Cliffside Motari Academy
          </h1>
          <p className="max-w-xl text-mist">
            A Competency-Based Education academy on the hills of Manga, Nyamira County —
            built around technology, character, and academic excellence.
          </p>
        </div>
      </div>

      <section className="bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 font-serif text-2xl font-semibold text-canopy">Our Story</h2>
          <div className="mb-8 rounded-sm border border-dashed border-border bg-[#EFE8D8] p-4 text-sm italic text-mist">
            Our full founding story is being finalized with the school administration and
            will appear here — content will be managed by the administrator.
          </div>
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <Image
              src="https://cliffsidemotariacademy.com/uploads/gallery/media/1762923091-1626326247691412530d03f!_MG_4361.JPG"
              alt="Cliffside Motari Academy campus"
              width={900}
              height={700}
              className="rounded-sm"
            />
            <p className="text-mist">
              Cliffside Motari Academy sits in Manga, Nyamira County, next to Sengera
              Manga High School — a setting that shapes a learning environment built
              around the surrounding hills and community.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 font-serif text-2xl font-semibold text-canopy">
            Mission &amp; Vision
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="border-l-2 border-border pl-6">
              <h4 className="mb-2 font-serif text-lg text-canopy">Our Mission</h4>
              <p className="text-mist">{mission}</p>
            </div>
            <div className="border-l-2 border-border pl-6">
              <h4 className="mb-2 font-serif text-lg text-canopy">Our Vision</h4>
              <p className="text-mist">{vision}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 font-serif text-2xl font-semibold text-canopy">
            Why Choose CMA
          </h2>
          <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="bg-surface p-7">
                <h4 className="mb-2 font-serif text-base text-canopy">{item.title}</h4>
                <p className="text-sm text-mist">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 font-serif text-2xl font-semibold text-canopy">
            Leadership &amp; Staff
          </h2>
          <div className="rounded-sm border border-dashed border-border bg-[#EFE8D8] p-4 text-sm italic text-mist">
            Leadership and staff profiles (photo, name, position, biography) will be
            added here once provided by the school administration. No names or photos
            are shown until verified.
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 font-serif text-2xl font-semibold text-canopy">Facilities</h2>
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <Image
              src="https://cliffsidemotariacademy.com/uploads/gallery/media/1763226098-9181482306918b1f2b5d2c!_MG_5315.JPG"
              alt="Cliffside Motari Academy facilities"
              width={900}
              height={700}
              className="rounded-sm"
            />
            <p className="text-mist">
              Confirmed facilities include a modern library supporting research and
              digital learning. Additional facility details will be added as they are
              verified with the school.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
