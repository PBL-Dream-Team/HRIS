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

type Absence = {
  date: string;
  name: string;
  position: string;
  type: string;
  reason: string;
  status: string;
  filedir: string;
  created_at: string;
};

interface AbsenceDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAbsence?: Absence;
  avatarUrl?: string;
}

export default function AbsenceDetails({
  open,
  onOpenChange,
  selectedAbsence,
  avatarUrl,
}: AbsenceDetailsProps) {
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
          <SheetTitle>Absence Details</SheetTitle>
        </SheetHeader>

        {selectedAbsence && avatarUrl && (
          <div className="space-y-4 my-4 px-4">
            {/* Header Info */}
            <div className="flex items-center gap-3 border rounded-md p-4">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={`/storage/employee/${avatarUrl}`} />
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
                <p className="text-sm text-muted-foreground">
                  {selectedAbsence.position}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-sm">
                {(() => {
                  switch (selectedAbsence.status) {
                    case 'APPROVED':
                      return (
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-600 inline-block mr-2" />
                          Approved
                        </div>
                      );
                    case 'REJECTED':
                      return (
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-2" />
                          Rejected
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

            {/* Absence Info */}
            <div className="border rounded-md p-4 text-sm">
              <h4 className="font-medium mb-4">Absence Information</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p className="text-muted-foreground text-xs">Create At</p>
                  <p className="font-medium">
                    {selectedAbsence.created_at.replace(/.*T/, '')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Date</p>
                  <p className="font-medium">
                    {formatDate(selectedAbsence.date)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Type</p>
                  <p className="font-medium">{selectedAbsence.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Reason</p>
                  <p className="font-medium">{selectedAbsence.reason || '-'}</p>
                </div>
              </div>
            </div>

            {/* Evidence Picture Section */}
            <div className="border rounded-md p-4 text-sm">
              <h4 className="font-medium mb-4">Evidence Picture</h4>

              {selectedAbsence.filedir ? (
                <div className="space-y-3">
                  {/* Image Preview */}
                  <div className="relative">
                    <img
                      src={`/storage/absence/${selectedAbsence.filedir}`}
                      alt="Absence evidence"
                      className="w-full max-w-sm rounded-lg border shadow-sm"
                      onError={(e) => {
                        // Fallback jika gambar tidak ditemukan
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                        }
                      }}
                    />
                    {/* Fallback text jika gambar error */}
                    <div
                      className="hidden text-muted-foreground text-center p-4 border rounded-lg bg-gray-50"
                    >
                      <p>Unable to load image</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No evidence picture available</p>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
