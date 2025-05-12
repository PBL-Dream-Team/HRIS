import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { FaFile } from 'react-icons/fa6';
import { DialogFooter } from '@/components/ui/dialog';

export function LetterForm() {
  const [date, setDate] = useState<Date | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  return (
    <form>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 space-y-4">
          <div className="mb-4">
            <Label htmlFor="employee">Employee</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-Choose Employee-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee1">Employee 1</SelectItem>
                <SelectItem value="employee2">Employee 2</SelectItem>
                <SelectItem value="employee3">Employee 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="mb-4">
            <Label htmlFor="letterType">Letter Type</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-Choose Letter-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="letter1">Letter 1</SelectItem>
                <SelectItem value="letter2">Letter 2</SelectItem>
                <SelectItem value="letter3">Letter 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="letterName">Letter Name</Label>
        <Input id="letterName" type="text" placeholder="Enter letter name" />
      </div>
      <div className="mb-4">
        <Label htmlFor="letterDescription">Letter Description</Label>
        <Input
          id="letterDescription"
          type="text"
          placeholder="Enter letter description"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 space-y-4">
      <Label htmlFor="letterFile">Upload Letter File</Label>
      <div className="mt-2 relative w-full aspect-[3/1] border-2 border-dashed rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition cursor-pointer">
        {selectedFile ? (
          <div className="flex flex-col items-center justify-center text-black text-sm">
            <FaFile className="text-2xl text-[#1E3A5F] mb-1" />
            <span className="text-sm text-center px-2 break-all">{selectedFile.name}</span>
          </div>
        ) : (
          <span className="flex flex-col items-center justify-center text-black text-sm">
            <FaFile className="text-2xl text-[#1E3A5F] mb-1" />
            Click to upload
          </span>
        )}
        <Input
          id="letterFile"
          type="file"
          accept="*/*"
          onChange={handleFileChange}
          className="absolute opacity-0 w-full h-full cursor-pointer"
        />
      </div>
    </div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="mb-4">
            <Label htmlFor="letterStatus">Letter Status</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-Choose Letter Status-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="notactive">Not Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="validUntil">Valid Until</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd/MM/yyyy') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <DialogFooter className="gap-2 sm:justify-end">
        <Button type="submit" className="w-20">
          Submit
        </Button>
      </DialogFooter>
    </form>
  );
}
