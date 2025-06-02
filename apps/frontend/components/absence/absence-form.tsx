'use client';

import { useState } from 'react';
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

interface AbsenceFormProps {
  employeeId: string;
  companyId: string;
  onSuccess?: () => void;
}

export function AbsenceForm({
  employeeId,
  companyId,
  onSuccess,
}: AbsenceFormProps) {
  const [absentType, setAbsentType] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!absentType) {
      setError('Please select an absent type.');
      return;
    }
    if (!date) {
      setError('Please select a date.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('company_id', companyId);
      formData.append('employee_id', employeeId);
      formData.append('date', new Date(date).toISOString());
      formData.append('type', absentType.toUpperCase());
      if (reason) formData.append('reason', reason);
      if (file) formData.append('file', file);

      await api.post('/api/absence', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAbsentType('');
      setDate('');
      setReason('');
      setFile(null);
      setPreviewUrl(null);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as any).response?.data?.message
      ) {
        setError((err as any).response.data.message);
      } else {
        setError('Failed to submit absence');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-4">
          <div>
            <Label htmlFor="absentType">Absent Type</Label>
            <Select onValueChange={setAbsentType} value={absentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-Choose Absent Type-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sick">Sick</SelectItem>
                <SelectItem value="permit">Permission</SelectItem>
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
              placeholder="Optional reason"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-2">
          <Label htmlFor="letterPicture">Upload Evidence Picture</Label>
          <div className="relative w-full aspect-[8/5] border rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition cursor-pointer overflow-hidden">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                unoptimized
                className="object-cover rounded-lg"
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

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <DialogFooter className="mt-6 sm:justify-end">
        <Button type="submit" className="w-full sm:w-24" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogFooter>
    </form>
  );
}
