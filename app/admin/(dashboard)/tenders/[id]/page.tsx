import { notFound } from 'next/navigation';
import TenderForm from '@/components/admin/TenderForm';
import { getTender } from '@/lib/actions/admin-tenders';

export default async function EditTenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tender = await getTender(id);
  if (!tender) notFound();

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl font-semibold text-canopy">Edit Tender</h1>
      <TenderForm tender={tender} />
    </div>
  );
}
