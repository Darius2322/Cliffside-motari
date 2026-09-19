'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteGalleryImage, type AdminGalleryImage } from '@/lib/actions/admin-gallery';

export default function GalleryAdminGrid({ images }: { images: AdminGalleryImage[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (image: AdminGalleryImage) => {
    if (!confirm('Delete this photo permanently?')) return;
    setDeletingId(image.id);
    await deleteGalleryImage(image.id, image.storage_path);
    setDeletingId(null);
    router.refresh();
  };

  if (images.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-border bg-surface p-8 text-center text-sm text-mist">
        No photos uploaded yet — the public gallery is showing the original
        launch photos as a fallback until you upload some here.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <div key={image.id} className="group relative overflow-hidden rounded-sm border border-border bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.publicUrl} alt={image.alt_text} className="aspect-square w-full object-cover" />
          <button
            onClick={() => handleDelete(image)}
            disabled={deletingId === image.id}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-60"
            aria-label="Delete photo"
          >
            <Trash2 size={15} />
          </button>
          <div className="p-2">
            <p className="truncate text-xs text-mist">{image.alt_text}</p>
            {image.category && <p className="text-xs font-semibold text-loam">{image.category}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
