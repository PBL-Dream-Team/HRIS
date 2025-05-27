'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LuArrowLeft } from "react-icons/lu";
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export function ForgotPwrdEmailForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const res = await api.post('/api/auth/forgot-password', { email });

      if (res.status === 200 || res.status === 201) {
        setStatus('✅ Reset link sent! Check your email.');
      } else {
        setStatus('❌ Something went wrong');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Unexpected error';
      setStatus(`❌ Failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground text-sm">
          No worries! Enter your email address below, and we'll send you a link to reset your password.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>

        {status && (
          <p className="text-center text-sm text-muted-foreground">{status}</p>
        )}

        <button
          type="button"
          onClick={() => router.push('/signin')}
          className="flex items-center justify-center text-sm text-blue-600 hover:underline"
        >
          <LuArrowLeft />
          <span className="ml-2">Back to Log-in</span>
        </button>
      </div>
    </form>
  );
}
