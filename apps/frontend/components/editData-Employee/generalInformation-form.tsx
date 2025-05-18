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
import { Button } from '@/components/ui/button';
import { CalendarIcon, Upload, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export function EmployeeEditGeneralDataForm() {
  const [date, setDate] = useState<Date | undefined>();
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

      {/* Gender and Education */}
      <div>
        <Label>Gender</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Last Education</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose Last Education" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="highschool">High School</SelectItem>
            <SelectItem value="bachelor">Bachelor</SelectItem>
            <SelectItem value="master">Master</SelectItem>
            <SelectItem value="phd">PhD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile and NIK */}
      <div>
        <Label>Mobile Number</Label>
        <Input placeholder="Enter mobile number" />
      </div>
      <div>
        <Label>NIK</Label>
        <Input placeholder="Enter NIK" />
      </div>

      {/* Birth Info */}
      <div>
        <Label>Place of Birth</Label>
        <Input placeholder="Enter place of birth" />
      </div>
      <div>
        <Label>Date of Birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'dd/MM/yyyy') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Password */}
      <div className='col-span-full'>
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
