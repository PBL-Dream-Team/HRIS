'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
// import { FiCheckCircle } from "react-icons/fi";
import { FaCheck } from 'react-icons/fa';

export default function ResetSuccess() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Message Content */}
      <div className="bg-white flex flex-col justify-center w-full md:w-1/2 p-8">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="bg-[#1E3A5F] p-4 rounded-full inline-block">
              <FaCheck className="text-white text-3xl" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-zinc-950">
              Your password has been successfully reset
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              You can log in with your new password. If you encounter any
              issues, please contact support!
            </p>
          </div>

          {/* Back to Login Button */}
          <Button asChild className="w-full bg-[#1E3A5F] hover:bg-[#1E3A5F]/90">
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* Right Side - Image */}
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
    </div>
  );
}
