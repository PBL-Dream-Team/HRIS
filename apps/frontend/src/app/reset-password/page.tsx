'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SetNewPasswordForm from '@/components/forgotpassword/set-password';
import api from '@/lib/axios';
import { Loader } from 'lucide-react';
import LinkExpired from '@/components/forgotpassword/link-expired';

function ResetPasswordContent() {
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader className="animate-spin w-6 h-6" />
          <span className="ml-2">Loading...</span>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
