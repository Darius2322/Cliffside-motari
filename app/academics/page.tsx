import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { programs, learningTools } from '@/lib/content';

export const metadata: Metadata = { title: 'Academics' };

export default function AcademicsPage() {
  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">ACADEMICS</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">
            Our Programs
          </h1>
          <p className="max-w-xl text-mist">
            A complete Competency-Based Education (CBE) pathway, from early years
            through junior high.
          </p>
        </div>
      </div>

      <section className="px-6 py-4">
        <div className="mx-auto max-w-6xl">
          {programs.map((program, i) => (
            <div
              key={program.slug}
              id={program.slug}
              className="scroll-mt-24 border-b border-border py-14 last:border-b-0"
            >
              <div
                className={`grid gap-10 md:grid-cols-2 md:items-center ${
                  i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div>
                  <span className="mb-2 block text-xs font-bold tracking-wide text-loam">
                    {program.tag}
                  </span>
                  <h3 className="mb-3 font-serif text-2xl text-canopy">{program.title}</h3>
                  <p className="mb-5 text-mist">{program.summary}</p>
                  <Link
                    href="/admissions"
                    className="inline-block rounded-sm border border-canopy px-6 py-3 font-semibold text-canopy hover:bg-canopy hover:text-white"
                  >
                    Apply for Admission
                  </Link>
                </div>
                <Image
                  src={program.image}
                  alt={`${program.title} learners at CMA`}
                  width={900}
                  height={700}
                  className="rounded-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

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

      <section className="bg-paper px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 font-serif text-2xl font-semibold text-canopy">
            Detailed Curriculum
          </h2>
          <div className="rounded-sm border border-dashed border-border bg-[#EFE8D8] p-4 text-sm italic text-mist">
            Detailed subject-by-subject curriculum breakdowns for each level will be
            added here once provided by the school administration.
          </div>
        </div>
      </section>
    </>
  );
}
