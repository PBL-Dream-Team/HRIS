'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { DialogFooter } from '@/components/ui/dialog';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { use } from 'chai';
import { toast } from 'sonner';

type Gender = 'M' | 'F';
type EducationType = 'HIGH_SCHOOL' | 'BACHELOR' | 'MASTER' | 'DOCTOR';

type EmployeeEditGeneralDataFormProps = {
  employeeId: string;
  initialData?: {
    id: string;
    first_name: string;
    last_name: string;
    gender: Gender;
    last_education: EducationType;
    phone: string;
    nik: string;
    birth_place: string;
    birth_date: string;
    pict_dir: string;
    email?: string;
  };
  onSuccess?: () => void;
  onClose?: () => void;
};

export function EmployeeEditGeneralDataForm({
  employeeId,
  initialData,
  onSuccess,
  onClose,
}: EmployeeEditGeneralDataFormProps) {
  const router = useRouter();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [first_name, setFirstName] = useState<string>('');
  const [last_name, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [nik, setNik] = useState<string>('');
  const [birth_place, setBirthPlace] = useState<string>('');
  const [birth_date, setBirthDate] = useState<string>(''); // Changed to string for date input
  const [gender, setGender] = useState<string>('');
  const [last_education, setLastEducation] = useState<string>('');

  // Education options
  const educationOptions = [
    { value: 'HIGH_SCHOOL', label: 'High School' },
    { value: 'BACHELOR', label: 'Bachelor' },
    { value: 'MASTER', label: 'Master' },
    { value: 'DOCTOR', label: 'Doctor' },
  ];

  useEffect(() => {
    console.log('initialData received:', initialData);
    if (initialData) {
      setFirstName(initialData.first_name || '');
      setLastName(initialData.last_name || '');
      setPhone(initialData.phone || '');
      setNik(initialData.nik || '');
      setBirthPlace(initialData.birth_place || '');
      setGender(initialData.gender || '');
      setLastEducation(initialData.last_education || '');

      // Handle birth date
      if (initialData.birth_date) {
        try {
          console.log('Raw birth_date from initialData:', initialData.birth_date);

          // Parse the date regardless of format
          const date = new Date(initialData.birth_date);
          if (!isNaN(date.getTime())) {
            // Format as YYYY-MM-DD for the input field
            const formattedDate = date.toISOString().split('T')[0];
            console.log('Formatted date:', formattedDate);
            setBirthDate(formattedDate);
          } else {
            console.log('Invalid date:', initialData.birth_date);
            setBirthDate('');
          }
        } catch (error) {
          console.error('Error parsing birth_date:', error);
          setBirthDate('');
        }
      } else {
        setBirthDate('');
      }
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
    if (!phone) {
      toast.error('Phone number is required');
      return;
    }
    if (!nik) {
      toast.error('NIK is required');
      return;
    }
    if (nik.length < 16 || nik.length > 16) {
      toast.error('NIK must be 16 characters');
      return
    }
    if (!birth_place) {
      toast.error('Place of birth is required');
      return;
    }
    if (!birth_date) {
      toast.error('Date of birth is required');
      return;
    }
    if (!/^\+?[0-9\s]+$/.test(phone)) {
      toast.error('Mobile number can only contain numbers');
      return;
    }
    if (phone.length < 10 || phone.length > 15) {
      toast.error('Mobile number must be between 10 and 15 digits');
      return;
    }
    if (first_name.length < 3) {
      toast.error('First name must be at least 3 characters long');
      return;
    }
    if (last_name.length < 3) {
      toast.error('Last name must be at least 3 characters long');
      return
    }
    if (birth_place.length < 3) {
      toast.error('Place of birth must be at least 3 characters long');
      return
    }

    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      if (avatar) {
        formPayload.append('file', avatar);
      }
      formPayload.append('first_name', first_name);
      formPayload.append('last_name', last_name);
      formPayload.append('phone', phone);
      formPayload.append('nik', nik);
      formPayload.append('birth_place', birth_place);
      formPayload.append('gender', gender);
      formPayload.append('last_education', last_education);

      // Convert date string to ISO format for API
      const isoDateString = birth_date ? new Date(birth_date).toISOString() : '';
      formPayload.append('birth_date', isoDateString);

      await api.patch(`/api/employee/${employeeId}`, formPayload);

      toast.success('Data updated successfully!');

      if (onClose) onClose();
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error updating general data:', error);
      const errorMessage =
        error.response?.data?.message ||
        'An error occurred while updating general data.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
  };

  const handleEducationChange = (value: string) => {
    setLastEducation(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      return format(date, 'PPP'); // Format menjadi "January 1st, 1990"
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Fallback ke string asli jika parsing gagal
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      console.log(
                        'Error loading avatar:',
                        initialData.pict_dir,
                      );
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

        {/* First Name */}
        <div>
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"

          />
        </div>

        {/* Last Name */}
        <div>
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"

          />
        </div>

        {/* Gender */}
        <div>
          <Label>Gender *</Label>
          <Select
            value={gender}
            onValueChange={handleGenderChange}
            key={`gender-${gender}`}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender">
                {gender === 'M'
                  ? 'Male'
                  : gender === 'F'
                    ? 'Female'
                    : 'Select gender'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="F">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Last Education */}
        <div>
          <Label>Last Education *</Label>
          <Select
            value={last_education}
            onValueChange={handleEducationChange}
            key={`education-${last_education}`}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select education">
                {educationOptions.find((opt) => opt.value === last_education)
                  ?.label || 'Select education'}
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

        {/* Phone Number */}
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        {/* NIK */}
        <div>
          <Label htmlFor="nik">NIK *</Label>
          <Input
            id="nik"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            placeholder="Enter NIK"

          />
        </div>

        {/* Birth Place */}
        <div>
          <Label htmlFor="birth_place">Place of birth *</Label>
          <Input
            id="birth_place"
            value={birth_place}
            onChange={(e) => setBirthPlace(e.target.value)}
            placeholder="Enter place of birth"
          />
        </div>

        {/* Birth Date */}
        <div>
          <Label htmlFor="birth_date">Date of Birth *</Label>
          <div className="relative">
            <Input
              id="birth_date"
              type="date"
              value={birth_date}
              onChange={(e) => setBirthDate(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              min="1900-01-01"
              className="pr-4 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              style={{
                colorScheme: 'light'
              }}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="col-span-full text-red-500 text-sm">{error}</div>
        )}
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