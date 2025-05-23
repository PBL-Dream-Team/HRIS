import React from 'react';

{/* Import Components */}

import { User, UserPlus, UserCheck, UserMinus } from 'lucide-react';
import { 
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

{/* Content */}

export default function EmployeeInformation() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4 sm:grid-cols-2">
      <Card className="@container/card bg-[#1E3A5F] text-white">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <User className="h-8 w-8" />
              <h1 className="text-xl">Total Employee</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-white text-5xl font-semibold">
            24
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div>Update: March 16, 2025</div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-[#1E3A5F] text-white">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <UserPlus className="h-8 w-8" />
              <h1 className="text-xl">New Employee</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-white text-5xl font-semibold">
            24
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div>Update: March 16, 2025</div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-[#1E3A5F] text-white">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <UserCheck className="h-8 w-8" />
              <h1 className="text-xl">Active Employee</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-white text-5xl font-semibold">
            24
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div>Update: March 16, 2025</div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-[#1E3A5F] text-white">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <UserMinus className="h-8 w-8" />
              <h1 className="text-xl">Resigned Employee</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-white text-5xl font-semibold">
            24
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div>Update: March 16, 2025</div>
        </CardFooter>
      </Card>
    </div>
  );
}
