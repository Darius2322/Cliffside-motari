import Link from 'next/link';
import type { Metadata } from 'next';
import { FileText, Briefcase, Handshake } from 'lucide-react';

export const metadata: Metadata = { title: 'Opportunities' };

export default function OpportunitiesPage() {
  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">OPPORTUNITIES</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">
            Opportunities
          </h1>
          <p className="max-w-xl text-mist">
            Procurement, employment, and partnership opportunities with Cliffside
            Motari Academy.
          </p>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
          <Link href="/opportunities/tenders" className="rounded-sm border border-border bg-surface p-7 hover:border-loam">
            <FileText className="mb-4 text-loam" size={28} />
            <h3 className="mb-2 font-serif text-lg text-canopy">Tenders</h3>
            <p className="text-sm text-mist">Procurement and supply opportunities.</p>
          </Link>
          <Link href="/opportunities/vacancies" className="rounded-sm border border-border bg-surface p-7 hover:border-loam">
            <Briefcase className="mb-4 text-loam" size={28} />
            <h3 className="mb-2 font-serif text-lg text-canopy">Vacancies</h3>
            <p className="text-sm text-mist">Current employment opportunities.</p>
          </Link>
          <Link href="/partners" className="rounded-sm border border-border bg-surface p-7 hover:border-loam">
            <Handshake className="mb-4 text-loam" size={28} />
            <h3 className="mb-2 font-serif text-lg text-canopy">Partners</h3>
            <p className="text-sm text-mist">Organizations working with CMA.</p>
          </Link>
        </div>
      </section>
    </>
  );
}
