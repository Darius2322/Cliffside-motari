import type { Metadata } from 'next';
import { FileDown } from 'lucide-react';
import { getResources } from '@/lib/actions/opportunities';

export const metadata: Metadata = { title: 'Resources' };

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">RESOURCES</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">Resources</h1>
          <p className="max-w-xl text-mist">
            Approved public documents — calendars, admission requirements, handbooks
            and forms.
          </p>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          {resources.length === 0 ? (
            <div className="rounded-sm border border-dashed border-border bg-[#EFE8D8] p-6 text-sm italic text-mist">
              No public documents have been uploaded yet.
            </div>
          ) : (
            <div className="divide-y divide-border rounded-sm border border-border bg-surface">
              {resources.map((r) => (
                <a key={r.id} href={r.file_path} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 hover:bg-paper">
                  <FileDown className="text-loam" size={22} />
                  <div>
                    <h3 className="font-serif text-base text-canopy">{r.title}</h3>
                    {r.description && <p className="text-sm text-mist">{r.description}</p>}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
