import React from 'react';

{
  /* Import Components */
}

import {
  AlarmClock,
  AlarmClockCheck,
  AlarmClockMinus,
  AlarmClockOff,
} from 'lucide-react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type WorkInformationProps = {
  workHours: string;
  onTimeDays: number;
  lateDays: number;
  leaveDays: number;
};
export default function WorkInformation({
  workHours,
  onTimeDays,
  lateDays,
  leaveDays,
}: WorkInformationProps) {
  return (
    <div className="grid auto-rows-min gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <AlarmClock className="h-8 w-8" />
              <h1 className="text-xl">Work Hours</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-black text-4xl font-semibold">
            {workHours}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <AlarmClockCheck className="h-8 w-8" />
              <h1 className="text-xl">On Time</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-[#257047] text-4xl font-semibold">
            {onTimeDays} days
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <AlarmClockMinus className="h-8 w-8" />
              <h1 className="text-xl">Late</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-[#FFAB00] text-4xl font-semibold">
            {lateDays} days
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <AlarmClockOff className="h-8 w-8" />
              <h1 className="text-xl">Leave</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-[#C11106] text-4xl font-semibold">
            {leaveDays} days
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
