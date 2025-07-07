'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import MapPicker from '@/components/map-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import api from '@/lib/axios';
import { Clock } from 'lucide-react';

type CheckClockFormProps = {
  employeeId: string;
  companyId: string;
  typeId: string;
  onSuccess?: () => void;
};

// Define TypeData interface based on API response
interface AttendanceTypeData {
  id: string;
  company_id: string;
  name: string;
  check_in: string;  // ISO date string
  check_out: string; // ISO date string
  workscheme: string;
  workspace_address: string;
  workspace_lat: number;
  workspace_long: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
}

interface ApiResponse {
  data: AttendanceTypeData;
  message: string;
  statusCode: number;
}

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);
  const [attendanceType, setAttendanceType] = useState<AttendanceTypeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch attendance type data
  useEffect(() => {
    const fetchAttendanceType = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<ApiResponse>(`/api/attendanceType/${typeId}`);
        
        // Use the data property from the response
        if (response.data && response.data.data) {
          console.log("Attendance type data:", response.data.data);
          setAttendanceType(response.data.data);
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error('Error fetching attendance type:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (typeId) {
      fetchAttendanceType();
    }
  }, [typeId]);

  // Add countdown timer effect
  useEffect(() => {
    setHasMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);

  // Format working hours from ISO string to readable time (HH:MM:SS format)
  const formatWorkingHour = (timestamp: string | undefined): string => {
    if (!timestamp) return '--:--:--';
    
    try {
      const date = new Date(timestamp);
      return date.toTimeString().split(' ')[0]; // Returns HH:MM:SS
    } catch (error) {
      console.error('Error parsing timestamp:', error);
      return '--:--:--';
    }
  };

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

  // Get the workscheme badge info
  const getWorkschemeInfo = () => {
    if (!attendanceType?.workscheme) return null;
    
    switch(attendanceType.workscheme) {
      case 'WFO':
        return { icon: '🏢', label: 'Office' };
      case 'WFA':
        return { icon: '🌍', label: 'Anywhere' };
      case 'HYBRID':
        return { icon: '🔄', label: 'Hybrid' };
      default:
        return { icon: '📋', label: 'Custom' };
    }
  };

  const workschemeInfo = getWorkschemeInfo();

  return (
    // Main container with max height and overflow for mobile scrolling
    <div className="flex flex-col space-y-6 max-h-[80vh] overflow-y-auto px-1 pb-2">
      {/* Split layout that stacks on mobile */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Side - Contains both countdown and working hours sections */}
        <div className="w-full md:w-1/2 flex flex-col space-y-4">
          {/* Countdown Clock - Border size matches Map */}
          <div className="flex flex-col items-center justify-center border rounded-md shadow-sm bg-white overflow-hidden">
            {/* Match height with map */}
            <div className="flex flex-col items-center justify-center h-[200px] md:h-[220px] w-full">
              <span className="text-4xl md:text-5xl font-bold text-primary">
                {formatTime(currentTime)}
              </span>
              <span className="text-base md:text-lg text-muted-foreground mt-1 md:mt-2">
                {formatDate(currentTime)}
              </span>
            </div>
          </div>
          
          {/* Working Hours Information - Border size matches Address Details */}
          <div className="p-3 md:p-4 border rounded-md shadow-sm bg-white">
            <h3 className="font-medium text-base md:text-lg mb-3 text-center">
              {isLoading ? 'Loading Working Hours...' : `Working Hours${attendanceType?.name ? `: ${attendanceType.name}` : ''}`}
            </h3>
            <div className="flex justify-center space-x-8 md:space-x-10">
              <div className="text-center">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Clock In</p>
                {isLoading ? (
                  <p className="font-medium text-base md:text-lg">...</p>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3 text-green-600" />
                    <span className="text-sm font-mono font-medium">
                      {formatWorkingHour(attendanceType?.check_in)}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Clock Out</p>
                {isLoading ? (
                  <p className="font-medium text-base md:text-lg">...</p>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3 text-red-600" />
                    <span className="text-sm font-mono font-medium">
                      {formatWorkingHour(attendanceType?.check_out)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {workschemeInfo && (
              <div className="mt-3 text-center">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {workschemeInfo.icon} {workschemeInfo.label}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side - Map and Location Details */}
        <div className="w-full md:w-1/2 flex flex-col space-y-4">
          {/* Map Picker - Match border style with countdown clock */}
          <div className="relative border rounded-md overflow-hidden shadow-sm bg-white">
            {isMapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
                <span className="text-gray-500 text-sm">Loading map...</span>
              </div>
            )}
            {/* Fixed height to match countdown clock */}
            <div className="h-[200px] md:h-[220px] w-full">
              <MapPicker
                onLocationSelect={handleLocationSelect}
                onLoad={handleMapLoad}
              />
            </div>
          </div>
          
          {/* Location Details - Match border style with working hours */}
          <div className="space-y-3 bg-white p-3 md:p-4 rounded-md border shadow-sm">
            <div className="w-full">
              <Label htmlFor="addressDetail" className="text-xs md:text-sm font-medium">Address Detail</Label>
              <Input
                id="addressDetail"
                type="text"
                placeholder="Enter address detail"
                value={addressDetail}
                readOnly
                className="bg-gray-50 mt-1 text-sm md:text-base h-8 md:h-10"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div className="w-full">
                <Label htmlFor="lat" className="text-xs md:text-sm font-medium">Latitude</Label>
                <Input
                  id="lat"
                  type="text"
                  value={lat}
                  readOnly
                  className="bg-gray-50 mt-1 text-sm md:text-base h-8 md:h-10"
                />
              </div>
              <div className="w-full">
                <Label htmlFor="long" className="text-xs md:text-sm font-medium">Longitude</Label>
                <Input
                  id="long"
                  type="text"
                  value={lng}
                  readOnly
                  className="bg-gray-50 mt-1 text-sm md:text-base h-8 md:h-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button - Full width on mobile, auto width on larger screens */}
      <DialogFooter className="gap-2 w-full py-2 mt-2">
        <Button
          type="button"
          className="w-full md:w-24"
          disabled={isMapLoading || isSubmitting || !lat || !lng}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogFooter>
    </div>
  );
}
