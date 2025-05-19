import { validateAccess } from '@/lib/validateAccess';
import SubscriptionClient from './client';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { sub, is_admin, company_id } = await validateAccess({
    requireAdmin: true,
    currentPathId: params.id,
    section: 'subscription',
  });

  return (
    <SubscriptionClient
      isAdmin={is_admin}
      userId={sub}
      companyId={company_id}
    />
  );
}