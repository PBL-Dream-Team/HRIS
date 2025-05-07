"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function HrLoginPage() {
  
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center">
        <img src="/signup-image.png" alt="Signup" className="object-cover h-full" />
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
                    <span className="text-sm font-medium text-blue-900 hover:underline">
                        Try For Free!
                    </span>
                </Link>
            </div>

            <h2 className="text-2xl font-bold mb-2 text-zinc-950">Sign In</h2>
            <p className="mb-6 text-gray-600 text-sm">
                Welcome back to HRIS cmlabs! Manage everything with ease.
            </p>

            <form className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-blue-900">
                        Email or Phone Number
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email or phone number"
                        className="text-gray-700 border-zinc-600"
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
                        placeholder="Enter your password"
                        className="text-gray-700 border-zinc-600"
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

                <Button type="submit" className="w-full bg-[#1E3A5F] hover:bg-[#1E3A5F]/90">
                    Sign In
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
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

                <Link href="/employeelogin" passHref>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                    >
                        Sign in with ID Employee
                    </Button>
                </Link>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Don’t have an account yet?{" "}
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
