'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LuArrowLeft } from "react-icons/lu";
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';

const COOLDOWN_KEY = 'forgot-password-cooldown-end';

export function ForgotPwrdEmailForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();

  // Check cooldown on initial load
  useEffect(() => {
    const stored = localStorage.getItem(COOLDOWN_KEY);
    if (stored) {
      const endsAt = parseInt(stored);
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endsAt - now) / 1000));
      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        localStorage.removeItem(COOLDOWN_KEY);
      }
    }
  }, []);

  // Countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            localStorage.removeItem(COOLDOWN_KEY);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      const statusCode = res.data.statusCode;

      if (res.status === 200 || res.status === 201) {
        if (statusCode === 404) {
          toast.error('Email not found');
        } else if (statusCode === 200) {
          toast.success('Reset link sent! Check your email.');
          const cooldownEnd = Date.now() + 60 * 1000;
          localStorage.setItem(COOLDOWN_KEY, cooldownEnd.toString());
          setCooldown(60);
        } else {
          toast.error('Unexpected response');
        }
      } else {
        toast.error('Something went wrong');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Unexpected error';
      toast.error(`Failed: ${msg}`);
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
          <Label htmlFor="email" className="text-[#1E3A5F]">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-gray-700 border-zinc-600"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || cooldown > 0}>
          {loading
            ? 'Sending...'
            : cooldown > 0
              ? `Wait ${cooldown}s`
              : 'Send Reset Link'}
        </Button>

        <button
          type="button"
          onClick={() => router.push('/signin')}
          className="flex items-center justify-center text-sm text-blue-600 hover:underline"
        >
          <LuArrowLeft className="text-[#1E3A5F]"/>
          <span className="text-sm text-[#1E3A5F] hover:underline ml-2">Back to Sign-in</span>
        </button>
      </div>
    </form>
  );
}
