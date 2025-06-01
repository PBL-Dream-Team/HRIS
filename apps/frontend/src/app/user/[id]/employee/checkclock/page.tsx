import { validateAccess } from '@/lib/validateAccess';
import CheckClockClient from './client';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const { sub, is_admin, company_id } = await validateAccess({
    requireAdmin: false,
    currentPathId: id,
    section: 'checkclock',
  });

  return (
    <CheckClockClient isAdmin={is_admin} userId={sub} companyId={company_id} />
  );
}
