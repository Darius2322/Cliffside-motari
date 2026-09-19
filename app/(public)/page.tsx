import Image from 'next/image';
import Link from 'next/link';
import GalleryGrid from '@/components/GalleryGrid';
import { getGalleryImages } from '@/lib/actions/gallery';
import {
  mission,
  vision,
  whyChooseUs,
  learningTools,
  programs,
  site,
} from '@/lib/content';

export default async function HomePage() {
  const galleryImages = (await getGalleryImages()).slice(0, 8);
  return (
    <>
      {/* HERO */}
      <section className="relative">
        <div className="h-[52vh] min-h-[320px] overflow-hidden md:h-[78vh] md:max-h-[680px]">
          <Image
            src="https://cliffsidemotariacademy.com/uploads/gallery/media/1762923091-1626326247691412530d03f!_MG_4361.JPG"
            alt="Cliffside Motari Academy campus on the hills of Manga"
            width={1600}
            height={1000}
            priority
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative -mt-0 border-l-4 border-loam bg-paper p-9 md:-mt-24 md:ml-[6%] md:max-w-xl md:border-l-0 md:border-t-4">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">
            CLIFFSIDE MOTARI ACADEMY
          </div>
          <h1 className="mb-4 font-serif text-3xl font-semibold leading-tight text-canopy md:text-4xl">
            A hillside academy built for how children actually learn.
          </h1>
          <p className="mb-6 max-w-md text-mist">
            Nestled in the hills of Manga, Nyamira County, CMA pairs a competency-based
            curriculum with hands-on technology — every learner works with their own
            laptop and iPad from day one.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/admissions" className="rounded-sm bg-loam px-6 py-3 font-semibold text-white hover:bg-loam-dark">
              Apply for Admission
            </Link>
            <Link href="/about" className="rounded-sm border border-canopy px-6 py-3 font-semibold text-canopy hover:bg-canopy hover:text-white">
              Discover CMA
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-surface px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-xl">
            <h2 className="mb-3 font-serif text-2xl font-semibold text-canopy md:text-3xl">
              Welcome to Cliffside Motari Academy
            </h2>
            <p className="text-mist">
              We deliver a holistic CBC-based learning experience enhanced by technology,
              creativity, teamwork, and real-world problem-solving.
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <Image
              src="https://cliffsidemotariacademy.com/uploads/gallery/media/1763226098-9181482306918b1f2b5d2c!_MG_5315.JPG"
              alt="Students at Cliffside Motari Academy"
              width={900}
              height={700}
              className="rounded-sm"
            />
            <div className="space-y-6">
              <div className="border-l-2 border-border pl-6">
                <h4 className="mb-1 font-serif text-lg text-canopy">Our Mission</h4>
                <p className="text-sm text-mist">{mission}</p>
              </div>
              <div className="border-l-2 border-border pl-6">
                <h4 className="mb-1 font-serif text-lg text-canopy">Our Vision</h4>
                <p className="text-sm text-mist">{vision}</p>
              </div>
              <div className="border-l-2 border-border pl-6">
                <h4 className="mb-1 font-serif text-lg text-canopy">Why Choose Us</h4>
                <p className="text-sm text-mist">
                  Technology-driven learning, personalized CBE progression, qualified
                  teachers, a safe environment, modern facilities, and strong character
                  development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="bg-paper px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-xl">
            <h2 className="mb-3 font-serif text-2xl font-semibold text-canopy md:text-3xl">
              Our Programs
            </h2>
            <p className="text-mist">
              A complete Competency-Based Education pathway, from early years through
              junior high.{' '}
              <Link href="/academics" className="border-b border-loam text-canopy">
                See full details &rarr;
              </Link>
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program) => (
              <div key={program.slug} className="bg-surface p-7">
                <span className="mb-3 block text-xs font-bold tracking-wide text-loam">
                  {program.tag}
                </span>
                <h3 className="mb-2 font-serif text-lg font-semibold text-canopy">
                  {program.title}
                </h3>
                <p className="mb-4 text-sm text-mist">{program.summary}</p>
                <Link
                  href={`/academics#${program.slug}`}
                  className="border-b border-loam text-sm font-semibold text-canopy"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY / TOOLS STRIP */}
      <section className="bg-canopy px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-xl">
            <h2 className="mb-3 font-serif text-2xl font-semibold md:text-3xl">
              Learning built around real tools
            </h2>
            <p className="text-[#cfd9d3]">What sets a CMA education apart, day to day.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {learningTools.map((item) => (
              <div key={item.title} className="border-t border-white/20 pt-5">
                <h4 className="mb-2 font-serif text-lg font-semibold">{item.title}</h4>
                <p className="text-sm text-[#cfd9d3]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY TEASER */}
      <section className="bg-paper px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-xl">
            <h2 className="mb-3 font-serif text-2xl font-semibold text-canopy md:text-3xl">
              Life at CMA
            </h2>
            <p className="text-mist">
              A glimpse of the campus and community on the hills of Manga.{' '}
              <Link href="/gallery" className="border-b border-loam text-canopy">
                View full gallery &rarr;
              </Link>
            </p>
          </div>
          <GalleryGrid images={galleryImages} />
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="bg-surface px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-xl">
            <h2 className="mb-3 font-serif text-2xl font-semibold text-canopy md:text-3xl">
              Visit or reach us
            </h2>
            <p className="text-mist">
              We&apos;re just outside Manga town, next to Sengera Manga High School.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="border-t-2 border-loam pt-5">
              <h4 className="mb-2 text-xs font-bold tracking-wide text-mist">CALL US</h4>
              <p className="font-serif text-lg text-canopy">{site.phone}</p>
            </div>
            <div className="border-t-2 border-loam pt-5">
              <h4 className="mb-2 text-xs font-bold tracking-wide text-mist">EMAIL US</h4>
              <p className="font-serif text-lg text-canopy">{site.email}</p>
            </div>
            <div className="border-t-2 border-loam pt-5">
              <h4 className="mb-2 text-xs font-bold tracking-wide text-mist">FIND US</h4>
              <p className="font-serif text-lg text-canopy">{site.location}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
