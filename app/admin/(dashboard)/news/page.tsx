import Link from 'next/link';
import { Plus } from 'lucide-react';
import { listAllNews } from '@/lib/actions/admin-news';

export default async function AdminNewsListPage() {
  const posts = await listAllNews();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-canopy">News</h1>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-1.5 rounded-sm bg-canopy px-5 py-2.5 text-sm font-semibold text-white hover:bg-canopy-dark"
        >
          <Plus size={17} /> New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border bg-surface p-8 text-center text-sm text-mist">
          No news posts yet — create the first one.
        </div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-paper text-xs font-semibold uppercase tracking-wide text-mist">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-b-0 hover:bg-paper">
                  <td className="px-5 py-3">
                    <Link href={`/admin/news/${post.id}`} className="font-medium text-canopy">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-mist">{post.category ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        post.status === 'Published' ? 'bg-canopy text-white' : 'bg-border text-mist'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-mist">
                    {new Date(post.created_at).toLocaleDateString('en-KE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
