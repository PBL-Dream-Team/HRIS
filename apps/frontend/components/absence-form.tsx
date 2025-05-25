'use client';

import { useState } from 'react';
import { MdImage } from 'react-icons/md';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

export function AbsenceForm() {
  const [absentType, setAbsentType] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Form Fields */}
        <div className="flex-1 space-y-4">
          <div>
            <Label htmlFor="absentType">Absent Type</Label>
            <Select onValueChange={setAbsentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-Choose Absent Type-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sick">Sick</SelectItem>
                <SelectItem value="permission">Permission</SelectItem>
                <SelectItem value="leave">Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column: Upload Picture */}
        <div className="flex-1 space-y-2">
          <Label htmlFor="letterPicture">Upload Evidence Picture</Label>
          <div className="relative w-full aspect-[8/5] border rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition cursor-pointer">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="flex flex-col items-center justify-center text-black text-sm">
                <MdImage className="text-3xl text-[#1E3A5F] mb-1" />
                Click to upload
              </span>
            )}
            <Input
              id="letterPicture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <DialogFooter className="mt-6 sm:justify-end">
        <Button type="submit" className="w-full sm:w-24">
          Submit
        </Button>
      </DialogFooter>
    </div>
  );
}
