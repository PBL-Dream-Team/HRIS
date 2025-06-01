'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function AdminForm() {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Avatar Upload */}
      <div className="col-span-full flex items-center gap-4">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          {avatar ? (
            <img
              src={URL.createObjectURL(avatar)}
              alt="Avatar Preview"
              className="w-20 h-20 rounded object-cover"
            />
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setAvatar(file);
            }}
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
