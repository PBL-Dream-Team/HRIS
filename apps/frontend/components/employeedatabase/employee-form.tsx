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
import { Upload } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import api from '@/lib/axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { init } from 'next/dist/compiled/webpack/webpack';

type EmployeeFormProps = {
  companyId: string;
  mode?: 'create' | 'edit'; // default: create
  initialData?: any;
  onSuccess?: () => void;
  onClose?: () => void;
};

// Constants
// const DATE_DISPLAY_FORMAT = 'dd/MM/yyyy';

const bankOptions = [
  { value: 'BRI', label: 'BRI' },
  { value: 'Mandiri', label: 'Mandiri' },
  { value: 'BNI', label: 'BNI' },
  { value: 'Danamon', label: 'Danamon' },
  { value: 'Permata', label: 'Permata' },
  { value: 'BCA', label: 'BCA' },
  { value: 'Maybank', label: 'Maybank' },
  { value: 'Panin', label: 'Panin' },
  { value: 'Bukopin', label: 'Bukopin' },
  { value: 'CIMB', label: 'CIMB' },
  { value: 'UOB', label: 'UOB' },
  { value: 'OCBC', label: 'OCBC' },
  { value: 'BJB', label: 'BJB' },
  { value: 'Muamalat', label: 'Muamalat' },
  { value: 'BTN', label: 'BTN' },
  { value: 'BTPN', label: 'BTPN' },
  { value: 'Mega', label: 'Mega' },
  { value: 'SyariahMandiri', label: 'Syariah Mandiri' },
  { value: 'Commonwealth', label: 'Commonwealth Bank' },
];

const workSchemeOptions = [
  { value: 'WFO', label: 'WFO' },
  { value: 'WFA', label: 'WFA' },
  { value: 'HYBRID', label: 'HYBRID' },
];

const genderOptions = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Other' },
];

