import { validateAccess } from '@/lib/validateAccess';
import DashboardClient from './client';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const { sub, is_admin, company_id } = await validateAccess({
    requireAdmin: false,
    currentPathId: id,
    section: 'dashboard',
  });

  return (
    <DashboardClient isAdmin={is_admin} userId={sub} companyId={company_id} />
  );
}
