'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import MapPicker from '@/components/map-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import api from '@/lib/axios';

type CheckClockFormProps = {
  employeeId: string;
  companyId: string;
  typeId: string;
  onSuccess?: () => void;
};

export function CheckClockForm({
  employeeId,
  companyId,
  typeId,
  onSuccess,
}: CheckClockFormProps) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLat(lat.toFixed(6));
    setLng(lng.toFixed(6));
    setAddressDetail(address);
  };

  const handleMapLoad = () => {
    setIsMapLoading(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const checkInISO = now.toISOString();

      const payload = {
        company_id: companyId,
        employee_id: employeeId,
        type_id: typeId,
        check_in: checkInISO,
        check_in_address: addressDetail,
        check_in_lat: parseFloat(lat),
        check_in_long: parseFloat(lng),
      };

      await api.post('/api/attendance', payload);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting check-in:', error);
      // optionally show toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Map Picker */}
      <div className="w-full space-y-2">
        {isMapLoading && (
          <div className="text-gray-500 text-sm text-center">
            Loading map...
          </div>
        )}
        <MapPicker
          onLocationSelect={handleLocationSelect}
          onLoad={handleMapLoad}
        />
      </div>

      {/* Address Detail */}
      <div className="w-full">
        <Label htmlFor="addressDetail">Address Detail</Label>
        <Input
          id="addressDetail"
          type="text"
          placeholder="Enter address detail"
          value={addressDetail}
          readOnly
          className="bg-gray-100 mt-1"
        />
      </div>

      {/* Lat & Long */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <Label htmlFor="lat">Lat</Label>
          <Input
            id="lat"
            type="text"
            value={lat}
            readOnly
            className="bg-gray-100 mt-1"
          />
        </div>
        <div className="w-full">
          <Label htmlFor="long">Long</Label>
          <Input
            id="long"
            type="text"
            value={lng}
            readOnly
            className="bg-gray-100 mt-1"
          />
        </div>
      </div>

      {/* Submit Button */}
      <DialogFooter className="gap-2 sm:justify-end w-full">
        <Button
          type="button"
          className="w-24"
          disabled={isMapLoading || isSubmitting || !lat || !lng}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogFooter>
    </div>
  );
}
