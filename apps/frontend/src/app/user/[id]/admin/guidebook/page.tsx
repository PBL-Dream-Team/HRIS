import { validateAccess } from '@/lib/validateAccess';
import GuideBookClient from './client';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { sub, is_admin, company_id } = await validateAccess({
    requireAdmin: true,
    currentPathId: params.id,
    section: 'guidebook',
  });

  return (
    <GuideBookClient
      isAdmin={is_admin}
      userId={sub}
      companyId={company_id}
    />
  );
}