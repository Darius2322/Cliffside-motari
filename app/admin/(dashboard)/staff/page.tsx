import { listStaff } from '@/lib/actions/admin-staff';
import AdminStaffClient from '@/components/admin/AdminStaffClient';

export default async function AdminStaffPage() {
  const staff = await listStaff();

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl font-semibold text-canopy">Staff &amp; Leadership</h1>
      <AdminStaffClient initialStaff={staff} />
    </div>
  );
}
