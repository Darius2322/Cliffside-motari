import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getNewsBySlug } from '@/lib/actions/news';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  return { title: post?.title ?? 'News' };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) notFound();

  return (
    <article className="px-6 py-16">
      <div className="mx-auto max-w-2xl">
        {post.category && (
          <span className="mb-3 block text-xs font-bold tracking-wide text-loam">
            {post.category.toUpperCase()}
          </span>
        )}
        <h1 className="mb-4 font-serif text-3xl font-semibold text-canopy md:text-4xl">
          {post.title}
        </h1>
        {post.published_at && (
          <p className="mb-8 text-sm text-mist">
            {new Date(post.published_at).toLocaleDateString('en-KE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {post.author && ` · ${post.author}`}
          </p>
        )}
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-ink">
          {post.body}
        </div>
      </div>
    </article>
  );
}
