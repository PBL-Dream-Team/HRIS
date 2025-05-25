'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, DownloadIcon } from 'lucide-react';

type Absence = {
  date: string;
  name: string;
  position: string;
  type: string;
  reason: string;
  status: string;
  duration: string;
  address: string;
  location: string;
};

interface AbsenceDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAbsence?: Absence;
}

export default function AbsenceDetails({
  open,
  onOpenChange,
  selectedAbsence,
}: AbsenceDetailsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] overflow-y-auto">
        <SheetHeader className="px-4">
          <SheetTitle>Absence Details</SheetTitle>
        </SheetHeader>

        {selectedAbsence && (
          <div className="space-y-4 my-4 px-4">
            {/* Header Info */}
            <div className="flex items-center gap-3 border rounded-md p-4">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/avatars/user.jpg" />
                <AvatarFallback className="rounded-lg">
                  {selectedAbsence.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedAbsence.name}</p>
                <p className="text-sm text-muted-foreground">{selectedAbsence.position}</p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                {selectedAbsence.status}
              </div>
            </div>

            {/* Absence Info */}
            <div className="border rounded-md p-4 text-sm">
              <h4 className="font-medium mb-4">Absence Information</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p className="text-muted-foreground text-xs">Date</p>
                  <p className="font-medium">{selectedAbsence.date.replace(/T.*/, '')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Type</p>
                  <p className="font-medium">{selectedAbsence.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Duration</p>
                  <p className="font-medium">{selectedAbsence.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Reason</p>
                  <p className="font-medium">{selectedAbsence.reason || '-'}</p>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="border rounded-md p-4 text-sm">
              <h4 className="font-medium mb-4">Location Information</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p className="text-muted-foreground text-xs">Location</p>
                  <p className="font-medium">{selectedAbsence.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Address</p>
                  <p className="font-medium">{selectedAbsence.address}</p>
                </div>
              </div>
            </div>

            {/* Optional: Attachment Proof */}
            {/* 
            <div className="border rounded-md p-4 space-y-2 text-sm">
              <h4 className="font-medium">Attachment</h4>
              <div className="flex items-center justify-between border rounded px-3 py-2">
                <span>DoctorNote.pdf</span>
                <div className="flex items-center gap-2">
                  <button className="text-gray-600 hover:text-black">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-black">
                    <DownloadIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div> 
            */}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
