import type { Metadata } from 'next';
import GalleryGrid from '@/components/GalleryGrid';
import { galleryImages } from '@/lib/content';

export const metadata: Metadata = { title: 'Gallery' };

export default function GalleryPage() {
  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">GALLERY</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">
            Life at CMA
          </h1>
          <p className="max-w-xl text-mist">
            A look at campus life on the hills of Manga — tap any photo to view it
            full-screen.
          </p>
        </div>
      </div>

      <section className="bg-paper px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <GalleryGrid images={galleryImages} />
          <div className="mt-10 rounded-sm border border-dashed border-border bg-[#EFE8D8] p-4 text-sm italic text-mist">
            Album categories (School Life, Sports, Music, Graduation, etc.) will be
            added as more categorized photos are provided by the school administration.
          </div>
        </div>
      </section>
    </>
  );
}
