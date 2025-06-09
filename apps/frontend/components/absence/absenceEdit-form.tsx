'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
import api from '@/lib/axios';
import { toast } from 'sonner';

type AbsenceType = 'SICK' | 'PERMIT' | 'LEAVE';

type AbsenceEditFormProps = {
  employeeId: string;
  companyId: string;
  initialData?: {
    id: string;
    type: AbsenceType;
    date: string;
    reason: string;
    filedir: string;
  };
  onSuccess?: () => void;
  onClose?: () => void;
};

export function AbsenceEditForm({
  initialData,
  onSuccess,
  onClose,
}: AbsenceEditFormProps) {
  const [absentType, setAbsentType] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const typeOptions = [
    { value: 'SICK', label: 'Sick' },
    { value: 'PERMIT', label: 'Permission' },
    { value: 'LEAVE', label: 'Leave' },
  ];

  useEffect(() => {
    console.log('Initial data:', initialData);
    if (initialData) {
      setAbsentType(initialData.type || '');
      setDate(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '');
      setReason(initialData.reason || '');
      
      // Set existing file URL if filedir exists
      if (initialData.filedir) {
        setExistingFileUrl(`/storage/absence/${initialData.filedir}`);
      }
      
      // Reset file input dan preview URL untuk file baru
      setFile(null);
      setPreviewUrl(null);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      // Clear existing file URL when new file is selected
      setExistingFileUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!absentType) {
      toast.error('Please select an absent type.');
      return;
    }
    if (!date) {
      toast.error('Please select a date.');
      return;
    }
    if (!reason) {
      toast.error('Please provide a reason for the absence.');
      return;
    }
    if (!file) {
      toast.error('Please upload an evidence picture.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('date', new Date(date).toISOString());
      formData.append('type', absentType.toUpperCase());
      if (reason) formData.append('reason', reason);
      if (file) formData.append('file', file);

      await api.patch(`/api/absence/${initialData?.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Absence updated successfully!');

      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      console.error('Submit error:', err);
      const errorMessage = err.response?.data?.message || 'Something went wrong.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to get display image source
  const getImageSource = () => {
    if (previewUrl) return previewUrl; // New file preview
    if (existingFileUrl) return existingFileUrl; // Existing file
    return null;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-4">
          <div>
            <Label htmlFor="absentType">Absent Type*</Label>
            <Select 
              value={absentType}
              onValueChange={setAbsentType}
              key={`absentType-${absentType}`}
            
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-Choose Absent Type-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SICK">Sick</SelectItem>
                <SelectItem value="PERMIT">Permission</SelectItem>
                <SelectItem value="LEAVE">Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Date*</Label>
            <div className='relative'>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pr-4 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                style={{
                  colorScheme: 'light',
                }}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Reason*</Label>
            <Input
              id="reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional reason"
            
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-4">
          <Label>Evidence Picture*</Label>
          
          {/* Image Preview Area */}
          <div className="relative w-full aspect-[8/5] border rounded-lg shadow-sm overflow-hidden bg-gray-50">
            {getImageSource() ? (
              <Image
                src={getImageSource()!}
                alt={previewUrl ? "New Preview" : "Existing Evidence"}
                fill
                unoptimized
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="flex flex-col items-center justify-center text-gray-500 text-sm">
                  <MdImage className="text-4xl mb-2" />
                  No image selected
                </span>
              </div>
            )}
          </div>

          {/* Edit/Upload Button */}
          <div className="flex gap-2">
            <Button
              onClick={() => document.getElementById('letterPicture')?.click()}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <MdImage className="text-lg" />
              {getImageSource() ? 'Change Image' : 'Upload Image'}
            </Button>
            
            {getImageSource() && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                  setExistingFileUrl(null);
                  // Reset file input
                  const fileInput = document.getElementById('letterPicture') as HTMLInputElement;
                  if (fileInput) fileInput.value = '';
                }}
                className="px-4 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            )}
          </div>

          {/* Hidden File Input */}
          <Input
            id="letterPicture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          
          />
          
        </div>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <DialogFooter className="mt-6 sm:justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-24" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
}