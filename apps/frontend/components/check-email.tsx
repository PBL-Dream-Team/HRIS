import React from 'react';

import { Mail } from 'lucide-react';

import { LuArrowLeft } from 'react-icons/lu';

import { Button } from '@/components/ui/button';

export default function CheckEmail() {
  return (
    <div>
      <div className="justify-center flex flex-col items-center gap-2 pb-7">
        <Mail className="size-20 text-[#1E3A5F]" />
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p className="text-center text-muted-foreground text-sm">
          We sent a password reset link to your email (uremail@gmail.com) which
          valid for 24 hours after receives the email. Please check your inbox!
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button type="submit" className="w-full">
          Open Gmail
        </Button>
        <div>
          <span>Don't receive the email?</span>{' '}
          <a href="">Click here to resend!</a>
        </div>
        <a className="flex items-center place-content-center" href="">
          <LuArrowLeft />
          <span className="relative z-10 px-2 flex-row col-span-2">
            Back to Log-in
          </span>
        </a>
      </div>
    </div>
  );
}
