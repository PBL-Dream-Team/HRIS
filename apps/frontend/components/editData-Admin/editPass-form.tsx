'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type EditPasswordProps = {
  userId: string;
  onSuccess?: () => void;
  onClose?: () => void;
};

export function EditPassword({
  userId,
  onSuccess,
  onClose
}: EditPasswordProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        new_password: formData.newPassword
      });

      toast.success('Password updated successfully!');
      
      // Reset form
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
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
        <Label htmlFor="oldPassword">Current Password</Label>
        <Input
          id="oldPassword"
          type="password"
          value={formData.oldPassword}
          onChange={handleChange}
          placeholder="Enter current password"
          required
          className="text-gray-700 border-zinc-600"
        />
      </div>

      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          required
          minLength={8}
          className="text-gray-700 border-zinc-600"
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          required
          className="text-gray-700 border-zinc-600"
        />
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