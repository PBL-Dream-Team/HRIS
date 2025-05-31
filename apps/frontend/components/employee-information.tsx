import React from 'react';

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

export default function EmployeeInformation(props: any) {
  const employees = props.employees;

  const total = employees.length;

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
            {total}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="text-muted-foreground">Update: March 16, 2025</div>
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
          <div className="text-muted-foreground">Update: March 16, 2025</div>
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
          <div className="text-muted-foreground">Update: March 16, 2025</div>
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
          <div className="text-muted-foreground">Update: March 16, 2025</div>
        </CardFooter>
      </Card>
    </div>
  );
}
