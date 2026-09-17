'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

type Image = { src: string; alt: string };

export default function GalleryGrid({ images }: { images: Image[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightboxImage, setLightboxImage] = useState<Image | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(container.children) as HTMLElement[];

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [images]);

  useEffect(() => {
    if (!lightboxImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxImage]);

  return (
    <>
      <div ref={containerRef} className="masonry">
        {images.map((image, i) => (
          <button
            key={image.src + i}
            type="button"
            onClick={() => setLightboxImage(image)}
            className="reveal block w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="w-full rounded-sm"
            />
          </button>
        ))}
      </div>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#141a16]/95 p-6"
          onClick={() => setLightboxImage(null)}
        >
          <button
            aria-label="Close"
            className="absolute right-6 top-6 text-white"
            onClick={() => setLightboxImage(null)}
          >
            <X size={32} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            className="max-h-[86vh] max-w-[92vw] rounded-sm object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
