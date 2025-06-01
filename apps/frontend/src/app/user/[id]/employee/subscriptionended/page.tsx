import { validateAccess } from '@/lib/validateAccess';
import SubscriptionEndedClient from './client';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const { is_admin } = await validateAccess({
    requireAdmin: false,
    currentPathId: id,
    section: 'letters',
  });

  return <SubscriptionEndedClient isAdmin={is_admin} />;
}
