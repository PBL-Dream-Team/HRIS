import React from 'react'
import CheckEmail from '@/components/check-email'

export default function page() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
        {/* Left Side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* Component */}
            <CheckEmail />
          </div>
        </div>
      </div>

        {/* Right Side - Image */}
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
