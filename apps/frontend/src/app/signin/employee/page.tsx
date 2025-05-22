'use client';

import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { AlertDestructive } from '@/components/alert/error';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function HrLoginPage() {
  const [checked, setChecked] = useState(false);
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await api.post(
        '/api/auth/signin/email',
        {
          input,
          password,
        },
        { withCredentials: true },
      );

      router.push('/redirect');
    } catch (error) {
      console.error(error);
      <AlertDestructive />;
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center relative">
        <Image
          src="/images/office2.jpg"
          alt="Office"
          width={800}
          height={600}
          className="object-cover w-full h-full"
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
            <Link href="/pricing">
              <span className="text-sm font-medium text-[#1E3A5F] hover:underline">
                Try For Free!
              </span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-[#1E3A5F]">Sign In</h2>
          <p className="mb-6 text-gray-600 text-sm">
            Welcome back to HRIS cmlabs! Manage everything with ease.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* ID Employee */}
            <div className="space-y-2">
              <Label htmlFor="id-employee" className="text-[#1E3A5F]">
                Email Employee
              </Label>
              <Input
                id="input"
                type="email"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your ID Employee"
                className="text-gray-700 border-[#1E3A5F]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1E3A5F]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="text-gray-700 border-[#1E3A5F]"
              />
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

            {/* Buttons */}
            <Button
              type="submit"
              className="w-full bg-[#1E3A5F] hover:bg-blue-500"
            >
              Sign In
            </Button>

            <Link href="/signin" passHref>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                Sign in with Another Method
              </Button>
            </Link>

            {/* <p className="text-center text-sm text-gray-600 mt-4">
                    Don’t have an account yet?{" "}
                    <Link href="/signup">
                        <span className="text-[#1E3A5F] hover:underline">
                            Sign up now and get started
                        </span>
                    </Link>
                </p> */}
          </form>
        </div>
      </div>
    </div>
  );
}
