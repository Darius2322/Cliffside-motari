'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNews, updateNews, deleteNews, type AdminNewsPost, type NewsInput } from '@/lib/actions/admin-news';

const categories = ['Academic', 'School News', 'Events', 'Sports', 'Music', 'Announcements', 'Community'];

export default function NewsForm({ post }: { post?: AdminNewsPost }) {
  const router = useRouter();
  const [values, setValues] = useState<NewsInput>({
    title: post?.title ?? '',
    excerpt: post?.excerpt ?? '',
    body: post?.body ?? '',
    category: post?.category ?? '',
    author: post?.author ?? '',
    status: (post?.status as 'Draft' | 'Published') ?? 'Draft',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof NewsInput, value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const handleSave = async (status: 'Draft' | 'Published') => {
    setSaving(true);
    setError('');
    const payload = { ...values, status };

    const result = post
      ? await updateNews(post.id, payload)
      : await createNews(payload);

    setSaving(false);

    if (!result.success) {
      setError(result.error ?? 'Something went wrong.');
      return;
    }
    router.push('/admin/news');
  };

  const handleDelete = async () => {
    if (!post) return;
    if (!confirm('Delete this post permanently?')) return;
    setDeleting(true);
    await deleteNews(post.id);
    router.push('/admin/news');
  };

  return (
    <div className="max-w-3xl">
      <div className="grid gap-5 rounded-sm border border-border bg-surface p-7">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Title</label>
          <input
            value={values.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-mist">Category</label>
            <select
              value={values.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-mist">Author</label>
            <input
              value={values.author}
              onChange={(e) => update('author', e.target.value)}
              className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Excerpt</label>
          <textarea
            rows={2}
            value={values.excerpt}
            onChange={(e) => update('excerpt', e.target.value)}
            className="w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Body</label>
          <textarea
            rows={12}
            value={values.body}
            onChange={(e) => update('body', e.target.value)}
            className="w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
          />
          <p className="mt-1 text-xs italic text-mist">
            Plain text for now — a rich-text editor (Tiptap, per the brief) is a
            follow-up upgrade to this same field.
          </p>
        </div>

        {error && <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <div className="flex gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('Draft')}
              className="rounded-sm border border-canopy px-5 py-2.5 text-sm font-semibold text-canopy hover:bg-canopy hover:text-white disabled:opacity-60"
            >
              Save Draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('Published')}
              className="rounded-sm bg-loam px-5 py-2.5 text-sm font-semibold text-white hover:bg-loam-dark disabled:opacity-60"
            >
              {values.status === 'Published' ? 'Update & Republish' : 'Publish'}
            </button>
          </div>
          {post && (
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="text-sm font-semibold text-red-700"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
