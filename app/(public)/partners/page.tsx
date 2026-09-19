import type { Metadata } from 'next';
import Image from 'next/image';
import { getPartners } from '@/lib/actions/opportunities';

export const metadata: Metadata = { title: 'Partners' };

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">PARTNERS</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">Our Partners</h1>
          <p className="max-w-xl text-mist">Organizations working with Cliffside Motari Academy.</p>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {partners.length === 0 ? (
            <div className="rounded-sm border border-dashed border-border bg-[#EFE8D8] p-6 text-sm italic text-mist">
              No partners listed yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((p) => (
                <a
                  key={p.id}
                  href={p.website_url ?? undefined}
                  target={p.website_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="rounded-sm border border-border bg-surface p-6 text-center hover:border-loam"
                >
                  {p.logo_path && (
                    <Image src={p.logo_path} alt={p.name} width={160} height={80} className="mx-auto mb-4 object-contain" />
                  )}
                  <h3 className="font-serif text-base text-canopy">{p.name}</h3>
                  {p.description && <p className="mt-2 text-sm text-mist">{p.description}</p>}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
