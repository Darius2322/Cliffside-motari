import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

async function countRows(supabase: Awaited<ReturnType<typeof createClient>>, table: string, filter?: Record<string, string>) {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }
  const { count } = await query;
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    newAdmissions,
    pendingReviews,
    openComplaints,
    draftNews,
  ] = await Promise.all([
    countRows(supabase, 'admissions', { status: 'Received' }),
    countRows(supabase, 'reviews', { status: 'Pending' }),
    countRows(supabase, 'complaints', { status: 'Received' }),
    countRows(supabase, 'news_posts', { status: 'Draft' }),
  ]);

  const cards = [
    { label: 'New Admissions', value: newAdmissions, href: '/admin/admissions' },
    { label: 'Pending Reviews', value: pendingReviews, href: '/admin/reviews' },
    { label: 'Open Complaints', value: openComplaints, href: '/admin/complaints' },
    { label: 'Draft News', value: draftNews, href: '/admin/news' },
  ];

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl font-semibold text-canopy">Dashboard</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-sm border border-border bg-surface p-6 hover:border-loam"
          >
            <p className="mb-1 text-3xl font-semibold text-canopy">{card.value}</p>
            <p className="text-sm text-mist">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-sm border border-dashed border-border bg-[#EFE8D8] p-5 text-sm italic text-mist">
        Every content section — News, Admissions, Complaints, Reviews,
        Gallery, Staff &amp; Leadership, Academic Calendar, Tenders,
        Vacancies, and Partners — is fully manageable here.
      </div>
    </div>
  );
}
