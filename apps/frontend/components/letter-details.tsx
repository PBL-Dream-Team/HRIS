'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Letter = {
  employeeName: string;
  position: string;
  letterName: string;
  letterType: string;
  validUntil: string;
  status: string;
};

interface LetterDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLetter?: Letter;
}

export default function LetterDetails({
  open,
  onOpenChange,
  selectedLetter,
}: LetterDetailsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[500px] overflow-y-auto"
      >
        <SheetHeader className="px-4">
          <SheetTitle>Letter Details</SheetTitle>
        </SheetHeader>

        {selectedLetter && (
          <div className="space-y-4 my-4 px-4">
            {/* Header Info */}
            <div className="flex items-center gap-3 border rounded-md p-4">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/avatars/user.jpg" />
                <AvatarFallback className="rounded-lg">
                  {selectedLetter.employeeName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedLetter.employeeName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedLetter.position}
                </p>
              </div>
              
            </div>

            {/* Letter Details */}
            <div className="border rounded-md p-4 text-sm space-y-3">
              <h4 className="font-medium mb-4">Letter Information</h4>
              <div>
                <p className="text-muted-foreground text-xs">Letter Name</p>
                <p className="font-medium">{selectedLetter.letterName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Letter Type</p>
                <p className="font-medium">{selectedLetter.letterType}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Valid Until</p>
                <p className="font-medium">{selectedLetter.validUntil}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Status</p>
                <div className="ml-auto flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    selectedLetter.status === 'Active'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                ></span>
                <span className="text-sm font-medium text-muted-foreground">
                  {selectedLetter.status}
                </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
