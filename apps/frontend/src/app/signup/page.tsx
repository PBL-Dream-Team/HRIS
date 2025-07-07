'use client';

import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import TermsOfUse from '@/components/terms-of-use';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Phone, Eye, EyeOff } from 'lucide-react';

export default function HrSignUpPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate company name length
    if (formData.name.length < 3 || formData.name.length > 50) {
      toast.error('Company name must be between 3 and 50 characters long');
      setIsLoading(false);
      return;
    }

    // Validate first name length
    if (formData.first_name.length < 2 || formData.first_name.length > 30) {
      toast.error('First name must be between 2 and 30 characters long');
      setIsLoading(false);
      return;
    }

    // Validate last name length
    if (formData.last_name.length < 2 || formData.last_name.length > 30) {
      toast.error('Last name must be between 2 and 30 characters long');
      setIsLoading(false);
      return;
    }

    // Validate phone length
    if (formData.phone.length < 10 || formData.phone.length > 15) {
      toast.error('Phone number must be between 10 and 15 digits');
      setIsLoading(false);
      return;
    }
    
    // Validate email format
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Validate password and confirm password
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }
    // Validate password length
    if (formData.password && (formData.password.length < 6 || formData.password.length > 20)) {
      toast.error('Password must be between 6 and 20 characters long');
      setIsLoading(false);
      return;
    }
    // Password validation: must contain uppercase, lowercase, number, and symbol
    if (formData.password) {
      if (!/^[a-zA-Z0-9!@#$%^&*()_+={}[\]:;"'<>,.?/\\|-]+$/.test(formData.password)) {
        toast.error('Password can only contain alphanumeric characters and special symbols !@#$%^&*()_+={}[\\]:;"\'<>,.?/\\|-');
        setIsLoading(false);
        return;
      }
      if (!/[A-Z]/.test(formData.password)) {
        toast.error('Password must contain at least one uppercase letter');
        setIsLoading(false);
        return;
      }
      if (!/[a-z]/.test(formData.password)) {
        toast.error('Password must contain at least one lowercase letter');
        setIsLoading(false);
        return;
      }
      if (!/[0-9]/.test(formData.password)) {
        toast.error('Password must contain at least one number');
        setIsLoading(false);
        return;
      }
      if (!/[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|-]/.test(formData.password)) {
        toast.error('Password must contain at least one special symbol');
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await api.post('/api/auth/signup', {
        name: formData.name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      if (res.data.statusCode === 409) {
        toast.error(res.data.message || 'Email already in use');
        return;
      }

      if (res.data.statusCode === 201) {
        toast.success(res.data.message || 'Sign up successful!');
        router.push('/signin');
      } else {
        toast.error(res.data.message || 'Sign up failed. Please try again.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Sign up failed. Please check your credentials and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (response: any) => {
        const idToken = response.credential;

        try {
          const res = await api.post('/api/auth/google', { idToken });

          toast.success(res.data.message || 'Sign up with Google successful!');
          router.push('/redirect');
        } catch (error) {
          console.error('Google sign-up error:', error);
          toast.error('Sign up with Google failed');
        }
      },
    });

    google.accounts.id.prompt(); // Menampilkan popup Google login
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center relative">
        <Image
          src="https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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

          <h2 className="text-2xl font-bold mb-2 text-[#1E3A5F]">Sign Up</h2>
          <p className="mb-6 text-gray-600 text-sm">
            Create your account and streamline your employee management.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="w-full">
              <Label htmlFor="name" className="text-[#1E3A5F] mb-2">
                Company Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your company name"
                className="text-gray-700 border-zinc-600"
              />
            </div>
            {/* First and Last Name */}
            <div className="flex gap-4">
              <div className="w-full">
                <Label htmlFor="first_name" className="text-[#1E3A5F] mb-2">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => {
                    // Only allow letters (including spaces)
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setFormData((prev) => ({ ...prev, first_name: value }));
                  }}
                  placeholder="Enter your first name"
                  className="text-gray-700 border-zinc-600"
                />
              </div>

              <div className="w-full">
                <Label htmlFor="last_name" className="text-[#1E3A5F] mb-2">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => {
                    // Only allow letters (including spaces)
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setFormData((prev) => ({ ...prev, last_name: value }));
                  }}
                  placeholder="Enter your last name"
                  className="text-gray-700 border-zinc-600"
                />
              </div>
            </div>

            {/* Email */}
            <div className="w-full">
              <Label htmlFor="email" className="text-[#1E3A5F] mb-2">
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email address"
                className="text-gray-700 border-zinc-600"
              />
            </div>

            {/* Phone */}
            <div className="w-full">
              <Label htmlFor="phone" className="text-[#1E3A5F] mb-2">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData((prev) => ({ ...prev, phone: value }));
                }}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter your phone number"
                className="text-gray-700 border-zinc-600"
              />
            </div>

            {/* Password */}
            <div className="w-full">
              <Label htmlFor="password" className="text-[#1E3A5F] mb-2">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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

            {/* Confirm Password */}
            <div className="w-full">
              <Label htmlFor="confirmPassword" className="text-[#1E3A5F] mb-2">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  className="text-gray-700 border-zinc-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2 text-sm">
              <Checkbox
                id="terms"
                checked={checked}
                onCheckedChange={(val) => setChecked(Boolean(val))}
                className="data-[state=checked]:bg-[#1E3A5F] data-[state=checked]:border-[#1E3A5F]"
              />{' '}
              <span>I agree with the</span>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-sm text-gray-700 underline"
                  >
                    terms of use of HRIS
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-scroll">
                  <TermsOfUse />
                </DialogContent>
              </Dialog>
            </div>

            {/* Buttons */}
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-[#1E3A5F]"
              disabled={!checked || isLoading}
            >
              {isLoading ? 'Loading...' : 'Sign Up'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={handleGoogleSignup}
            >
              <Image
                src="/images/google.png"
                alt="Google"
                width={20}
                height={20}
                className="object-contain"
              />
              <span>Sign up with Google</span>
            </Button>

            {/* Link to Sign In */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link href="/signin" className="text-[#1E3A5F] hover:underline">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
