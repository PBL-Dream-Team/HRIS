'use client';

import { Label } from '@/components/ui/label';
import { useState } from 'react';

import { MdImage } from 'react-icons/md';
import MapPicker from '@/components/map-picker';
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLat(lat.toFixed(6));
    setLng(lng.toFixed(6));
    setAddressDetail(address);
  };
  return (
    <form>
      <div className="flex flex-col md:flex-row gap-x-6">
        {/* Left Form*/}
        <div className="w-full md:w-1/2 mb-4 md:mb-0 space-y-4">
          <Label htmlFor="letterType">Absence Type</Label>
          <div className="mt-2">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-Choose Absence Type-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="ontime">On Time</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Label htmlFor="letterPicture">Upload Evidence Picture</Label>
          <div className="mt-2 relative w-full aspect-[20/19] border rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition cursor-pointer">
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

        {/* Form Right */}
        <div className="w-full md:w-1/2 space-y-4">
          <Label htmlFor="location">Work Location</Label>
          <div className="mt-2">
            <Select>
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
          <MapPicker onLocationSelect={handleLocationSelect} />

          <Label htmlFor="addressDetail">Address Detail</Label>
          <div className="mt-2">
            <Input
              id="addressDetail"
              type="text"
              placeholder="Enter address detail"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
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

      <DialogFooter className="gap-2 sm:justify-end mt-4">
        <Button type="submit" className="w-20">
          Submit
        </Button>
      </DialogFooter>
    </form>
  );
}
