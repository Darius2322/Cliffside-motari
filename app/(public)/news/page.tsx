import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedNews } from '@/lib/actions/news';

export const metadata: Metadata = { title: 'News' };

export default async function NewsPage() {
  const posts = await getPublishedNews();

  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">NEWS</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">
            News &amp; Announcements
          </h1>
          <p className="max-w-xl text-mist">Updates from Cliffside Motari Academy.</p>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {posts.length === 0 ? (
            <div className="rounded-sm border border-dashed border-border bg-[#EFE8D8] p-6 text-sm italic text-mist">
              No news posted yet — check back soon, or this will populate as soon as the
              school publishes its first update from the admin dashboard.
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="block rounded-sm border border-border bg-surface p-6 hover:border-loam"
                >
                  {post.category && (
                    <span className="mb-2 block text-xs font-bold tracking-wide text-loam">
                      {post.category.toUpperCase()}
                    </span>
                  )}
                  <h3 className="mb-2 font-serif text-lg text-canopy">{post.title}</h3>
                  {post.excerpt && <p className="text-sm text-mist">{post.excerpt}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
