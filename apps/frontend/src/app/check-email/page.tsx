'use client';
import React from 'react';
import CheckEmail from '@/components/check-email';
import Image from 'next/image';

export default function LinkExpiredPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Message Content */}
      <div className="bg-white flex flex-col justify-center w-full md:w-1/2 p-8">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <CheckEmail />
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center relative">
        <Image
          src="https://images.unsplash.com/photo-1631193816258-28b44b21e78b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
