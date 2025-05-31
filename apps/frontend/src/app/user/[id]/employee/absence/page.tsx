import { validateAccess } from '@/lib/validateAccess';
import AbsenceClient from './client';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { sub, is_admin, company_id } = await validateAccess({
    requireAdmin: false,
    currentPathId: params.id,
    section: 'absence',
  });

  return (
    <AbsenceClient
      isAdmin={is_admin}
      userId={sub}
      companyId={company_id}
    />
  );
}