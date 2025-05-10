import React from 'react'

{/* Import Components */}

import { 
    AlarmClock,
    AlarmClockCheck,
    AlarmClockMinus,
    AlarmClockOff
} from 'lucide-react';

import { 
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function WorkInformation() {
  return (
    <div className='grid auto-rows-min gap-4 md:grid-cols-4 sm:grid-cols-2'>
        <Card className="@container/card bg-[#1E3A5F] text-white">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <AlarmClock className="h-8 w-8" />
              <h1 className="text-xl">Work Hours</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-white text-4xl font-semibold">
            120h 54m
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="@container/card bg-[#1E3A5F] text-white">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <AlarmClockCheck className="h-8 w-8" />
              <h1 className="text-xl">On Time</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-white text-4xl font-semibold">
            24 days
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="@container/card bg-[#1E3A5F] text-white">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <AlarmClockMinus className="h-8 w-8" />
              <h1 className="text-xl">Late</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-white text-4xl font-semibold">
            24 days
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="@container/card bg-[#1E3A5F] text-white">
        <CardHeader className="relative">
          <CardTitle>
            <div className="flex items-center gap-2">
              <AlarmClockOff className="h-8 w-8" />
              <h1 className="text-xl">Leave</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-white text-4xl font-semibold">
            24 days
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
