'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Eye, EyeOff } from 'lucide-react';

export function AdminForm() {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Avatar Upload */}
      <div className="col-span-full flex items-center gap-4">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          {previewUrl ? (
            <div className="relative w-20 h-20 rounded overflow-hidden">
              <Image
                src={previewUrl}
                alt="Avatar Preview"
                fill
                unoptimized // required because it's a local blob url
                className="object-cover rounded"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded bg-muted flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </label>
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('avatar-upload')?.click()}
          >
            Upload Avatar
          </Button>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      {/* First Row */}
      <div>
        <Label>First Name</Label>
        <Input placeholder="Enter first name" />
      </div>
      <div>
        <Label>Last Name</Label>
        <Input placeholder="Enter last name" />
      </div>
      <div>
        <Label>Email</Label>
        <Input placeholder="Enter email" />
      </div>
      <div>
        <Label>Mobile Number</Label>
        <Input placeholder="Enter phone number" />
      </div>
      <div className="col-span-full">
        <Label>Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="col-span-full flex justify-end gap-2 mt-4">
        <Button variant="outline" type="reset">
          Cancel
        </Button>
        <Button type="submit">Add</Button>
      </div>
    </form>
  );
}
