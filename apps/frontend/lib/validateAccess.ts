import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET!;

type ValidateAccessOptions = {
  requireAdmin: boolean;
  currentPathId: string;
  section?: string;
};

export async function validateAccess({
  requireAdmin,
  currentPathId,
  section,
}: ValidateAccessOptions) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    redirect(requireAdmin ? '/signin' : '/signin/employee');
  }

  let decoded: {
    sub: string;
    is_admin: boolean;
    company_id: string;
  };

  try {
    decoded = jwt.verify(token, JWT_SECRET) as typeof decoded;
  } catch (err) {
    console.error('Invalid token format:', err);
    redirect(requireAdmin ? '/signin' : '/signin/employee');
  }

  const { sub, is_admin } = decoded;

  const expectedPath = section
    ? `/user/${sub}/${is_admin ? 'admin' : 'employee'}/${section}`
    : `/user/${sub}/${is_admin ? 'admin' : 'employee'}/dashboard`;

  // Redirect jika ID tidak cocok
  if (currentPathId !== sub) {
    return redirect(expectedPath);
  }

  // Redirect jika role tidak sesuai dengan page
  if ((requireAdmin && !is_admin) || (!requireAdmin && is_admin)) {
    return redirect(expectedPath);
  }

  return { sub, is_admin };
}
