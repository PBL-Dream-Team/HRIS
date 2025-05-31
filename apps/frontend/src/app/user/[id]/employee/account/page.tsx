import { validateAccess } from '@/lib/validateAccess';
import AccountClient from './client';
import api from '@/lib/axios';
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const { sub, is_admin, company_id } = await validateAccess({
    requireAdmin: false,
    currentPathId: id,
    section: 'account',
  });

  // Fetch employee data di server side
  const employeeData = await api.get(`/api/employee/${sub}`)
    .then(res => res.data)
    .catch(() => null);

  return (
    <AccountClient
      isAdmin={is_admin}
      userId={sub}
      companyId={company_id}
      initialData={employeeData?.data} // Kirim data ke client
    />
  );
}