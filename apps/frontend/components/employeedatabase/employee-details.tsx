'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Employee = {
  id: string;
  pict_dir: string;
  workscheme: string;
  first_name: string;
  last_name: string;
  gender: string;
  address: string;
  email: string;
  phone: string;
  birth_place: string;
  nik: string;
  position: string;
  branch: string;
  contract: string;
  last_education: string;
  account_bank: string;
  account_number: string;
  account_name: string;
};

interface EmployeeDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEmployee?: Employee;
}

export default function EmployeeDetails({
  open,
  onOpenChange,
  selectedEmployee,
}: EmployeeDetailsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[500px] overflow-y-auto"
      >
        <SheetHeader className="px-4">
          <SheetTitle>Employee Details</SheetTitle>
        </SheetHeader>

        {selectedEmployee && (
          <div className="space-y-4 my-4 px-4">
            {/* Header Info */}
            <div className="flex items-center gap-3 border rounded-md p-4">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={`/storage/employee/${selectedEmployee.pict_dir}`}
                />
                <AvatarFallback className="rounded-lg">
                  {`${selectedEmployee.first_name} ${selectedEmployee.last_name}`
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedEmployee.position}
                </p>
              </div>
              {/* <div className="ml-auto flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    selectedEmployee.status ? 'bg-green-600' : 'bg-red-600'
                  }`}
                ></span>
                <span className="text-sm text-muted-foreground">
                  {selectedEmployee.status ? 'Active' : 'Inactive'}
                </span>
              </div> */}
            </div>

            {/* Basic Info */}
            <div className="border rounded-md p-4 text-sm space-y-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p className="text-muted-foreground text-xs">Work Scheme</p>
                  <p className="font-medium">{selectedEmployee.workscheme}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Gender</p>
                  <p className="font-medium">
                    {selectedEmployee.gender === 'M'
                      ? 'Male'
                      : selectedEmployee.gender === 'F'
                        ? 'Female'
                        : 'Other'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Address</p>
                  <p className="font-medium">{selectedEmployee.address}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium">{selectedEmployee.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Phone Number</p>
                  <p className="font-medium">{selectedEmployee.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Birth Place</p>
                  <p className="font-medium">{selectedEmployee.birth_place}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">NIK</p>
                  <p className="font-medium">{selectedEmployee.nik}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Branch</p>
                  <p className="font-medium">{selectedEmployee.branch}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Contract</p>
                  <p className="font-medium">{selectedEmployee.contract}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Last Education
                  </p>
                  <p className="font-medium">
                    {selectedEmployee.last_education}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Bank</p>
                  <p className="font-medium">{selectedEmployee.account_bank}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Account Number
                  </p>
                  <p className="font-medium">
                    {selectedEmployee.account_number}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Account Name</p>
                  <p className="font-medium">{selectedEmployee.account_name}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
