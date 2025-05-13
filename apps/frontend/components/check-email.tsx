import React from 'react'

import { Mail } from 'lucide-react'

import { LuArrowLeft } from "react-icons/lu"

import { Button } from '@/components/ui/button'

export default function CheckEmail() {
  return (
    <div>
      <div className='justify-center flex flex-col items-center gap-2 pb-7'>
        <Mail className="size-20" />
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p className='text-center text-muted-foreground text-sm'>
            We sent a password reset link to your email (uremail@gmail.com)
            which valid for 24 hours after receives the email. Please check your inbox!
        </p>
      </div>
      <div>
        <Button type="submit" className="w-full mb-4">
          Open Gmail
        </Button>
        <a className="flex items-center place-content-center" href=''>
            <LuArrowLeft/>
            <span className="relative z-10 px-2 flex-row col-span-2">
                Back to Log-in
            </span>
        </a>
      </div>
    </div>
  )
}
