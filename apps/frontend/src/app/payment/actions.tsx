'use server';

import { getDecodedToken } from '@/lib/auth';

export async function getCompanyIdFromToken() {
  const token = await getDecodedToken();
  return token?.company_id ?? null;
}
