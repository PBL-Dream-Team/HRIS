import { validateAccess } from '@/lib/validateAccess'
import CheckClockClient from './client'

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { is_admin } = await validateAccess({
    requireAdmin: true,
    currentPathId: params.id,
    section: 'checkclock',
  });

  return <CheckClockClient isAdmin={is_admin} />;
}