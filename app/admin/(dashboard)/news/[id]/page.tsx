import { notFound } from 'next/navigation';
import NewsForm from '@/components/admin/NewsForm';
import { getNewsById } from '@/lib/actions/admin-news';

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getNewsById(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl font-semibold text-canopy">Edit Post</h1>
      <NewsForm post={post} />
    </div>
  );
}
