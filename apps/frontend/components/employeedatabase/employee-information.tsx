import React, { useEffect, useState } from 'react';

{
  /* Import Components */
}

import { User, UserPlus, UserCheck, UserMinus } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

{
  /* Content */
}

export default function EmployeeInformation({
  employeeInfo,
}: {
  employeeInfo: {
    total: number;
    newEmployees: number;
    activeEmployees: number;
    absentEmployees: number;
  };
}) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    const localDate = date.toLocaleDateString('en-US', options);
    setFormattedDate(localDate);
  }, []);

  return (
    <div className="grid auto-rows-min gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <User className="h-8 w-8 hidden sm:block" />
              <h1 className="text-xl">Total Employees</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-black text-5xl font-semibold">
            {employeeInfo.total}
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
              <UserPlus className="h-8 w-8 hidden sm:block" />
              <h1 className="text-xl">New Employees</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-black text-5xl font-semibold">
            {employeeInfo.newEmployees}
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
              <UserCheck className="h-8 w-8 hidden sm:block" />
              <h1 className="text-xl">Active Employees</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-black text-5xl font-semibold">
            {employeeInfo.activeEmployees}
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
              <UserMinus className="h-8 w-8 hidden sm:block" />
              <h1 className="text-xl">Absent Employees</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-black text-5xl font-semibold">
            {employeeInfo.absentEmployees}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="text-muted-foreground">Update: {formattedDate}</div>
        </CardFooter>
      </Card>
    </div>
  );
}
