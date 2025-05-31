import { validateAccess } from '@/lib/validateAccess';
import SubscriptionEndedClient from './client';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { is_admin } = await validateAccess({
    requireAdmin: false,
    currentPathId: params.id,
    section: 'subscriptionended',
  });

  return <SubscriptionEndedClient isAdmin={is_admin} />;
}
