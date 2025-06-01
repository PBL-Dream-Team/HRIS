'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type EditWfaProps = {
  companyId: string;
  onSuccess?: () => void;
  onClose?: () => void;
};

export function EditWfa({ companyId, onSuccess, onClose }: EditWfaProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validasi password baru dan konfirmasi password

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
        <Label htmlFor="oldPassword">Clock In Default</Label>
        <Input
          id="clockIn"
          //   value={}
          //   onChange={handleChange}
          placeholder="Clock In Default"
          required
        />
      </div>

      <div>
        <Label htmlFor="oldPassword">Clock In Default</Label>
        <Input
          id="clockIn"
          //   value={}
          //   onChange={handleChange}
          placeholder="Clock In Default"
          required
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
