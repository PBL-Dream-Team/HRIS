'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import api from '@/lib/axios';
import { toast } from 'sonner';
import MapPicker from '@/components/clickable-map/map-picker';
import { Search } from 'lucide-react';

interface WorkshemeForm {
  id: string;
  name: string;
  check_in: string;
  check_out: string;
  workspace_address: string;
  workspace_lat: number | string;
  workspace_long: number | string;
  company_id: string;
}

type WorkshemeFormProps = {
  companyId: string;
  mode: 'create' | 'edit';
  initialData?: WorkshemeForm | null;
  onSuccess?: () => void;
  onClose?: () => void;
};

export function WorkshemeForm({
  companyId,
  mode,
  initialData,
  onSuccess,
  onClose,
}: WorkshemeFormProps) {
  const [name, setName] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [workspaceAddress, setWorkspaceAddress] = useState('');
  const [workspaceLat, setWorkspaceLat] = useState<string>('');
  const [workspaceLong, setWorkspaceLong] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [timeError, setTimeError] = useState<string>('');

  // Helper function to convert ISO timestamp to HH:MM:SS format for display
  const timestampToTimeString = (timestamp: string): string => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toTimeString().split(' ')[0]; // Returns HH:MM:SS
    } catch (error) {
      console.error('Error parsing timestamp:', error);
      return '';
    }
  };

  // Helper function to convert HH:MM:SS to ISO timestamp format
  const timeStringToTimestamp = (timeString: string): string => {
    if (!timeString) return '';

    // Ensure HH:MM:SS format
    let formattedTime = timeString;
    if (timeString.length === 5) {
      // HH:MM
      formattedTime = `${timeString}:00`;
    }

    // Validate HH:MM:SS format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(formattedTime)) {
      throw new Error('Invalid time format');
    }

    // Create ISO timestamp with Indonesia timezone (+07:00)
    // Using 1970-01-01 as base date as specified in DTO
    const baseDate = '1970-01-01';
    const timezone = '+07:00';
    return `${baseDate}T${formattedTime}.000${timezone}`;
  };

  // Helper function to convert time string to minutes for comparison
  const timeToMinutes = (timeString: string): number => {
    if (!timeString) return 0;
    
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return (hours * 60) + minutes + (seconds / 60);
  };

  // Validate time comparison
  const validateTimeComparison = (checkInTime: string, checkOutTime: string): boolean => {
    if (!checkInTime || !checkOutTime) return true; // Skip validation if either is empty
    
    const checkInMinutes = timeToMinutes(checkInTime);
    const checkOutMinutes = timeToMinutes(checkOutTime);
    
    if (checkOutMinutes <= checkInMinutes) {
      setTimeError('Clock out time must be later than clock in time');
      return false;
    }
    
    // Check if the time difference is reasonable (at least 1 hour)
    const timeDifferenceHours = (checkOutMinutes - checkInMinutes) / 60;
    if (timeDifferenceHours < 1) {
      setTimeError('Work duration must be at least 1 hour');
      return false;
    }
    
    // Check if work duration is not too long (more than 24 hours)
    if (timeDifferenceHours > 24) {
      setTimeError('Work duration cannot exceed 24 hours');
      return false;
    }
    
    setTimeError('');
    return true;
  };

  // Real-time validation when times change
  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInTime = checkIn.includes(':') && checkIn.length === 5 ? `${checkIn}:00` : checkIn;
      const checkOutTime = checkOut.includes(':') && checkOut.length === 5 ? `${checkOut}:00` : checkOut;
      
      validateTimeComparison(checkInTime, checkOutTime);
    } else {
      setTimeError('');
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setName(initialData.name);
      // Convert timestamp back to HH:MM:SS for display
      setCheckIn(timestampToTimeString(initialData.check_in));
      setCheckOut(timestampToTimeString(initialData.check_out));
      setWorkspaceAddress(initialData.workspace_address || '');
      setWorkspaceLat(initialData.workspace_lat?.toString() || '');
      setWorkspaceLong(initialData.workspace_long?.toString() || '');
    } else {
      // Reset form for create mode
      setName('');
      setCheckIn('');
      setCheckOut('');
      setWorkspaceAddress('');
      setWorkspaceLat('');
      setWorkspaceLong('');
      setTimeError('');
    }
  }, [mode, initialData]);

  const handleMapLoad = () => {
    setIsMapLoading(false);
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    console.log('Location selected:', { lat, lng, address });
    setWorkspaceLat(lat.toFixed(6));
    setWorkspaceLong(lng.toFixed(6));
    setWorkspaceAddress(address);
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

        setWorkspaceLat(lat.toFixed(6));
        setWorkspaceLong(lng.toFixed(6));

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
    geocodeAddress(workspaceAddress);
  };

  // Auto-geocoding ketika user berhenti mengetik (debounced)
  useEffect(() => {
    if (!workspaceAddress.trim()) return;

    const timeoutId = setTimeout(() => {
      // Hanya lakukan auto-geocoding jika alamat berubah dari initial data
      if (initialData?.workspace_address !== workspaceAddress) {
        geocodeAddress(workspaceAddress);
      }
    }, 2000); // Delay 2 detik setelah user berhenti mengetik

    return () => clearTimeout(timeoutId);
  }, [workspaceAddress, geocodeAddress, initialData?.workspace_address]);

  const validateCoordinates = (): boolean => {
    // Validasi bahwa latitude dan longitude tidak kosong (opsional untuk workspace)
    if (workspaceAddress && (!workspaceLat || !workspaceLong)) {
      toast.error(
        'Please select a location on the map or search for the workspace address',
      );
      return false;
    }

    if (workspaceLat && workspaceLong) {
      // Konversi ke number untuk validasi range
      const latNum = parseFloat(workspaceLat);
      const longNum = parseFloat(workspaceLong);

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
    }

    return true;
  };

  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure we maintain HH:MM:SS format
    if (value.length === 5) {
      setCheckIn(value + ':00');
    } else {
      setCheckIn(value);
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure we maintain HH:MM:SS format
    if (value.length === 5) {
      setCheckOut(value + ':00');
    } else {
      setCheckOut(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validasi field wajib
    if (!name || !checkIn || !checkOut) {
      toast.error('Name, check in time, and check out time are required.');
      setIsLoading(false);
      return;
    }

    // Convert HH:MM to HH:MM:SS format if needed
    const checkInTime =
      checkIn.includes(':') && checkIn.length === 5 ? `${checkIn}:00` : checkIn;
    const checkOutTime =
      checkOut.includes(':') && checkOut.length === 5
        ? `${checkOut}:00`
        : checkOut;

    // Validasi format waktu
    if (!validateTimeFormat(checkInTime)) {
      toast.error('Check in time must be in HH:MM:SS format (e.g., 08:00:00)');
      setIsLoading(false);
      return;
    }

    if (!validateTimeFormat(checkOutTime)) {
      toast.error('Check out time must be in HH:MM:SS format (e.g., 17:00:00)');
      setIsLoading(false);
      return;
    }

    // Validasi perbandingan waktu
    if (!validateTimeComparison(checkInTime, checkOutTime)) {
      toast.error(timeError);
      setIsLoading(false);
      return;
    }

    // Validasi koordinat jika ada alamat workspace
    if (!validateCoordinates()) {
      setIsLoading(false);
      return;
    }

    try {
      // Convert time to ISO timestamp format
      const checkInTimestamp = timeStringToTimestamp(checkInTime);
      const checkOutTimestamp = timeStringToTimestamp(checkOutTime);

      const payload = {
        name,
        check_in: checkInTimestamp,
        check_out: checkOutTimestamp,
        workspace_address: workspaceAddress || null,
        workspace_lat: workspaceLat ? parseFloat(workspaceLat) : null,
        workspace_long: workspaceLong ? parseFloat(workspaceLong) : null,
        company_id: companyId,
      };

      console.log('Payload being sent:', payload);

      if (mode === 'create') {
        await api.post('/api/attendanceType', payload);
        toast.success('Attendance type created successfully!');
      } else if (mode === 'edit' && initialData?.id) {
        await api.patch(`/api/attendanceType/${initialData.id}`, payload);
        toast.success('Attendance type updated successfully!');
      }

      if (mode === 'create') {
        // Reset form
        setName('');
        setCheckIn('');
        setCheckOut('');
        setWorkspaceAddress('');
        setWorkspaceLat('');
        setWorkspaceLong('');
        setTimeError('');
        setMapKey((prev) => prev + 1);
      }
      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      console.error('Error processing attendance type:', error);
      const errorMessage =
        error.response?.data?.message ||
        (mode === 'create'
          ? 'Failed to create attendance type.'
          : 'Failed to update attendance type.');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Map */}
        <div className="space-y-4">
          <div>
            <Label>Workscheme Location (Optional)</Label>
            {isMapLoading && (
              <div className="text-gray-500 text-sm text-center">
                Loading map...
              </div>
            )}
            <MapPicker
              key={mapKey}
              onLocationSelect={handleLocationSelect}
              onLoad={handleMapLoad}
              initialPosition={
                workspaceLat && workspaceLong
                  ? {
                      lat: parseFloat(workspaceLat),
                      lng: parseFloat(workspaceLong),
                    }
                  : initialData &&
                      initialData.workspace_lat &&
                      initialData.workspace_long
                    ? {
                        lat: parseFloat(initialData.workspace_lat.toString()),
                        lng: parseFloat(initialData.workspace_long.toString()),
                      }
                    : undefined
              }
            />
          </div>

          <div>
            <Label>Workscheme Address</Label>
            <div className="flex gap-2">
              <Input
                value={workspaceAddress}
                onChange={(e) => setWorkspaceAddress(e.target.value)}
                placeholder="Optional workspace address"
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSearchAddress}
                disabled={isGeocoding || !workspaceAddress.trim() || isLoading}
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
              <Label>Latitude</Label>
              <Input
                value={workspaceLat}
                onChange={(e) => setWorkspaceLat(e.target.value)}
                placeholder="Workspace latitude"
                readOnly
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                value={workspaceLong}
                onChange={(e) => setWorkspaceLong(e.target.value)}
                placeholder="Workspace longitude"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="workscheme-name">Workscheme Name *</Label>
            <Input
              id="workscheme-name"
              type="text"
              placeholder="Enter workscheme name (e.g., WFO, WFA, Hybrid)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="check-in">Clock In Time *</Label>
            <Input
              id="check-in"
              type="time"
              step="1"
              value={checkIn ? checkIn.substring(0, 8) : ''}
              onChange={handleCheckInChange}
              disabled={isLoading}
              className={`w-full ${timeError ? 'border-red-500' : ''}`}
            />
          </div>

          <div>
            <Label htmlFor="check-out">Clock Out Time *</Label>
            <Input
              id="check-out"
              type="time"
              step="1"
              value={checkOut ? checkOut.substring(0, 8) : ''}
              onChange={handleCheckOutChange}
              disabled={isLoading}
              className={`w-full ${timeError ? 'border-red-500' : ''}`}
            />
            {timeError && (
              <p className="text-red-500 text-xs mt-1">{timeError}</p>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Workscheme Info</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>
                • <strong>WFO:</strong> Work From Office - requires office
                location
              </li>
              <li>
                • <strong>WFA:</strong> Work From Anywhere - flexible location
              </li>
              <li>
                • <strong>Hybrid:</strong> Mixed work arrangement
              </li>
              <li>
                • Workspace location is optional for flexible arrangements
              </li>
              <li>
                • <strong>Time Rules:</strong> Clock out must be later than clock in, minimum 1 hour duration
              </li>
            </ul>
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 pt-6 sm:justify-end">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="w-24"
          disabled={isLoading || isGeocoding || !!timeError}
        >
          {isLoading
            ? mode === 'create'
              ? 'Creating...'
              : 'Updating...'
            : mode === 'create'
              ? 'Submit'
              : 'Update'}
        </Button>
      </DialogFooter>
    </form>
  );
}