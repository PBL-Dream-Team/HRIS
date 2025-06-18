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
    pict_dir?: string;
  };
  onSuccess?: () => void;
  onClose?: () => void;
};

export function AdminEditDataForm({
  userId,
  initialData,
  onSuccess,
  onClose,
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
      setAvatar(null); // Reset avatar if initialData is provided
      setFirstName(initialData.first_name || '');
      setLastName(initialData.last_name || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!first_name) {
      toast.error('First name is required');
      return;
    }
    if (!last_name) {
      toast.error('Last name is required');
      return;
    }
    if (!email) {
      toast.error('Email is required');
      return;
    }
    if (!phone) {
      toast.error('Mobile number is required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (phone.length < 10 || phone.length > 15) {
      toast.error('Mobile number must be between 10 and 15 digits');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (avatar) {
        formData.append('file', avatar);
      }
      formData.append('first_name', first_name);
      formData.append('last_name', last_name);
      formData.append('email', email);
      formData.append('phone', phone);

      await api.patch(`/api/employee/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Data updated successfully!');

      if (onClose) onClose();

      router.refresh();

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error updating data:', error);
      const errorMessage =
        error.response?.data?.message ||
        'An error occurred while updating data.';
      toast.error(errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Avatar Upload */}
      <div className="col-span-full flex items-center gap-4">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          {avatar ? (
            // Preview gambar yang baru dipilih
            <img
              src={URL.createObjectURL(avatar)}
              alt="Avatar Preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-gray-200">
              {initialData?.pict_dir && initialData.pict_dir !== '[null]' ? (
                <img
                  src={`/storage/employee/${initialData.pict_dir}`}
                  alt="Current Avatar"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    console.log('Error loading avatar:', initialData.pict_dir);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      const div = document.createElement('div');
                      div.innerHTML =
                        '<Upload className="h-6 w-6 text-muted-foreground" />';
                      target.parentElement.appendChild(div);
                    }
                  }}
                  onLoad={() => {
                    console.log('Avatar loaded successfully');
                  }}
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
            {initialData?.pict_dir && initialData.pict_dir !== '[null]'
              ? 'Change Avatar'
              : 'Upload Avatar'}
          </Button>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Validasi ukuran file (maksimal 5MB)
                if (file.size > 5 * 1024 * 1024) {
                  toast.error('File size should not exceed 5MB');
                  return;
                }

                // Validasi tipe file
                if (!file.type.startsWith('image/')) {
                  toast.error('Please select an image file');
                  return;
                }

                setAvatar(file);
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Max file size: 5MB. Supported formats: JPG, PNG, JPEG
          </p>
        </div>
      </div>
      <div>
        <Label>
          First Name
          <span className="text-red-600"> *</span>
        </Label>
        <Input
          id="first_name"
          value={first_name}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
            setFirstName(value);
          }}
          placeholder="Enter your first name (letters only)"
        />
      </div>
      <div>
        <Label>
          Last Name
          <span className="text-red-600"> *</span>
        </Label>
        <Input
          id="last_name"
          value={last_name}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
            setLastName(value);
          }}
          placeholder="Enter your last name (letters only)"
        />
      </div>
      <div>
        <Label>
          Email
          <span className="text-red-600"> *</span>
        </Label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div>
        <Label>
          Mobile Number
          <span className="text-red-600"> *</span>
        </Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setPhone(value);
          }}
          placeholder="Enter mobile number (numbers only)"
        />
      </div>

      {/* Form Buttons */}
      <DialogFooter className="gap-2 sm:justify-end mt-4 col-span-full">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
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
