import { validateAccess } from '@/lib/validateAccess';
import AccountClient from './client';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { sub, is_admin, company_id } = await validateAccess({
    requireAdmin: false,
    currentPathId: params.id,
    section: 'account',
  });

  return (
    <AccountClient
      isAdmin={is_admin}
      userId={sub}
      companyId={company_id}
    />
  );
}