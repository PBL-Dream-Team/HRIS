'use client'
import React, { useEffect, useState } from 'react';

{/* Import Components */ }

import { User, UserPlus, UserCheck, UserMinus } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

{/* Content */ }

type EmployeeInformationProps = {
  totalEmployees: number;
};

export default function EmployeeInformation({ totalEmployees }: EmployeeInformationProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };

    // Format ke '25 May 2025'
    const localDate = date.toLocaleDateString('en-US', options);
    setFormattedDate(localDate);
  }, []);


  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4 sm:grid-cols-2">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <User className="h-8 w-8" />
              <h1 className="text-xl">Total Employees</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-black text-5xl font-semibold">
            {totalEmployees}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="text-muted-foreground">Update: {formattedDate}</div>
        </CardFooter>
      </Card>



      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <UserPlus className="h-8 w-8" />
              <h1 className="text-xl">New Employees</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-black text-5xl font-semibold">
            24
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className='text-muted-foreground'>Update: March 16, 2025</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <UserCheck className="h-8 w-8" />
              <h1 className="text-xl">Active Employees</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-black text-5xl font-semibold">
            24
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className='text-muted-foreground'>Update: March 16, 2025</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <UserMinus className="h-8 w-8" />
              <h1 className="text-xl">Resigned Employees</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-black text-5xl font-semibold">
            24
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className='text-muted-foreground'>Update: March 16, 2025</div>
        </CardFooter>
      </Card>
    </div>
  );
}
