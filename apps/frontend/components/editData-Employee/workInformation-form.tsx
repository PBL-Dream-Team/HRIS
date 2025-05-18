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

export function EmployeeEditWorkDataForm() {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
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
        <Label>Account Holder Name</Label>
        <Input placeholder="Enter account holder name" />
      </div>

      <div className='col-span-full'>
        <Label>Account Number</Label>
        <Input placeholder="Enter account number" />
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
