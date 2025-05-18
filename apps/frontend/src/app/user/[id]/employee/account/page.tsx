import { validateAccess } from '@/lib/validateAccess'
import AccountClient from './client'

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { is_admin } = await validateAccess({
    requireAdmin: false,
    currentPathId: params.id,
    section: 'account',
  });

  return <AccountClient isAdmin={is_admin} />;
}

