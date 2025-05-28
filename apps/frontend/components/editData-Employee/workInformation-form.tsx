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

type Bank = 'BRI' | 'Mandiri' | 'BNI' | 'Danamon' | 'Permata' | 'BCA' | 'Maybank' | 'Panin' | 'Bukopin' | 'CIMB' | 'UOB' | 'OCBC' | 'BJB' | 'Muamalat' | 'BTN' | 'BTPN' | 'Mega' | 'SyariahMandiri' | 'Commonwealth';
type BankCode = '002' | '008' | '009' | '011' | '013' | '014' | '016' | '019' | '020' | '022' | '023' | '028' | '110' | '147' | '200' | '213' | '426' | '451' | '950';

type EmployeeEditWorkDataFormProps = {
  mode: 'edit';
  companyId: string;
  employeeId: string;
  initialData?: {
    id: string;
    account_bank: BankCode; 
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
  onClose
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
    setIsSubmitting(true);
    
    // Fix 2: Add validation
    // if (!accountName.trim() || !accountNumber.trim()) {
    //   toast.error('Please fill in all required fields');
    //   return;
    // }

    
    try {
      // const formPayload = new FormData();
      // formPayload.append('account_bank', account_bank);
      // formPayload.append('account_name', account_name);
      // formPayload.append('account_number', account_number);
      const payload = {
        account_bank,
        account_name, 
        account_number
      };

      await api.patch(`/api/employee/${employeeId}`, payload);

      toast.success('Work data updated successfully!');
      
      if (onClose) onClose();
      router.refresh();
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error('Error updating work data:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update work data';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBankChange = (value: string) => {
    setAccountBank(value);
  }

  // Bank options
  const bankOptions = [
    { value: '002', label: 'BRI' },
    { value: '008', label: 'Mandiri' },
    { value: '009', label: 'BNI' },
    { value: '011', label: 'Danamon' },
    { value: '013', label: 'Permata' },
    { value: '014', label: 'BCA' },
    { value: '016', label: 'Maybank' },
    { value: '019', label: 'Panin' },
    { value: '020', label: 'Bukopin' },
    { value: '022', label: 'CIMB' },
    { value: '023', label: 'UOB' },
    { value: '028', label: 'OCBC' },
    { value: '110', label: 'BJB' },
    { value: '147', label: 'Muamalat' },
    { value: '200', label: 'BTN' },
    { value: '213', label: 'BTPN' },
    { value: '426', label: 'Mega' },
    { value: '451', label: 'SyariahMandiri' },
    { value: '950', label: 'Commonwealth' }
  ];

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Bank Selection */}
      <div>
        <Label htmlFor="bank-select">Bank</Label>
        <Select
          value={account_bank}
          onValueChange={handleBankChange}
          key={`account_bank-${account_bank}`} // Ensure re-render on bank change
        >
          <SelectTrigger id="bank-select">
            <SelectValue placeholder="Choose Bank">
              {bankOptions.find(option => option.value === account_bank)?.label || 'Choose Bank'}
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
        <Label htmlFor="account_name">Account Holder Name</Label>
        <Input 
          id="account_name"
          value={account_name}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Enter account holder name"
          required 
        />
      </div>

      {/* Account Number */}
      <div className='col-span-full'>
        <Label htmlFor="account_number">Account Number</Label>
        <Input 
          id='account_number'
          value={account_number}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Enter account number"
          required 
        />
      </div>

      {/* Form Buttons */}
      <DialogFooter className="gap-2 sm:justify-end mt-4 col-span-full">
        {onClose && ( 
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
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
