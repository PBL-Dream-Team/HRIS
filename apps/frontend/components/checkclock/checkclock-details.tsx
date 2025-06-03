'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';

type CheckClock = {
  date: string;
  name: string;
  avatarUrl?: string;
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';

    try {
      // Konversi string ke Date object
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: enUS });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Fallback ke string asli jika error
    }
  };

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
                <AvatarImage src={`/storage/employee/${selectedCheckClock.avatarUrl}`} />
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
              <div className="ml-auto flex items-center gap-2 text-sm">
                {(() => {
                  switch (selectedCheckClock.approval) {
                    case 'APPROVED':
                      return (
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2" />
                          Approved
                        </div>
                      );
                    case 'DISSAPPROVED':
                      return (
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-2" />
                          Dissaproved
                        </div>
                      );
                    case 'PENDING':
                      return (
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block mr-2" />
                          Pending
                        </div>
                      );
                    default:
                      return (
                        <span className="text-gray-500 font-medium">
                          Unknown Status
                        </span>
                      );
                  }
                })()}
              </div>
            </div>

            {/* Attendance Info */}
            <div className="border rounded-md p-4 text-sm">
              <h4 className="font-medium text-md mb-4">Attendance Information</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p className="text-muted-foreground text-xs">Date</p>
                  <p className="font-medium">
                    {formatDate(selectedCheckClock.date)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <p className="font-medium">
                    {(() => {
                      switch (selectedCheckClock.status) {
                        case 'ON_TIME':
                          return (
                            <span className=" text-green-600">On Time</span>
                          );
                        case 'LATE':
                          return (
                            <span className=" text-red-600">Late</span>
                          );
                        case 'EARLY':
                          return (
                            <span className=" text-yellow-600">Early</span>
                          );
                        default:
                          return (
                            <span className="text-gray-500 font-medium">
                              Unknown Status
                            </span>
                          );
                      }
                    })()}
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
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
