import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function redirectAfterLogin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    redirect('/signin');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      is_admin: boolean;
      company_id: string;
      company_subs_id?: string | null;
    };
  } catch (err) {
    console.error('Invalid token during login redirect:', err);
    redirect('/signin');
  }
  // console.log('Decoded JWT:', decoded);

  const { sub, is_admin, company_subs_id } = decoded;

  if (!company_subs_id) {
    redirect('/pricing');
  }

  const role = is_admin ? 'admin' : 'employee';
  const target = `/user/${sub}/${role}/dashboard`;

  redirect(target);
}
