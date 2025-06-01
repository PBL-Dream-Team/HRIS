// lib/auth.ts
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getDecodedToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      is_admin: boolean;
      company_id: string;
      company_subs_id?: string | null;
    };

    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}
