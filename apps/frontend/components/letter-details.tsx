'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
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
  description: string;
  validUntil: string;
  status: string;
};

interface LetterDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLetter?: any;
}

export default function LetterDetails({
  open,
  onOpenChange,
  selectedLetter,
}: LetterDetailsProps) {
  const [letter, setLetter] = useState<Letter | null>(null);

  useEffect(() => {
    if (!open || !selectedLetter) return;

    const fetchLetterDetails = async () => {
      try {
        const [employeeRes, letterTypeRes] = await Promise.all([
          api.get(`/api/employee/${selectedLetter.employee_id}`),
          api.get(`/api/letterType/${selectedLetter.lettertype_id}`),
        ]);

        const employee = employeeRes.data.data;

        const finalLetter: Letter = {
          employeeName: `${employee.first_name} ${employee.last_name}`,
          position: employee.position || '-',
          letterName: selectedLetter.name,
          letterType: selectedLetter.letter_type,
          description: selectedLetter.desc,
          validUntil: selectedLetter.valid_until,
          status: selectedLetter.is_active ? 'Active' : 'Inactive',
        };

        setLetter(finalLetter);
      } catch (error) {
        console.error('Error fetching letter details:', error);
      }
    };

    fetchLetterDetails();
  }, [open, selectedLetter]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] overflow-y-auto">
        <SheetHeader className="px-4">
          <SheetTitle>Letter Details</SheetTitle>
        </SheetHeader>

        {letter && (
          <div className="space-y-4 my-4 px-4">
            <div className="flex items-center gap-3 border rounded-md p-4">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/avatars/user.jpg" />
                <AvatarFallback className="rounded-lg">
                  {letter.employeeName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{letter.employeeName}</p>
                <p className="text-sm text-muted-foreground">{letter.position}</p>
              </div>
            </div>

            <div className="border rounded-md p-4 text-sm space-y-3">
              <h4 className="font-medium mb-4">Letter Information</h4>
              <div>
                <p className="text-muted-foreground text-xs">Letter Name</p>
                <p className="font-medium">{letter.letterName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Letter Type</p>
                <p className="font-medium">{letter.letterType}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Description</p>
                <p className="font-medium">{letter.description}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Valid Until</p>
                <p className="font-medium">{letter.validUntil}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Status</p>
                <div className="ml-auto flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      letter.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {letter.status}
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
