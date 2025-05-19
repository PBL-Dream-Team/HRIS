import { validateAccess } from '@/lib/validateAccess';
import CheckClockClient from './client';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { sub, is_admin, company_id } = await validateAccess({
    requireAdmin: true,
    currentPathId: params.id,
    section: 'checkclock',
  });

  return (
    <CheckClockClient
      isAdmin={is_admin}
      userId={sub}
      companyId={company_id}
    />
  );
}