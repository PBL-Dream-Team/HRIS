'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, DownloadIcon } from 'lucide-react';

type CheckClock = {
  date: string;
  name: string;
  position: string;
  status: string;
  clockIn: string;
  clockOut: string;
  workHours: string;
  address: string;
  approval: string;
  lat: string;
  long: string;
  location: string;
};

interface CheckClockDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCheckClock?: CheckClock;
}

export default function CheckClockDetails({
  open,
  onOpenChange,
  selectedCheckClock,
}: CheckClockDetailsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[500px] overflow-y-auto"
      >
        <SheetHeader className="px-4">
          <SheetTitle>Attendance Details</SheetTitle>
        </SheetHeader>

        {selectedCheckClock && (
          <div className="space-y-4 my-4 px-4">
            {/* Header Info */}
            <div className="flex items-center gap-3 border rounded-md p-4">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/avatars/user.jpg" />
                <AvatarFallback className="rounded-lg">
                  {selectedCheckClock.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedCheckClock.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedCheckClock.position}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    selectedCheckClock.status === 'ON_TIME'
                      ? 'bg-green-600'
                      : selectedCheckClock.status != 'ON_TIME' &&
                          selectedCheckClock.approval === 'APPROVED'
                        ? 'bg-green-600'
                        : selectedCheckClock.approval === 'PENDING'
                          ? 'bg-yellow-500'
                          : 'bg-red-600'
                  }`}
                ></span>
                <span className="text-sm text-muted-foreground">
                  {selectedCheckClock.status === 'ON_TIME'
                    ? 'ON TIME'
                    : selectedCheckClock.status === 'LATE'
                      ? 'LATE'
                      : 'EARLY'}
                </span>
              </div>
            </div>

            {/* Attendance Info */}
            <div className="border rounded-md p-4 text-sm">
              <h4 className="font-medium mb-4">Attendance Information</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p className="text-muted-foreground text-xs">Date</p>
                  <p className="font-medium">
                    {selectedCheckClock.date.replace(/T.*/, '')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Clock In</p>
                  <p className="font-medium">
                    {selectedCheckClock.clockIn.replace(/.*T/, '')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Clock Out</p>
                  <p className="font-medium">
                    {selectedCheckClock.clockOut.replace(/.*T/, '')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <p className="font-medium">
                    {selectedCheckClock.status === 'ON_TIME'
                      ? 'On Time'
                      : selectedCheckClock.status === 'LATE'
                        ? 'Late'
                        : 'Early'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Work Hours</p>
                  <p className="font-medium">
                    {selectedCheckClock.workHours != '0h'
                      ? selectedCheckClock.workHours
                      : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="border rounded-md p-4 text-sm">
              <h4 className="font-medium mb-4">Location Information</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p className="text-muted-foreground text-xs">Location</p>
                  <p className="font-medium">{selectedCheckClock.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Detail Address
                  </p>
                  <p className="font-medium">{selectedCheckClock.address}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Lat</p>
                  <p className="font-medium">{selectedCheckClock.lat}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Long</p>
                  <p className="font-medium">{selectedCheckClock.long}</p>
                </div>
              </div>
            </div>

            {/* Proof of Attendance */}
            {/* <div className="border rounded-md p-4 space-y-2 text-sm">
              <h4 className="font-medium">Proof of Attendance</h4>
              <div className="flex items-center justify-between border rounded px-3 py-2">
                <span>Proof of Attendance.jpg</span>
                <div className="flex items-center gap-2">
                  <button className="text-gray-600 hover:text-black">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-black">
                    <DownloadIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
