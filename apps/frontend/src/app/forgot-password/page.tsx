"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { FiMail } from "react-icons/fi";
import { LuMailX } from "react-icons/lu";
import { ForgotPwrdEmailForm } from '@/components/forgotpwrd-askemail';

export default function LinkExpiredPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Message Content */}
      <div className="bg-white flex flex-col justify-center w-full md:w-1/2 p-8">
       <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <ForgotPwrdEmailForm />
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center relative">
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
    </div>
  );
}
