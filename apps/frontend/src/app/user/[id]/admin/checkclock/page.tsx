import { validateAccess } from '@/lib/validateAccess'
import CheckClockClient from './client'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await validateAccess({ requireAdmin: true, currentPathId: resolvedParams.id, section: 'checkclock' });

  return <CheckClockClient />;
}