import { validateAccess } from '@/lib/validateAccess';
import AccountClient from './client';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const { sub, is_admin, company_id } = await validateAccess({
    requireAdmin: true,
    currentPathId: id,
    section: 'account',
  });

  return (
    <AccountClient isAdmin={is_admin} userId={sub} companyId={company_id} />
  );
}
