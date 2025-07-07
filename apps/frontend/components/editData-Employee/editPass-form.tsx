'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

type EditPasswordProps = {
  userId: string;
  onSuccess?: () => void;
  onClose?: () => void;
};

export function EditPassword({
  userId,
  onSuccess,
  onClose,
}: EditPasswordProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State untuk visibility password
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Function untuk toggle visibility password
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!formData.oldPassword) {
      toast.error('Current password is required');
      return;
    }
    if (formData.oldPassword.length < 8) {
      toast.error('Current password must be at least 8 characters');
      return;
    }
    if (!formData.newPassword) {
      toast.error('New password is required');
      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (formData.oldPassword === formData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }
    if (!formData.confirmPassword) {
      toast.error('Please input your password again');
      return;
    }

    // Validate password length
    if (formData.newPassword && (formData.newPassword.length < 6 || formData.newPassword.length > 20)) {
      toast.error('New password must be between 6 and 20 characters long');
      return;
    }
    // Password validation: must contain uppercase, lowercase, number, and symbol
    if (formData.newPassword) {
      if (!/^[a-zA-Z0-9!@#$%^&*()_+={}[\]:;"'<>,.?/\\|-]+$/.test(formData.newPassword)) {
        toast.error('New password can only contain alphanumeric characters and special symbols !@#$%^&*()_+={}[\\]:;"\'<>,.?/\\|-');
        return;
      }
      if (!/[A-Z]/.test(formData.newPassword)) {
        toast.error('New password must contain at least one uppercase letter');
        return;
      }
      if (!/[a-z]/.test(formData.newPassword)) {
        toast.error('New password must contain at least one lowercase letter');
        return;
      }
      if (!/[0-9]/.test(formData.newPassword)) {
        toast.error('New password must contain at least one number');
        return;
      }
      if (!/[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|-]/.test(formData.newPassword)) {
        toast.error('New password must contain at least one special symbol');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Validasi password baru dan konfirmasi password
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New password and confirmation do not match');
        return;
      }

      // Kirim data ke API endpoint
      const res = await api.patch(`/api/employee/${userId}/password`, {
        old_password: formData.oldPassword,
        new_password: formData.newPassword,
      });

      toast.success('Password updated successfully!');

      // Reset form
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Reset password visibility
      setShowPasswords({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
      });

      // Panggil callback functions
      onClose?.();
      onSuccess?.();
      router.refresh();
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <Label htmlFor="oldPassword">
          Current Password
          <span className='text-red-600'> *</span>
        </Label>
        <div className='relative'>
          <Input
            id="oldPassword"
            type={showPasswords.oldPassword ? 'text' : 'password'}
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            className="text-gray-700 border-zinc-600 pr-10"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('oldPassword')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPasswords.oldPassword ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="newPassword">
          New Password
          <span className='text-red-600'> *</span>
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPasswords.newPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            minLength={8}
            className="text-gray-700 border-zinc-600 pr-10"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('newPassword')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPasswords.newPassword ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword">
          Confirm New Password
          <span className='text-red-600'> *</span>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showPasswords.confirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className="text-gray-700 border-zinc-600 pr-10"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirmPassword')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPasswords.confirmPassword ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:justify-end mt-4">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-zinc-600"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#1E3A5F] hover:bg-[#1E3A5F]/90"
        >
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </Button>
      </DialogFooter>
    </form>
  );
}
