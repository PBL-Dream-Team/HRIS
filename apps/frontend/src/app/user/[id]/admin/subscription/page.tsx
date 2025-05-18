import { validateAccess } from '@/lib/validateAccess'
import SubscriptionClient from './client'

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { is_admin } = await validateAccess({
    requireAdmin: true,
    currentPathId: params.id,
    section: 'account',
  });

  return <SubscriptionClient isAdmin={is_admin} />;
}

