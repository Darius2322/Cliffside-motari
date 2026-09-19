import { listGalleryImages } from '@/lib/actions/admin-gallery';
import GalleryUploadForm from '@/components/admin/GalleryUploadForm';
import GalleryAdminGrid from '@/components/admin/GalleryAdminGrid';

export default async function AdminGalleryPage() {
  const images = await listGalleryImages();

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl font-semibold text-canopy">Gallery</h1>
      <GalleryUploadForm />
      <GalleryAdminGrid images={images} />
    </div>
  );
}
