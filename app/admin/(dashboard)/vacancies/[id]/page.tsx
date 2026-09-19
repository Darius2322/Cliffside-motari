import { notFound } from 'next/navigation';
import VacancyForm from '@/components/admin/VacancyForm';
import { getVacancy } from '@/lib/actions/admin-vacancies';

export default async function EditVacancyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vacancy = await getVacancy(id);
  if (!vacancy) notFound();

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl font-semibold text-canopy">Edit Vacancy</h1>
      <VacancyForm vacancy={vacancy} />
    </div>
  );
}
