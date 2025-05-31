import { validateAccess } from '@/lib/validateAccess';
import EmployeeDatabaseClient from './client';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const { sub, is_admin, company_id } = await validateAccess({
    requireAdmin: true,
    currentPathId: id,
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
