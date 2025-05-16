import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function redirectAfterLogin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('hris_jwt')?.value;

  if (!token) {
    redirect('/signin');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      isAdmin: boolean;
    };

    const { sub: userId, isAdmin } = decoded;

    const role = isAdmin ? 'admin' : 'employee';
    const target = `/user/${userId}/${role}/dashboard`;

    redirect(target);
  } catch (err) {
    console.error('Invalid token during login redirect:', err);
    redirect('/signin');
  }
}
