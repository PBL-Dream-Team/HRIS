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
import { Eye, EyeOff } from 'lucide-react';
import { add, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import api from '@/lib/axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type EmployeeFormProps = {
  companyId: string;
  mode?: 'create' | 'edit'; // default: create
  initialData?: any;
  onSuccess?: () => void;
  onClose?: () => void;
};

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
  const [attendanceId, setAttendanceId] = useState<string>(''); // Changed from workScheme to attendanceId
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
  >('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [workSchemeOptions, setWorkSchemeOptions] = useState<
    { value: string; label: string; workscheme: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fill data when editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log('Initial data for edit:', initialData);

      // Use attendance_id instead of workscheme
      setAttendanceId(initialData.attendance_id || '');
      setFirstName(initialData.first_name || '');
      setLastName(initialData.last_name || '');
      setGender(initialData.gender || '');
      setAddress(initialData.address || '');
      setEmail(initialData.email || '');
      setPassword('');
      setPhoneNumber(initialData.phone || '');
      setBirthPlace(initialData.birth_place || '');
      setBirthDate(
        initialData.birth_date ? new Date(initialData.birth_date) : undefined,
      );
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
          console.error('Error parsing birth date:', error);
        }
      }
    }
  }, [mode, initialData]);

  // Fetch attendance types (work schemes) from API
  useEffect(() => {
    async function fetchAttendanceTypes() {
      try {
        const res = await api.get('/api/attendanceType');
        if (Array.isArray(res.data)) {
          const filtered = res.data.filter(
            (at: any) => at.company_id === companyId,
          );
          // Map to dropdown format with workscheme info
          setWorkSchemeOptions(
            filtered.map((at: any) => ({
              value: at.id,
              label: `${at.name} (${at.workscheme})`,
              workscheme: at.workscheme,
            })),
          );
          if (filtered.length === 0) {
            toast.warning(
              'No work schemes found. Please create workscheme on checkclock feature first.',
            );
          }
        }
      } catch (error) {
        console.error('Error fetching attendance types:', error);
        setWorkSchemeOptions([]);
      }
    }
    fetchAttendanceTypes();
  }, [companyId]);

  // Tambahkan fungsi handler untuk cek unique
  async function checkUniqueField(field: 'email' | 'phone', value: string) {
    try {
      const res = await api.get('/api/employee', {
        params: { [field]: value, company_id: companyId },
      });
      if (
        res.data &&
        Array.isArray(res.data) &&
        res.data.length > 0 &&
        (mode !== 'edit' || res.data[0].id !== initialData?.id)
      ) {
        toast.error(
          field === 'email'
            ? 'Email already exists'
            : 'Phone number already exists'
        );
        return false;
      }
      return true;
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        console.error(`Error checking ${field} uniqueness:`, err);
      }
      return true;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields according to DTO
    if (
      !firstName ||
      !lastName ||
      !email ||
      !attendanceId ||
      (mode === 'create' && !password)
    ) {
      toast.error('Please fill out all required fields');
      setIsLoading(false);
      return;
    }

    // Validate first name length
    if (firstName && (firstName.length < 2 || firstName.length > 20)) {
      toast.error('First name must be between 2 and 20 characters long');
      setIsLoading(false);
      return;
    }

    // Validate last name length
    if (lastName && (lastName.length < 2 || lastName.length > 20)) {
      toast.error('Last name must be between 2 and 20 characters long');
      setIsLoading(false);
      return;
    }

    // Validate birth place length
    if (birthPlace && birthPlace.length > 70) {
      toast.error('Birth place must be less than 70 characters long');
      setIsLoading(false);
      return;
    }

    // Validate NIK format (should be numbers only)
    if (nik && !/^\d+$/.test(nik)) {
      toast.error('NIK should contain only numbers');
      setIsLoading(false);
      return;
    }

    // Validate nik length
    if (nik.length < 16 || nik.length > 16) {
      toast.error('NIK must be exactly 16 digits long');
      setIsLoading(false);
      return;
    }

    // Validate address length
    if (address && address.length > 100) {
      toast.error('Address must be less than 100 characters long');
      setIsLoading(false);
      return;
    }

    // Validate email format
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password && (password.length < 6 || password.length > 20)) {
      toast.error('Password must be between 6 and 20 characters long');
      setIsLoading(false);
      return;
    }

    // Password validation: must contain uppercase, lowercase, number, and symbol
    if (password) {
      if (!/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|-]+$/.test(password)) {
        toast.error(
          'Password can only contain alphanumeric characters and special symbols !@#$%^&*()_+={}[\\]:;"\'<>,.?/\\|-',
        );
        setIsLoading(false);
        return;
      }
      if (!/[A-Z]/.test(password)) {
        toast.error('Password must contain at least one uppercase letter');
        setIsLoading(false);
        return;
      }
      if (!/[a-z]/.test(password)) {
        toast.error('Password must contain at least one lowercase letter');
        setIsLoading(false);
        return;
      }
      if (!/[0-9]/.test(password)) {
        toast.error('Password must contain at least one number');
        setIsLoading(false);
        return;
      }
      if (!/[!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|-]/.test(password)) {
        toast.error('Password must contain at least one special symbol');
        setIsLoading(false);
        return;
      }
    }

    // Cek email unik
    const isEmailUnique = await checkUniqueField('email', email);
    if (!isEmailUnique) {
      setIsLoading(false);
      return;
    }

    // Cek phone unik
    const isPhoneUnique = await checkUniqueField('phone', phoneNumber);
    if (!isPhoneUnique) {
      setIsLoading(false);
      return;
    }

    // Validate account number format (should be numbers only)
    if (accountNumber && !/^\d+$/.test(accountNumber)) {
      toast.error('Account number should contain only numbers');
      setIsLoading(false);
      return;
    }

    // Validate account number length
    if (
      accountNumber &&
      (accountNumber.length < 10 || accountNumber.length > 20)
    ) {
      toast.error('Account number must be between 10 and 20 digits long');
      setIsLoading(false);
      return;
    }

    // Validate account name length
    if (accountName && accountName.length > 50) {
      toast.error('Account name must be less than 50 characters long');
      setIsLoading(false);
      return;
    }

    if (accountName && accountName.length < 3) {
      toast.error('Account name must be at least 3 characters long');
      setIsLoading(false);
      return;
    }

    // Get the workscheme from the selected attendance type
    const selectedAttendanceType = workSchemeOptions.find(
      (opt) => opt.value === attendanceId,
    );
    if (!selectedAttendanceType) {
      toast.error('Please select a valid attendance type');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      // Add file if exists
      if (avatar) {
        formData.append('file', avatar);
      }

      // Required fields
      formData.append('company_id', companyId);
      formData.append('workscheme', selectedAttendanceType.workscheme);
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('attendance_id', attendanceId);

      // Password is required only for create mode
      if (mode === 'create') {
        formData.append('password', password);
      }

      // Optional fields - only append if they have values
      if (gender) formData.append('gender', gender);
      if (address) formData.append('address', address);
      if (phoneNumber) formData.append('phone', phoneNumber);
      if (birthPlace) formData.append('birth_place', birthPlace);
      if (nik) formData.append('nik', nik);
      if (position) formData.append('position', position);
      if (branch) formData.append('branch', branch);
      if (contract) formData.append('contract', contract);
      if (education) formData.append('last_education', education);
      if (bank) formData.append('account_bank', bank);
      if (accountNumber) formData.append('account_number', accountNumber);
      if (accountName) formData.append('account_name', accountName);

      // Handle birth_date - convert to ISO date string
      if (birthDate) {
        const dateString =
          birthDate instanceof Date
            ? !isNaN(birthDate.getTime())
              ? birthDate.toISOString().split('T')[0]
              : ''
            : (() => {
                const d = new Date(birthDate);
                return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
              })();

        if (dateString) {
          formData.append('birth_date', dateString);
        }
      }

      // Log the form data for debugging
      console.log('Form data being sent:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      if (mode === 'create') {
        await api.post('/api/employee', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Employee created successfully!');
      } else if (mode === 'edit' && initialData?.id) {
        await api.patch(`/api/employee/${initialData.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Employee updated successfully!');
      }

      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      console.error('Submit error:', err);
      const errorMessage =
        err.response?.data?.message || 'Something went wrong.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
                onClick={() =>
                  document.getElementById('avatar-upload')?.click()
                }
                disabled={isLoading}
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
            <Label>
              First Name
              <span className="text-red-600"> *</span>
            </Label>
            <Input
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>
              Last Name
              <span className="text-red-600"> *</span>
            </Label>
            <Input
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>
              Gender
              <span className="text-red-600"> *</span>
            </Label>
            <Select
              value={gender}
              onValueChange={(value) => setGender(value as 'M' | 'F' | 'O')}
              key={`gender-${gender}`}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose gender">
                  {genderOptions.find((option) => option.value === gender)
                    ?.label || 'Choose gender'}
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
            <Label htmlFor="birth_date">
              Date of Birth
              <span className="text-red-600"> *</span>
            </Label>
            <div className="relative">
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
                className="pr-4 [&::-webkit-calendar-picker-indicator]:opacity-100
                                     [&::-webkit-calendar-picker-indicator]:absolute
                                     [&::-webkit-calendar-picker-indicator]:right-2
                                     [&::-webkit-calendar-picker-indicator]:w-4
                                     [&::-webkit-calendar-picker-indicator]:h-4
                                     [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                style={{ colorScheme: 'light' }}
                max={format(new Date(), 'yyyy-MM-dd')}
                min="1900-01-01"
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <Label>
              Birth Place
              <span className="text-red-600"> *</span>
            </Label>
            <Input
              placeholder="Enter birth place"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>
              NIK
              <span className="text-red-600"> *</span>
            </Label>
            <Input
              placeholder="Enter NIK (numbers only)"
              value={nik}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                setNik(value);
              }}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>
              Last Education
              <span className="text-red-600"> *</span>
            </Label>
            <Select
              value={education}
              onValueChange={(value) =>
                setEducation(
                  value as 'HIGH_SCHOOL' | 'BACHELOR' | 'MASTER' | 'DOCTOR',
                )
              }
              key={`education-${education}`}
              disabled={isLoading}
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
            <Label>
              Address
              <span className="text-red-600"> *</span>
            </Label>
            <Input
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>
              Email
              <span className="text-red-600"> *</span>
            </Label>
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {mode === 'create' && (
            <div>
              <Label>
                Password
                <span className="text-red-600"> *</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  tabIndex={-1}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}
          <div>
            <Label>
              Phone Number
              <span className="text-red-600"> *</span>
            </Label>
            <Input
              placeholder="Enter phone number (numbers only)"
              value={phoneNumber}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                setPhoneNumber(value);
              }}
              disabled={isLoading}
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
            <Label>
              Attendance Type
              <span className="text-red-600"> *</span>
            </Label>
            <Select
              value={attendanceId}
              onValueChange={(value) => setAttendanceId(value)}
              key={`attendance-${attendanceId}`}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose attendance type">
                  {workSchemeOptions.find(
                    (option) => option.value === attendanceId,
                  )?.label || 'Choose attendance type'}
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
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Branch</Label>
            <Input
              placeholder="Enter branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>
              Contract
              <span className="text-red-600"> *</span>
            </Label>
            <Select
              value={contract}
              onValueChange={(value) =>
                setContract(value as 'PERMANENT' | 'CONTRACT' | 'INTERN')
              }
              key={`contract-${contract}`}
              disabled={isLoading}
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
            <Label>
              Bank
              <span className="text-red-600"> *</span>
            </Label>
            <Select
              value={bank || ''}
              onValueChange={(value) => setBank(value as any)}
              key={`account_bank-${bank}`}
              disabled={isLoading}
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
            <Label>
              Account Number
              <span className="text-red-600"> *</span>
            </Label>
            <Input
              placeholder="Enter account number (numbers only)"
              value={accountNumber}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                setAccountNumber(value);
              }}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>
              Account Name
              <span className="text-red-600"> *</span>
            </Label>
            <Input
              placeholder="Enter account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? mode === 'edit'
              ? 'Updating...'
              : 'Creating...'
            : mode === 'edit'
              ? 'Update'
              : 'Add'}
        </Button>
      </div>
    </form>
  );
}
