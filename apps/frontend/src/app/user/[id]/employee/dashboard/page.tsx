import { validateAccess } from '@/lib/validateAccess';
import DashboardClient from './client';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { sub, is_admin, company_id } = await validateAccess({
    requireAdmin: false,
    currentPathId: params.id,
    section: 'dashboard',
  });

  return (
    <DashboardClient
      isAdmin={is_admin}
      userId={sub}
      companyId={company_id}
    />
  );
}