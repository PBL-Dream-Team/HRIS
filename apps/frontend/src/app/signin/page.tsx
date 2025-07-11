'use client';

import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function HrLoginPage() {
  const [checked, setChecked] = useState(false);
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleGoogleSignin = () => {
    setIsGoogleLoading(true);
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (response: any) => {
        const idToken = response.credential;

        try {
          const res = await api.post('/api/auth/google', { idToken });

          toast.success(res.data.message || 'Sign in with Google successful!');
          router.push('/redirect');
        } catch (error) {
          console.error('Google sign-in error:', error);
          toast.error('Sign in with Google failed');
        }
      },
    });

    google.accounts.id.prompt(); // tampilkan popup login Google
  };
  
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    // Validate email format
    if (input && (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(input))) {
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Check if input is empty
    if (!input.trim()) {
      toast.error('Please enter your email address');
      setIsLoading(false);
      return;
    }

    // Check if password is empty
    if (!password.trim()) {
      toast.error('Please enter your password');
      setIsLoading(false);
      return;
    }

    try {
      await api.post(
        '/api/auth/signin/email',
        {
          input,
          password,
        },
        { withCredentials: true },
      );
      toast.success('Login successful!');
      router.push('/redirect');
    } catch (error: any) {
      // console.error(error);
      if (error?.response?.status === 401) {
        toast.error('Password incorrect.');
      } else if (error?.response?.status === 403) {
        toast.error('Your account is not active.');
      } else if (error?.response?.status === 404) {
        toast.error('Account not found. Please check your email or register first.');
      } else {
        toast.error('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center relative">
        <Image
          src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Office"
          fill
          className="object-cover"
        />
        {/* Overlay transparan biru */}
        <div className="absolute inset-0 bg-[#1E3A5F] opacity-60 z-10" />
      </div>

      {/* Right Side - Form */}
      <div className="bg-white flex flex-col justify-center w-full md:w-1/2 p-8">
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Image
              src="/images/logo.png"
              alt="HRIS Logo"
              width={100}
              height={48}
              className="object-contain"
            />
          </div>

          <h2 className="text-2xl font-bold mb-2 text-zinc-950">Sign In</h2>
          <p className="mb-6 text-gray-600 text-sm">
            Welcome back to HRIS cmlabs! Manage everything with ease.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1E3A5F]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="text-gray-700 border-zinc-600"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1E3A5F]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-gray-700 border-zinc-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={checked}
                  onCheckedChange={(value) => setChecked(!!value)}
                  className="data-[state=checked]:bg-[#1E3A5F] data-[state=checked]:border-[#1E3A5F]"
                />
                <Label htmlFor="remember" className="text-sm text-gray-700">
                  Remember Me
                </Label>
              </div>
              <Link href="/forgot-password">
                <span className="text-sm text-[#1E3A5F] hover:underline">
                  Forgot Password?
                </span>
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1E3A5F] hover:bg-[#1E3A5F]/90"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                'Loading...'
              ) : (
                <>
                  <Image
                    src="/images/google.png"
                    alt="Google"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span>Sign in with Google</span>
                </>
              )}
            </Button>

            <Link href="/signin/employee" passHref>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                Sign in as Employee
              </Button>
            </Link>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don’t have an account yet?{' '}
              <Link href="/signup">
                <span className="text-[#1E3A5F] hover:underline">
                  Sign up now and get started
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
