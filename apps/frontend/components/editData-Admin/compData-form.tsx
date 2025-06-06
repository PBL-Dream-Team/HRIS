'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import MapPicker from '@/components/clickable-map/map-picker';
import { Search } from 'lucide-react';

type EditCompanyProps = {
  companyId: string;
  initialData?: {
    name: string;
    address: string;
    loc_lat: number | string;
    loc_long: number | string;
  };
  onSuccess?: () => void;
  onClose?: () => void;
};

export function EditCompany({
  companyId,
  initialData,
  onSuccess,
  onClose,
}: EditCompanyProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [loc_lat, setLocLat] = useState<string>('');
  const [loc_long, setLocLong] = useState<string>('');
  const [mapKey, setMapKey] = useState(0); // Key untuk force re-render map

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

  // Fungsi untuk geocoding alamat ke koordinat
  const geocodeAddress = useCallback(async (addressText: string) => {
    if (!addressText.trim()) {
      toast.error('Please enter an address');
      return;
    }

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressText)}&format=json&addressdetails=1&limit=1`,
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        setLocLat(lat.toFixed(6));
        setLocLong(lng.toFixed(6));

        // Force re-render map dengan posisi baru
        setMapKey((prev) => prev + 1);

        toast.success('Location found and updated on map');
      } else {
        toast.error(
          'Address not found. Please try a more specific address or click on the map manually.',
        );
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error(
        'Failed to find location. Please try again or click on the map manually.',
      );
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  // Handler untuk tombol search address
  const handleSearchAddress = () => {
    geocodeAddress(address);
  };

  // Auto-geocoding ketika user berhenti mengetik (debounced)
  useEffect(() => {
    if (!address.trim()) return;

    const timeoutId = setTimeout(() => {
      // Hanya lakukan auto-geocoding jika alamat berubah dari initial data
      if (initialData?.address !== address) {
        geocodeAddress(address);
      }
    }, 2000); // Delay 2 detik setelah user berhenti mengetik

    return () => clearTimeout(timeoutId);
  }, [address, geocodeAddress, initialData?.address]);

  const validateCoordinates = (): boolean => {
    // Validasi bahwa latitude dan longitude tidak kosong
    if (!loc_lat || !loc_long) {
      toast.error(
        'Please select a location on the map or search for an address',
      );
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

    // Validasi input sebelum submit
    if (!name) {
      toast.error('Company name is required');
      return;
    }
    if (!address) {
      toast.error('Company address is required');
      return;
    }
    if (!loc_lat || !loc_long) {
      toast.error('Please select a location on the map or search for an address');
      return;
    }
    if (name.length < 3) {
      toast.error('Company name must be at least 3 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      // Validasi koordinat
      if (!validateCoordinates()) {
        setIsSubmitting(false);
        return;
      }

      await api.patch(`/api/company/${companyId}`, {
        name,
        address,
        loc_lat: parseFloat(loc_lat),
        loc_long: parseFloat(loc_long),
      });

      toast.success('Company Data updated successfully');
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full space-y-2">
          {isMapLoading && (
            <div className="text-gray-500 text-sm text-center">
              Loading map...
            </div>
          )}
          <MapPicker
            key={mapKey} // Force re-render when coordinates change
            onLocationSelect={handleLocationSelect}
            onLoad={handleMapLoad}
            initialPosition={
              loc_lat && loc_long
                ? {
                    lat: parseFloat(loc_lat),
                    lng: parseFloat(loc_long),
                  }
                : initialData && initialData.loc_lat && initialData.loc_long
                  ? {
                      lat: parseFloat(initialData.loc_lat.toString()),
                      lng: parseFloat(initialData.loc_long.toString()),
                    }
                  : undefined
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Company Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Company name"
            />
          </div>

          <div>
            <Label>Company Address *</Label>
            <div className="flex gap-2">
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address detail of your company"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSearchAddress}
                disabled={isGeocoding || !address.trim()}
                title="Search location for this address"
              >
                <Search
                  className={`h-4 w-4 ${isGeocoding ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter address and click search, or the map will auto-update after
              you stop typing
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Latitude *</Label>
              <Input
                value={loc_lat}
                onChange={(e) => setLocLat(e.target.value)}
                placeholder="Latitude of your company"
                readOnly
              />
            </div>
            <div>
              <Label>Longitude *</Label>
              <Input
                value={loc_long}
                onChange={(e) => setLocLong(e.target.value)}
                placeholder="Longitude of your company"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:justify-end mt-4 col-span-full">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || isGeocoding}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
}
