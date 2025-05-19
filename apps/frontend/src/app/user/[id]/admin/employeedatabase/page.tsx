import { validateAccess } from '@/lib/validateAccess';
import EmployeeDatabaseClient from './client';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { sub, is_admin, company_id } = await validateAccess({
    requireAdmin: true,
    currentPathId: params.id,
    section: 'employeedatabase',
  });

  return (
    <EmployeeDatabaseClient
      isAdmin={is_admin}
      userId={sub}
      companyId={company_id}
    />
  );
}