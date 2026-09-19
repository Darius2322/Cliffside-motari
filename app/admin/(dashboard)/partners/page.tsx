import { listPartners } from '@/lib/actions/admin-partners';
import AdminPartnersClient from '@/components/admin/AdminPartnersClient';

export default async function AdminPartnersPage() {
  const partners = await listPartners();

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl font-semibold text-canopy">Partners</h1>
      <AdminPartnersClient initialPartners={partners} />
    </div>
  );
}
