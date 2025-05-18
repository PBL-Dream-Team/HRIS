import { validateAccess } from '@/lib/validateAccess';
import DashboardClient from './client';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { is_admin } = await validateAccess({
    requireAdmin: false,
    currentPathId: params.id,
    section: 'dashboard',
  });

  return <DashboardClient isAdmin={is_admin} />;
}
