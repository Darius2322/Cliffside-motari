'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import { uploadGalleryImage } from '@/lib/actions/admin-gallery';
import { galleryCategories } from '@/lib/constants';

export default function GalleryUploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await uploadGalleryImage(formData);

    setUploading(false);

    if (!result.success) {
      setError(result.error ?? 'Upload failed.');
      return;
    }
    formRef.current?.reset();
    router.refresh();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mb-10 grid gap-4 rounded-sm border border-border bg-surface p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">Image</label>
        <input type="file" name="file" accept="image/*" required className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">Description (alt text)</label>
        <input type="text" name="altText" required placeholder="e.g. Grade 4 science fair" className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">Category</label>
        <select name="category" className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm">
          <option value="">None</option>
          {galleryCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={uploading}
        className="flex items-center justify-center gap-1.5 rounded-sm bg-loam px-5 py-2.5 text-sm font-semibold text-white hover:bg-loam-dark disabled:opacity-60 sm:col-span-3 sm:col-start-1 sm:w-fit"
      >
        <Upload size={16} /> {uploading ? 'Uploading…' : 'Upload Photo'}
      </button>
      {error && <p className="sm:col-span-3 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </form>
  );
}
