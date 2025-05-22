"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SetNewPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordValid = password.length >= 8;
  const isMatching = password === confirmPassword;

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="bg-white flex flex-col justify-center w-full md:w-1/2 p-8">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-center text-zinc-950">
              Set new password
            </h2>
            <p className="text-sm text-center text-gray-600 mt-2">
              Enter your new password below to complete the reset process.
              <br />
              Ensure it’s strong and secure
            </p>
          </div>

          <form className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pr-10 border-[#1E3A5F] my-2"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>
              {!isPasswordValid && password !== "" && (
                <p className="text-red-500 text-sm">
                  Must be at least 8 characters
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password again"
                  className="pr-10 border-[#1E3A5F] my-2"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>
              {confirmPassword !== "" && !isMatching && (
                <p className="text-red-500 text-sm">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#1E3A5F] hover:bg-[#1E3A5F]/90"
              disabled={!isPasswordValid || !isMatching}
            >
              Reset password
            </Button>

            {/* Back to login */}
            <div className="text-center mt-4">
              <Link
                href="/signup"
                className="text-sm text-[#1E3A5F] hover:underline inline-flex items-center gap-1"
              >
                ← Back to log in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
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

    </div>
  );
}
