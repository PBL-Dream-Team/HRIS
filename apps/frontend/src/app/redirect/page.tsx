import { redirectAfterLogin } from '@/lib/redirect';

export default async function RedirectPage() {
  await redirectAfterLogin();
  return null;
}