const contractOptions = [
  { value: 'PERMANENT', label: 'Permanent' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERN', label: 'Intern' },
];

const educationOptions = [
  { value: 'HIGH_SCHOOL', label: 'High School' },
  { value: 'BACHELOR', label: 'Bachelor' },
  { value: 'MASTER', label: 'Master' },
  { value: 'DOCTOR', label: 'Doctor' },
];

export function EmployeeForm({
  companyId,
  mode = 'create',
  initialData,
  onSuccess,
  onClose,
}: EmployeeFormProps) {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [workScheme, setWorkScheme] = useState<'WFO' | 'WFA' | 'HYBRID' | ''>(
    '',
  );
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | 'O' | ''>('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [birthPlace, setBirthPlace] = useState('');
  const [nik, setNik] = useState('');
  const [position, setPosition] = useState('');
  const [branch, setBranch] = useState('');
  const [contract, setContract] = useState<
    'PERMANENT' | 'CONTRACT' | 'INTERN' | ''
  >('');
  const [education, setEducation] = useState<
    'HIGH_SCHOOL' | 'BACHELOR' | 'MASTER' | 'DOCTOR' | ''
  >('');
  const [bank, setBank] = useState<
    | 'BRI'
    | 'Mandiri'
    | 'BNI'
    | 'Danamon'
    | 'Permata'
    | 'BCA'
    | 'Maybank'
    | 'Panin'
    | 'Bukopin'
    | 'CIMB'
    | 'UOB'
    | 'OCBC'
    | 'BJB'
    | 'Muamalat'
    | 'BTN'
    | 'BTPN'
    | 'Mega'
    | 'SyariahMandiri'
    | 'Commonwealth'
    | ''
  >();
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  // Isi data saat edit
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log('Initial data for edit:', initialData);

      setWorkScheme(initialData.workscheme || '');
      setFirstName(initialData.first_name || '');
      setLastName(initialData.last_name || '');
      setGender(initialData.gender || '');
      setAddress(initialData.address || '');
      setEmail(initialData.email || '');
      setPassword('');
      setPhoneNumber(initialData.phone || '');
      setBirthDate(initialData.birth_date);
      setBirthPlace(initialData.birth_place || '');
      setNik(initialData.nik || '');
      setPosition(initialData.position || '');
      setBranch(initialData.branch || '');
      setContract(initialData.contract || '');
      setEducation(initialData.last_education || '');
      setBank(initialData.account_bank || '');
      setAccountNumber(initialData.account_number || '');
      setAccountName(initialData.account_name || '');
      setAvatar(null);

      if (initialData.birth_date) {
        try {
          const parsedDate = new Date(initialData.birth_date + 'T00:00:00');
          if (!isNaN(parsedDate.getTime())) {
            setBirthDate(parsedDate);
          }
        } catch (error) {
          // Optional: handle error
        }
      }
    }
  }, [mode, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || (mode === 'create' && !password)) {
      toast.error('Please fill out all required fields');
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
    if (mode === 'create') formData.append('password', password);
    if (phoneNumber) formData.append('phone', phoneNumber);
    formData.append('birth_place', birthPlace);
    formData.append('nik', nik);
    formData.append('position', position);
    formData.append('branch', branch);
    if (contract) formData.append('contract', contract);
    if (education) formData.append('last_education', education);
    if (bank) formData.append('account_bank', bank);
    formData.append('account_number', accountNumber);
    formData.append('account_name', accountName);
    formData.append(
      'birth_date',
      birthDate
        ? (birthDate instanceof Date
            ? !isNaN(birthDate.getTime())
              ? birthDate.toISOString().split('T')[0]
              : ''
            : (() => {
                const d = new Date(birthDate);
                return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
              })())
        : '',
    );

    try {
      if (mode === 'create') {
        await api.post('/api/employee', formData);
        toast.success('Employee created successfully!');
      } else if (mode === 'edit' && initialData?.id) {
        await api.patch(`/api/employee/${initialData.id}`, formData);
        toast.success('Employee updated successfully!');
      }
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      console.error('Submit error:', err);
      const errorMessage =
        err.response?.data?.message || 'Something went wrong.';
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              {avatar ? (
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="Avatar Preview"
                  className="w-20 h-20 rounded object-cover"
                />
              ) : initialData?.pict_dir ? (
                <img
                  src={`/storage/employee/${initialData.pict_dir}`}
                  alt="Current Avatar"
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
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <Label>Gender</Label>
            <Select
              value={gender}
              onValueChange={(value) => setGender(value as 'M' | 'F' | 'O')}
              key={`gender-${gender}`}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose gender">
                  {genderOptions.find((option) => option.value === gender)?.label ||
                    'Choose gender'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="birth_date">Date of Birth</Label>
            <Input
              id="birth_date"
              type="date"
              value={birthDate ? format(birthDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                const selectedDate = e.target.value
                  ? new Date(e.target.value)
                  : undefined;
                setBirthDate(selectedDate);
              }}
              max={format(new Date(), 'yyyy-MM-dd')}
              min="1900-01-01"
              required
            />
          </div>
          <div>
            <Label>Birth Place</Label>
            <Input
              placeholder="Enter birth place"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
            />
          </div>
          <div>
            <Label>NIK</Label>
            <Input
              placeholder="Enter NIK"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
            />
          </div>
          <div>
            <Label>Last Education</Label>
            <Select
              value={education}
              onValueChange={(value) =>
                setEducation(
                  value as 'HIGH_SCHOOL' | 'BACHELOR' | 'MASTER' | 'DOCTOR',
                )
              }
              key={`education-${education}`}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose Last Education">
                  {educationOptions.find((option) => option.value === education)
                    ?.label || 'Choose Last Education'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {educationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Address</Label>
            <Input
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {mode !== 'edit' && (
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
          <div>
            <Label>Phone Number</Label>
            <Input
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Employment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Work Scheme</Label>
            <Select
              value={workScheme}
              onValueChange={(value) =>
                setWorkScheme(value as 'WFO' | 'WFA' | 'HYBRID')
              }
              key={`work_scheme-${workScheme}`}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose work scheme">
                  {workSchemeOptions.find((option) => option.value === workScheme)
                    ?.label || 'Choose work scheme'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {workSchemeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Position</Label>
            <Input
              placeholder="Enter position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div>
            <Label>Branch</Label>
            <Input
              placeholder="Enter branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>
          <div>
            <Label>Contract</Label>
            <Select
              value={contract}
              onValueChange={(value) =>
                setContract(value as 'PERMANENT' | 'CONTRACT' | 'INTERN')
              }
              key={`contract-${contract}`}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose Contract">
                  {contractOptions.find((option) => option.value === contract)
                    ?.label || 'Choose Contract'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {contractOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bank Information */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Bank</Label>
            <Select
              value={bank || ''}
              onValueChange={(value) => setBank(value as any)}
              key={`account_bank-${bank}`}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose Bank">
                  {bankOptions.find((option) => option.value === bank)?.label ||
                    'Choose Bank'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {bankOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Account Number</Label>
            <Input
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
          <div>
            <Label>Account Name</Label>
            <Input
              placeholder="Enter account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{mode === 'edit' ? 'Update' : 'Add'}</Button>
      </div>
    </form>
  );
}
