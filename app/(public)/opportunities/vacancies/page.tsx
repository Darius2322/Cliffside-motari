import type { Metadata } from 'next';
import { getVacancies } from '@/lib/actions/opportunities';
import VacancyApplyForm from '@/components/VacancyApplyForm';

export const metadata: Metadata = { title: 'Vacancies' };

export default async function VacanciesPage() {
  const vacancies = await getVacancies();

  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">OPPORTUNITIES</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">Vacancies</h1>
          <p className="max-w-xl text-mist">Current employment opportunities at CMA.</p>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          {vacancies.length === 0 ? (
            <div className="rounded-sm border border-dashed border-border bg-[#EFE8D8] p-6 text-sm italic text-mist">
              No open positions at the moment — check back soon.
            </div>
          ) : (
            <div className="grid gap-6">
              {vacancies.map((v) => (
                <div key={v.id} className="rounded-sm border border-border bg-surface p-6">
                  <h3 className="mb-1 font-serif text-lg text-canopy">{v.title}</h3>
                  <p className="mb-3 text-sm text-mist">
                    {[v.department, v.location, v.employment_type].filter(Boolean).join(' · ')}
                  </p>
                  <p className="mb-3 text-sm text-mist">{v.description}</p>
                  <p className="text-xs text-mist">
                    Closes {new Date(v.closing_date).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  {v.application_mode === 'external' && v.external_url ? (
                    <a href={v.external_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-sm bg-loam px-5 py-2 text-sm font-semibold text-white hover:bg-loam-dark">
                      Apply Now
                    </a>
                  ) : (
                    <VacancyApplyForm vacancyId={v.id} />
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
