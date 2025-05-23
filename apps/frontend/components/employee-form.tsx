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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Upload } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export function EmployeeForm() {
  const [date, setDate] = useState<Date | undefined>();
  const [avatar, setAvatar] = useState<File | null>(null);

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
      <div className='w-full'>
        <Label>Address</Label>
        <Input placeholder="Enter address" />
      </div>
      {/*Status */}
       <div>
        <Label>Contract</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose Contract" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="not active">Not Active</SelectItem>
          </SelectContent>
        </Select>
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

      {/* Position and Branch */}
      <div>
        <Label>Position</Label>
        <Input placeholder="Enter position" />
      </div>
      <div>
        <Label>Branch</Label>
        <Input placeholder="Enter branch" />
      </div>

      {/* Contract Type and Grade */}
      <div>
        <Label>Contract Type</Label>
        <RadioGroup defaultValue="permanent" className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="permanent" id="permanent" />
            <Label htmlFor="permanent">Permanent</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="contract" id="contract" />
            <Label htmlFor="contract">Contract</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intern" id="intern" />
            <Label htmlFor="intern">Intern</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label>Grade</Label>
        <Input placeholder="Enter grade" />
      </div>

      {/* Bank and Account Info */}
      <div>
        <Label>Bank</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose Bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bca">BCA</SelectItem>
            <SelectItem value="bni">BNI</SelectItem>
            <SelectItem value="bri">BRI</SelectItem>
            <SelectItem value="mandiri">Mandiri</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Account Number</Label>
        <Input placeholder="Enter account number" />
      </div>

      <div>
        <Label>Account Holder Name</Label>
        <Input placeholder="Enter account holder name" />
      </div>
      <div>
        <Label>SP Type</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose SP Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sp1">SP 1</SelectItem>
            <SelectItem value="sp2">SP 2</SelectItem>
            <SelectItem value="sp3">SP 3</SelectItem>
          </SelectContent>
        </Select>
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
