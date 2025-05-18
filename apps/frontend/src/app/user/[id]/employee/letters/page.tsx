import { validateAccess } from '@/lib/validateAccess'
import LettersClient from './client'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await validateAccess({ requireAdmin: false, currentPathId: resolvedParams.id, section: 'letters' });

  return <LettersClient />;
}
