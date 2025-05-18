import { validateAccess } from '@/lib/validateAccess'
import LettersClient from './client'

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { is_admin } = await validateAccess({
    requireAdmin: false,
    currentPathId: params.id,
    section: 'letters',
  });

  return <LettersClient isAdmin={is_admin} />;
}

