'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, DownloadIcon } from 'lucide-react';
import { on } from 'events';

type Employee = {
    id: string;
    name: string;
    gender: string;
    mobile: string;
    branch: string;
    position: string;
    grade: string;
    avatar: string;
    status: boolean;
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
                  <AvatarImage src={selectedEmployee.avatar} />
                  <AvatarFallback className="rounded-lg">
                    {selectedEmployee.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedEmployee.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedEmployee.position}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      selectedEmployee.status ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  ></span>
                  <span className="text-sm text-muted-foreground">
                    {selectedEmployee.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Basic Info */}
              <div className="border rounded-md p-4 text-sm space-y-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <p className="text-muted-foreground text-xs">Gender</p>
                    <p className="font-medium">{selectedEmployee.gender}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Mobile</p>
                    <p className="font-medium">{selectedEmployee.mobile}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Branch</p>
                    <p className="font-medium">{selectedEmployee.branch}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Grade</p>
                    <p className="font-medium">{selectedEmployee.grade}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    );
}