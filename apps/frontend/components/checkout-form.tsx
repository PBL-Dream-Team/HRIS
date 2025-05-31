'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import MapPicker from '@/components/map-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import api from '@/lib/axios';

interface CheckOutFormProps {
  attendanceId: string;
  onSuccess?: () => void;
}

export function CheckOutForm({ attendanceId, onSuccess }: CheckOutFormProps) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLat(lat.toFixed(6));
    setLng(lng.toFixed(6));
    setAddressDetail(address);
  };

  const handleMapLoad = () => {
    setIsMapLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!lat || !lng || !addressDetail) {
      setError('Please select a location on the map.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        check_out: new Date().toISOString(),
        check_out_address: addressDetail,
        check_out_long: parseFloat(lng),
        check_out_lat: parseFloat(lat),
      };

      await api.patch(`/api/attendance/${attendanceId}`, payload);

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      <div className="w-full space-y-2">
        {isMapLoading && (
          <div className="text-gray-500 text-sm text-center">Loading map...</div>
        )}
        <MapPicker onLocationSelect={handleLocationSelect} onLoad={handleMapLoad} />
      </div>

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

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <DialogFooter className="gap-2 sm:justify-end w-full">
        <Button type="submit" className="w-24" disabled={isMapLoading || isSubmitting}>
          {isSubmitting ? 'Submitting...' : isMapLoading ? 'Loading...' : 'Submit'}
        </Button>
      </DialogFooter>
    </form>
  );
}
