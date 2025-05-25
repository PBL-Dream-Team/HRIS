'use client';

import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { MdImage } from 'react-icons/md';
import MapPicker from '@/components/map-picker';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CheckClockForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [absenceType, setAbsenceType] = useState('');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [absentType, setAbsentType] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [checkClockType, setCheckClockType] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLat(lat.toFixed(6));
    setLng(lng.toFixed(6));
    setAddressDetail(address);
  };

  return (
    <form>
      <div className="space-y-4">
        <Label htmlFor="absenceType">Absence Type</Label>
        <Select onValueChange={setAbsenceType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="-Choose Absence Type-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
          </SelectContent>
        </Select>

        {absenceType === 'present' && (
          <div className="flex flex-col md:flex-row gap-x-6">
            {/* Present form - Left (No image) */}
            <div className="w-full md:w-1/2 space-y-4">
              <MapPicker onLocationSelect={handleLocationSelect} />
            </div>

            {/* Present form - Right (Lat/Lng) */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div>
                <Label htmlFor="checkClockType">Check Clock Type</Label>
                <Select onValueChange={setCheckClockType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-Choose Status-" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clockin">Clock In</SelectItem>
                    <SelectItem value="clockout">Clock Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Work Location</Label>
                <Select onValueChange={setLocation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-Choose Location-" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WFO">WFO</SelectItem>
                    <SelectItem value="WFH">WFH</SelectItem>
                    <SelectItem value="WFA">WFA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="addressDetail">Address Detail</Label>
                <Input
                  id="addressDetail"
                  type="text"
                  placeholder="Enter address detail"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-x-6">
                <div className="w-full md:w-1/2 space-y-4">
                  <Label htmlFor="lat">Lat</Label>
                  <div className="mt-2">
                    <Input
                      id="lat"
                      type="text"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <Label htmlFor="long">Long</Label>
                  <div className="mt-2">
                    <Input
                      id="long"
                      type="text"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {absenceType === 'absent' && (
          <div className="flex flex-col md:flex-row gap-x-6">
            {/* Absent form - Left (No image) */}
            <div className="w-full md:w-1/2 space-y-4">
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

              <div>
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-Choose Status-" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve</SelectItem>
                    <SelectItem value="rejected">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Absent form - Right*/}

            <div className="w-full md:w-1/2 flex flex-col gap-4">
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
        )}
      </div>

      <DialogFooter className="gap-2 sm:justify-end mt-6">
        <Button type="submit" className="w-24">
          Submit
        </Button>
      </DialogFooter>
    </form>
  );
}
