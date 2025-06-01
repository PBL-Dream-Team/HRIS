'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SetNewPasswordForm from '@/components/forgotpassword/set-password';
import api from '@/lib/axios';
import { Loader } from 'lucide-react';
import LinkExpired from '@/components/forgotpassword/link-expired';

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<'checking' | 'valid' | 'invalid'>(
    'checking',
  );
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    api
      .get(`/api/auth/reset-password`, { params: { token } })
      .then(() => setStatus('valid'))
      .catch(() => setStatus('invalid'));
  }, [token]);

  if (status === 'checking') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin w-6 h-6" />
        <span className="ml-2">Validating token...</span>
      </div>
    );
  }

  if (status === 'invalid') {
    return <LinkExpired />;
  }

  return <SetNewPasswordForm token={token!} />;
}
