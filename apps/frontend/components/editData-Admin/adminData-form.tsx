'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { on } from 'events';
import { Upload } from 'lucide-react';

type AdminEditDataFormProps = {
  userId: string;
  initialData?: {
    id: string;
    first_name: string; 
    last_name: string;
    email: string;
    phone: string;
    pict_dir?: string; // Optional, in case the user doesn't have an avatar
  };
  onSuccess?: () => void;
  onClose?: () => void;
};

export function AdminEditDataForm({
  userId,
  initialData,
  onSuccess,
  onClose
}: AdminEditDataFormProps) {
  const router = useRouter();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [first_name, setFirstName] = useState<string>('');
  const [last_name, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  useEffect(() => {
    if (initialData) {
        setFirstName(initialData.first_name || '');
        setLastName(initialData.last_name || '');
        setEmail(initialData.email || '');
        setPhone(initialData.phone || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('first_name', first_name);
      formData.append('last_name', last_name);
      formData.append('email', email);
      formData.append('phone', phone);

      await api.patch(`/api/employee/${userId}`, formData); // Gunakan endpoint dan method yang sesuai

      toast.success('Work data updated successfully!');

      if (onClose) onClose();

      router.refresh();

      if (onSuccess) onSuccess();

      // onSuccess?.();
      // onClose?.();
    } catch (error: any) {
      console.error('Error updating data:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred while updating data.';
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">     
       {/* Avatar Upload */}
        <div className="col-span-full flex items-center gap-4">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            {avatar ? (
              <img
                src={URL.createObjectURL(avatar)}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                {initialData?.pict_dir ? (
                  <img 
                    src={initialData.pict_dir} 
                    alt="Current Avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            )}
          </label>
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              Change Avatar
            </Button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAvatar(file);
              }}
            />
          </div>
        </div>
      <div>
        <Label>First Name</Label>
        <Input 
          id="first_name"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          required 
        />
      </div>
      <div>
        <Label>Last Name</Label>
        <Input 
          id='last_name'
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
          required 
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input 
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required 
        />
      </div>
      <div>
        <Label>Mobile Number</Label>
        <Input 
          id='phone'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter account number"
          required 
        />
      </div>

      {/* Form Buttons */}
      <DialogFooter className="gap-2 sm:justify-end mt-4 col-span-full">
        {onClose && ( 
             <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                 Cancel
             </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
}