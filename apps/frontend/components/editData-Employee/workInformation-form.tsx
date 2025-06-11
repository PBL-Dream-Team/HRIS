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

type Bank =
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
  | 'Commonwealth';

type EmployeeEditWorkDataFormProps = {
  employeeId: string;
  initialData?: {
    id: string;
    account_bank: Bank;
    account_name: string;
    account_number: string;
  };
  onSuccess?: () => void;
  onClose?: () => void;
};

export function EmployeeEditWorkDataForm({
  employeeId,
  initialData,
  onSuccess,
  onClose,
}: EmployeeEditWorkDataFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [account_bank, setAccountBank] = useState<string>('');
  const [account_name, setAccountName] = useState<string>('');
  const [account_number, setAccountNumber] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setAccountBank(initialData.account_bank || '');
      setAccountName(initialData.account_name || '');
      setAccountNumber(initialData.account_number || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!account_bank) {
      toast.error('Bank is required');
      return;
    }
    if (!account_name) {
      toast.error('Account holder name is required');
      return;
    }
    if (!account_number) {
      toast.error('Account number is required');
      return;
    }
    if (account_number.length < 10 || account_number.length > 16) {
      toast.error('Account number must be between 10 and 16 digits');
      return;
    }
    if (!/^\d+$/.test(account_number)) {
      toast.error('Account number must contain only digits');
      return;
    }
    if (account_name.length < 3) {
      toast.error('Account holder name must be at least 3 characters long');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('account_bank', account_bank);
      formPayload.append('account_name', account_name);
      formPayload.append('account_number', account_number);

      await api.patch(`/api/employee/${employeeId}`, formPayload);

      toast.success('Work data updated successfully!');

      if (onClose) onClose();
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error updating work data:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to update work data';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBankChange = (value: string) => {
    setAccountBank(value);
  };

  // Bank options
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

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Bank Selection */}
      <div>
        <Label htmlFor="bank-select">
          Bank 
          <span className='text-red-600'> *</span>
        </Label>
        <Select
          value={account_bank}
          onValueChange={handleBankChange}
          key={`account_bank-${account_bank}`}
        >
          <SelectTrigger id="bank-select">
            <SelectValue placeholder="Choose Bank">
              {bankOptions.find((option) => option.value === account_bank)
                ?.label || 'Choose Bank'}
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

      {/* Account Name */}
      <div>
        <Label htmlFor="account_name">
          Account Holder Name 
          <span className='text-red-600'> *</span>
        </Label>
        <Input
          id="account_name"
          value={account_name}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Enter account holder name"
          // required
        />
      </div>

      {/* Account Number */}
      <div className="col-span-full">
        <Label htmlFor="account_number">
          Account Number 
          <span className='text-red-600'> *</span>
        </Label>
        <Input
          id="account_number"
          value={account_number}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Enter account number"
          required
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
