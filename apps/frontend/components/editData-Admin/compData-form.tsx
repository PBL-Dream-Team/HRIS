'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import MapPicker from '@/components/clickable-map/map-picker';

type EditCompanyProps = {
  companyId: string;
  initialData?: {
    id: string;
    name: string;
    address: string;
    loc_lat: number | string;
    loc_long: number | string;
  }
  onSuccess?: () => void;
  onClose?: () => void;
};

export function EditCompany({
  companyId,
  initialData,
  onSuccess,
  onClose
}: EditCompanyProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [loc_lat, setLocLat] = useState<string>('');
  const [loc_long, setLocLong] = useState<string>('');

  useEffect(() => {
    console.log('initialData received:', initialData);
    if (initialData) {
      setName(initialData.name || '');
      setAddress(initialData.address || '');
      setLocLat(initialData.loc_lat?.toString() || '');
      setLocLong(initialData.loc_long?.toString() || '');
    }
  }, [initialData]);

  const handleMapLoad = () => {
    setIsMapLoading(false);
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    console.log('Location selected:', { lat, lng, address });
    setLocLat(lat.toFixed(6));
    setLocLong(lng.toFixed(6));
    setAddress(address);
  };

  const validateCoordinates = (): boolean => {
    // Validasi bahwa latitude dan longitude tidak kosong
    if (!loc_lat || !loc_long) {
      toast.error('Please select a location on the map');
      return false;
    }

    // Konversi ke number untuk validasi range
    const latNum = parseFloat(loc_lat);
    const longNum = parseFloat(loc_long);

    // Validasi range latitude (-90 sampai 90)
    if (isNaN(latNum)) {
      toast.error('Latitude must be a valid number');
      return false;
    }

    // Validasi range longitude (-180 sampai 180)
    if (isNaN(longNum)) {
      toast.error('Longitude must be a valid number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validasi koordinat
      if (!validateCoordinates()) {
        setIsSubmitting(false);
        return;
      }

      const payload = {
        name,
        address,
        loc_lat: parseFloat(loc_lat), 
        loc_long: parseFloat(loc_long),
      };

      console.log('Payload being sent:', payload);

      await api.patch(`/api/company/${companyId}`, payload);

      toast.success('Company updated successfully');
      onClose?.();
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error updating company:', error);
      toast.error(error.response?.data?.message || 'Failed to update company');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className="w-full space-y-2">
            {isMapLoading && (
              <div className="text-gray-500 text-sm text-center">Loading map...</div>
            )}
            <MapPicker 
              onLocationSelect={handleLocationSelect} 
              onLoad={handleMapLoad}
              initialPosition={
                initialData && initialData.loc_lat && initialData.loc_long
                  ? { 
                      lat: parseFloat(initialData.loc_lat.toString()), 
                      lng: parseFloat(initialData.loc_long.toString()) 
                    }
                  : undefined
              }
            />
          </div>

        <div className='grid grid-cols-1 gap-4'>
          <div>
            <Label>Company Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Company name"
            />
          </div>
          <div>
            <Label>Company Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address detail of your company"
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>Latitude</Label>
              <Input
                value={loc_lat}
                onChange={(e) => setLocLat(e.target.value)}
                placeholder="Latitude of your company"
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                value={loc_long}
                onChange={(e) => setLocLong(e.target.value)}
                placeholder="Longitude of your company"
              />
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:justify-end mt-4 col-span-full">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
}