import type { Metadata } from 'next';
import { getTenders } from '@/lib/actions/opportunities';
import TenderApplyForm from '@/components/TenderApplyForm';

export const metadata: Metadata = { title: 'Tenders' };

const statusColor: Record<string, string> = {
  Open: 'bg-canopy text-white',
  'Closing Soon': 'bg-loam text-white',
  Closed: 'bg-border text-mist',
  Awarded: 'bg-canopy text-white',
  Archived: 'bg-border text-mist',
};

export default async function TendersPage() {
  const tenders = await getTenders();

  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">OPPORTUNITIES</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">Tenders</h1>
          <p className="max-w-xl text-mist">Current procurement opportunities with CMA.</p>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          {tenders.length === 0 ? (
            <div className="rounded-sm border border-dashed border-border bg-[#EFE8D8] p-6 text-sm italic text-mist">
              No tenders are currently listed.
            </div>
          ) : (
            <div className="grid gap-6">
              {tenders.map((tender) => (
                <div key={tender.id} className="rounded-sm border border-border bg-surface p-6">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[tender.status]}`}>
                      {tender.status}
                    </span>
                    <span className="text-xs text-mist">Ref: {tender.reference_number}</span>
                  </div>
                  <h3 className="mb-2 font-serif text-lg text-canopy">{tender.title}</h3>
                  <p className="mb-3 text-sm text-mist">{tender.description}</p>
                  <p className="text-xs text-mist">
                    Closes {new Date(tender.closing_date).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  {tender.application_mode === 'external' && tender.external_url && (
                    <a href={tender.external_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-sm border border-canopy px-5 py-2 text-sm font-semibold text-canopy hover:bg-canopy hover:text-white">
                      Apply / Submit Bid
                    </a>
                  )}
                  {tender.application_mode === 'internal' &&
                    (tender.status === 'Open' || tender.status === 'Closing Soon') && (
                      <TenderApplyForm tenderId={tender.id} />
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
