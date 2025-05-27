'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SetNewPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isPasswordValid = password.length >= 8;
  const isMatching = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isMatching) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await api.post('/api/auth/reset-password', {
        token,
        new_password: password
      });

      setSuccess(res.data.message || "Password reset successful!");
      setTimeout(() => router.push('/signin'), 500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="flex min-h-screen">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 border-[#1E3A5F] my-2"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>
              {!isPasswordValid && password && (
                <p className="text-red-500 text-sm">Must be at least 8 characters</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10 border-[#1E3A5F] my-2"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>
              {confirmPassword && !isMatching && (
                <p className="text-red-500 text-sm">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1E3A5F] hover:bg-[#1E3A5F]/90"
              disabled={!isPasswordValid || !isMatching}
            >
              Reset password
            </Button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}
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
