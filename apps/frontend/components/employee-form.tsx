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

import api from '@/lib/axios';

type EmployeeFormProps = {
  companyId: string;
  onSuccess?: () => void;
  onClose?: () => void;
};

// Constants
// const DATE_DISPLAY_FORMAT = 'dd/MM/yyyy';

export function EmployeeForm({
  companyId,
  onSuccess,
  onClose,
}: EmployeeFormProps) {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [workScheme, setWorkScheme] = useState<'WFO' | 'WFA' | 'HYBRID'>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>();
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [birthPlace, setBirthPlace] = useState('');
  const [nik, setNik] = useState('');
  const [position, setPosition] = useState('');
  const [branch, setBranch] = useState('');
  const [contract, setContract] = useState<
    'PERMANENT' | 'CONTRACT' | 'INTERN'
  >();
  const [education, setEducation] = useState<
    'HIGH_SCHOOL' | 'BACHELOR' | 'MASTER' | 'DOCTOR'
  >();
  const [bank, setBank] = useState<'bca' | 'bni' | 'bri' | 'mandiri'>();
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      alert('Please fill out all required fields');
      return;
    }

    const formData = new FormData();

    if (avatar) {
      formData.append('file', avatar);
    }
    formData.append('company_id', companyId);
    if (workScheme) formData.append('workscheme', workScheme);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    if (gender) formData.append('gender', gender);
    formData.append('address', address);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phone', phoneNumber);
    // if (birthDate) {
    //   formData.append('birth_date', format(birthDate, 'yyyy-MM-dd'));
    // }
    formData.append('birth_place', birthPlace);
    formData.append('nik', nik);
    formData.append('position', position);
    formData.append('branch', branch);
    if (contract) formData.append('contract', contract);
    if (education) formData.append('last_education', education);
    if (bank) formData.append('account_bank', bank);
    formData.append('account_number', accountNumber);
    formData.append('account_name', accountName);

    try {
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await api.post('/api/employee', formData);
      setAvatar(null);
      setWorkScheme(undefined);
      setFirstName('');
      setLastName('');
      setGender(undefined);
      setAddress('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      // setBirthDate(undefined);
      setBirthPlace('');
      setNik('');
      setPosition('');
      setBranch('');
      setContract(undefined);
      setEducation(undefined);
      setBank(undefined);
      setAccountName('');
      setAccountNumber('');
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('Submit error:', err);
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

      {/* Work Scheme */}
      <div>
        <Label>Work Scheme</Label>
        <Select value={workScheme} onValueChange={setWorkScheme}>
          <SelectTrigger>
            <SelectValue placeholder="Choose work scheme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WFO">WFO</SelectItem>
            <SelectItem value="WFA">WFA</SelectItem>
            <SelectItem value="HYBRID">HYBRID</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* First Name */}
      <div>
        <Label>First Name</Label>
        <Input
          placeholder="Enter first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      {/* Last Name */}
      <div>
        <Label>Last Name</Label>
        <Input
          placeholder="Enter last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      {/* Gender */}
      <div>
        <Label>Gender</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger>
            <SelectValue placeholder="Choose gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="M">Male</SelectItem>
            <SelectItem value="F">Female</SelectItem>
            <SelectItem value="O">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Address */}
      <div className="w-full">
        <Label>Address</Label>
        <Input
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Email */}
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Mobile */}
      <div>
        <Label>Phone Number</Label>
        <Input
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      {/* Birth Date */}
      {/* <div>
        <Label>Birth Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="validUntil"
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {birthDate ? (
                format(birthDate, DATE_DISPLAY_FORMAT)
              ) : (
                <span>Select date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={birthDate}
              onSelect={setBirthDate}
              initialFocus
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          </PopoverContent>
        </Popover>
      </div> */}

      {/* Birth Place */}
      <div>
        <Label>Birth Place</Label>
        <Input
          placeholder="Enter birth place"
          value={birthPlace}
          onChange={(e) => setBirthPlace(e.target.value)}
        />
      </div>

      {/* NIK */}
      <div>
        <Label>NIK</Label>
        <Input
          placeholder="Enter NIK"
          value={nik}
          onChange={(e) => setNik(e.target.value)}
        />
      </div>

      {/* Position */}
      <div>
        <Label>Position</Label>
        <Input
          placeholder="Enter position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
      </div>

      {/* Branch */}
      <div>
        <Label>Branch</Label>
        <Input
          placeholder="Enter branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        />
      </div>

      {/* Contract */}
      <div>
        <Label>Contract</Label>
        <Select value={contract} onValueChange={setContract}>
          <SelectTrigger>
            <SelectValue placeholder="Choose Contract" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERMANENT">Permanent</SelectItem>
            <SelectItem value="CONTRACT">Contract</SelectItem>
            <SelectItem value="INTERN">Intern</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Last Education */}
      <div>
        <Label>Last Education</Label>
        <Select value={education} onValueChange={setEducation}>
          <SelectTrigger>
            <SelectValue placeholder="Choose Last Education" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
            <SelectItem value="BACHELOR">Bachelor</SelectItem>
            <SelectItem value="MASTER">Master</SelectItem>
            <SelectItem value="DOCTOR">Doctor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bank */}
      <div>
        <Label>Bank</Label>
        <Select value={bank} onValueChange={setBank}>
          <SelectTrigger>
            <SelectValue placeholder="Choose Bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BCA">BCA</SelectItem>
            <SelectItem value="BNI">BNI</SelectItem>
            <SelectItem value="BRI">BRI</SelectItem>
            <SelectItem value="Mandiri">Mandiri</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Account Number */}
      <div>
        <Label>Account Number</Label>
        <Input
          placeholder="Enter account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>

      {/* Account Name */}
      <div>
        <Label>Account Name</Label>
        <Input
          placeholder="Enter account name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
      </div>

      {/* Form Buttons */}
      <div className="col-span-full flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add</Button>
      </div>
    </form>
  );
}
