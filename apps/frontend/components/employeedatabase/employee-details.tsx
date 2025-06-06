'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
  birth_date: string;
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

function formatDateIndo(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
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
            {/* Avatar & Name */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16 rounded-lg">
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
                    <p className="font-medium text-lg">{`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmployee.position}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Gender</span>
                  <div className="font-medium">
                    {selectedEmployee.gender === 'M'
                      ? 'Male'
                      : selectedEmployee.gender === 'F'
                        ? 'Female'
                        : 'Other'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">
                    Date of Birth
                  </span>
                  <div className="font-medium">
                    {formatDateIndo(selectedEmployee.birth_date)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">
                    Birth Place
                  </span>
                  <div className="font-medium">
                    {selectedEmployee.birth_place}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">NIK</span>
                  <div className="font-medium">{selectedEmployee.nik}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">
                    Last Education
                  </span>
                  <div className="font-medium">
                    {selectedEmployee.last_education}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Address</span>
                  <div className="font-medium">{selectedEmployee.address}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Email</span>
                  <div className="font-medium">{selectedEmployee.email}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">
                    Phone Number
                  </span>
                  <div className="font-medium">{selectedEmployee.phone}</div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">
                    Work Scheme
                  </span>
                  <div className="font-medium">
                    {selectedEmployee.workscheme}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">
                    Position
                  </span>
                  <div className="font-medium">{selectedEmployee.position}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Branch</span>
                  <div className="font-medium">{selectedEmployee.branch}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">
                    Contract
                  </span>
                  <div className="font-medium">{selectedEmployee.contract}</div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Information */}
            <Card>
              <CardHeader>
                <CardTitle>Bank Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Bank</span>
                  <div className="font-medium">
                    {selectedEmployee.account_bank}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">
                    Account Number
                  </span>
                  <div className="font-medium">
                    {selectedEmployee.account_number}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">
                    Account Name
                  </span>
                  <div className="font-medium">
                    {selectedEmployee.account_name}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
