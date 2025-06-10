'use client';

import { AppSidebar } from '@/components/app-sidebar';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Eye, LogIn, LogOut } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { CheckClockForm } from '@/components/checkclock/checkclock-form';
import { useState } from 'react';
import PaginationFooter from '@/components/pagination';
import CheckClockDetails from '@/components/checkclock/checkclock-details';
import api from '@/lib/axios';
import { useEffect } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { CheckOutForm } from '@/components/checkout-form';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/data-table';

let checkclocks;

// Fungsi formatWorkHours yang ditambahkan dari admin page
export function formatWorkHours(hours: number): string {
  if (hours <= 0) return '0h 0m';

  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function getTimeRangeInHours(
  startTime: string | Date,
  endTime: string | Date,
): number {
  const parseTime = (time: string | Date): Date => {
    if (typeof time === 'string') {
      const [h, m, s] = time.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, s || 0, 0);
      return d;
    }
    return time;
  };
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  const diffMs = end.getTime() - start.getTime();
  return diffMs / (1000 * 60 * 60);
}

export function formatTimeOnly(input: Date | string): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (typeof input === 'string') {
    const timePart = input.split('.')[0];
    if (timePart.includes('T')) {
      const dateObj = new Date(input);
      return `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
    }
    return timePart;
  }
  return `${pad(input.getHours())}:${pad(input.getMinutes())}:${pad(input.getSeconds())}`;
}

type CheckClockClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

export function isSameDate(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export default function CheckClockClient({
  isAdmin,
  userId,
  companyId,
}: CheckClockClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({
    name: 'Loading...',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '/avatars/default.jpg',
    typeId: '',
    compName: 'Loading...',
  });
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [employees, setEmployee] = useState<any[]>([]);
  const [company, setCompany] = useState<any[]>([]);
  const [attendanceType, setAttendanceType] = useState<Record<string, any>>();
  const [attendances, setAttendance] = useState<any[]>([]);
  let dailyLimit = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterDate, setFilterDate] = useState<string>('');

  // State untuk mengontrol dialog Add Check Clock
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';

    try {
      // Konversi string ke Date object
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: enUS });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Fallback ke string asli jika error
    }
  };

  // Fungsi untuk fetch data (dipindahkan ke fungsi terpisah untuk reusability)
  const fetchAllData = async () => {
    let mounted = true;

    try {
      setIsLoading(true);
      setError(null);

      const res = await api.get(`/api/employee/${userId}`);
      const { first_name, last_name, position, attendance_id, pict_dir } =
        res.data.data;
      const compRes = await api.get(`/api/company/${companyId}`);
      const { name } = compRes.data.data;

      if (mounted) {
        // Ensure all values are strings and handle null/undefined
        const firstName = String(first_name || '');
        const lastName = String(last_name || '');
        const userPosition = String(position || '');
        const userAvatar = String(pict_dir || '/avatars/default.jpg');
        const compName = String(name || 'Unknown Company');
        const typeId = String(attendance_id || '');

        setUser({
          name: `${firstName} ${lastName}`.trim() || 'Unknown User',
          first_name: firstName,
          last_name: lastName,
          position: userPosition,
          avatar: userAvatar,
          typeId: typeId,
          compName: compName,
        });
      }

      const [attendanceRes, employeeRes, typeRes, companyRes] =
        await Promise.all([
          api.get(`api/attendance?employee_id=${userId}`),
          api.get(`api/employee?id=${userId}`),
          api.get(`api/attendanceType?company_id=${companyId}`),
          api.get(`api/company?id=${companyId}`),
        ]);

      if (mounted) {
        // Process data with null safety
        const employeeData = Array.isArray(employeeRes.data) ? employeeRes.data : [];
        setEmployee(employeeData);

        const typeMap: Record<string, any> = {};
        const typeData = Array.isArray(typeRes.data) ? typeRes.data : [];
        for (const typ of typeData) {
          if (typ && typ.id) {
            typeMap[typ.id] = typ;
          }
        }
        setAttendanceType(typeMap);

        const attendanceData = Array.isArray(attendanceRes.data) ? attendanceRes.data : [];
        const validAttendances = attendanceData.filter(att =>
          att &&
          typeof att === 'object' &&
          att.id &&
          att.employee_id
        );
        setAttendance(validAttendances);

        const companyData = Array.isArray(companyRes.data) ? companyRes.data : [];
        setCompany(companyData);
      }
    } catch (err: any) {
      console.error(
        'Error fetching data:',
        err.response?.data || err.message,
      );

      if (mounted) {
        setError('Failed to fetch data. Please try again.');
        // Set safe default values on error
        setUser({
          name: 'Unknown User',
          first_name: '',
          last_name: '',
          position: '',
          avatar: '/avatars/default.jpg',
          typeId: '',
          compName: 'Unknown Company',
        });
        setAttendance([]);
        setEmployee([]);
        setAttendanceType({});
        setCompany([]);
      }
    } finally {
      if (mounted) {
        setIsLoading(false);
      }
    }

    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    if (userId && companyId) {
      fetchAllData();
    }
  }, [userId, companyId]);

  checkclocks = attendances.map((attendance) => {
    if (isSameDate(new Date(attendance.created_at), new Date())) {
      dailyLimit = 0;
    }

    // Hitung work hours menggunakan fungsi yang sudah ada
    let workHoursValue = 0;
    if (attendance.check_in && attendance.check_out) {
      workHoursValue = getTimeRangeInHours(
        formatTimeOnly(attendance.check_in),
        formatTimeOnly(attendance.check_out)
      );
    }

    const employeeData = employees[0];

    return {
      id: String(attendance.id || ''),
      date: attendance.created_at,
      name: employeeData 
        ? `${employeeData.first_name || ''} ${employeeData.last_name || ''}`.trim() || 'Unknown Employee'
        : 'Unknown Employee',
      avatarUrl: employeeData?.pict_dir || undefined,
      position: String(employeeData?.position || 'N/A'),
      clockIn: formatTimeOnly(attendance.check_in),
      clockOut: attendance.check_out
        ? formatTimeOnly(attendance.check_out)
        : '-',
      // Gunakan formatWorkHours yang baru ditambahkan
      workHours: workHoursValue > 0 ? formatWorkHours(workHoursValue) : '-',
      status: String(attendance.check_in_status || 'N/A'),
      address: attendance.check_out
        ? String(attendance.check_out_address || '')
        : String(attendance.check_in_address || ''),
      lat: attendance.check_out
        ? String(attendance.check_out_lat || '')
        : String(attendance.check_in_lat || ''),
      long: attendance.check_out
        ? String(attendance.check_out_long || '')
        : String(attendance.check_in_long || ''),
      location: (() => {
        const checkInAddress = String(attendance.check_in_address || '');
        const companyAddress = String(company[0]?.address || '');
        const workscheme = String(employeeData?.workscheme || '');

        if (checkInAddress === companyAddress) {
          return 'Office';
        } else if (workscheme !== 'WFO') {
          return 'Outside Office (WFA/Hybrid)';
        } else {
          return 'Outside Office (WFO)';
        }
      })(),
    };
  });

  // Filter checkclocks based on selected date
  const filteredCheckClocks = filterDate
    ? checkclocks.filter((checkclock) => {
        const checkClockDate = new Date(checkclock.date);
        const selectedDate = new Date(filterDate);
        return (
          checkClockDate.getFullYear() === selectedDate.getFullYear() &&
          checkClockDate.getMonth() === selectedDate.getMonth() &&
          checkClockDate.getDate() === selectedDate.getDate()
        );
      })
    : checkclocks;

  const [openSheet, setOpenSheet] = useState(false);
  const [selectedCheckClock, setselectedCheckClock] = useState<any>(null);

  const handleViewDetails = (checkclock: any) => {
    setselectedCheckClock(checkclock);
    setOpenSheet(true);
  };

  const [openCheckOutDialog, setOpenCheckOutDialog] = useState(false);
  const [checkOutId, setCheckOutId] = useState<string | null>(null);
  const handleCheckOut = (id: string) => {
    setCheckOutId(id);
    setOpenCheckOutDialog(true);
  };

  // Handler untuk success Add Check Clock
  const handleAddCheckClockSuccess = () => {
    setOpenAddDialog(false); // Tutup dialog
    fetchAllData(); // Refresh data
  };

  // Handler untuk success Check Out
  const handleCheckOutSuccess = () => {
    setOpenCheckOutDialog(false); // Tutup dialog
    fetchAllData(); // Refresh data
  };

  // Show loading state
  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg">Loading checkclock data...</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Show error state
  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="text-lg text-red-500 mb-4">{error}</div>
              <Button onClick={() => fetchAllData()}>Try Again</Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // DataTable columns for checkclock
  const checkClockColumns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }: any) => formatDate(row.original.date),
    },
    {
      accessorKey: 'clockIn',
      header: 'Clock In',
      cell: ({ row }: any) => row.original.clockIn.replace(/.*T/, ''),
    },
    {
      accessorKey: 'clockOut',
      header: 'Clock Out',
      cell: ({ row }: any) => row.original.clockOut.replace(/.*T/, ''),
    },
    {
      accessorKey: 'workHours',
      header: 'Work Hours',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        return (
          <span
            className={`px-2 py-1 rounded text-xs text-white \
              ${status === 'ON_TIME' ? 'bg-green-600' : ''} \
              ${status === 'LATE' ? 'bg-red-600' : ''} \
              ${status === 'EARLY' ? 'bg-yellow-600' : ''}`}
          >
            {status === 'ON_TIME' ? 'ON TIME' : status === 'LATE' ? 'LATE' : 'EARLY'}
          </span>
        );
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="hover:text-white hover:bg-blue-600"
            onClick={() => handleViewDetails(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.original.clockOut === '-' && (
            <Dialog
              open={openCheckOutDialog}
              onOpenChange={setOpenCheckOutDialog}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-white-600 bg-green-600 hover:text-white"
                  onClick={() => handleCheckOut(row.original.id)}
                >
                  <LogOut className="h-4 w-4 text-white" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Clock Out</DialogTitle>
                </DialogHeader>
                <CheckOutForm
                  attendanceId={checkOutId ?? ''}
                  onSuccess={handleCheckOutSuccess}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      ),
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar isAdmin={isAdmin} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Check Clock</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            {/* Nav-user */}
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-10 pt-5">
          <div className="border border-gray-300 rounded-md p-4">
            <DataTable
              columns={checkClockColumns}
              data={filteredCheckClocks}
              searchableColumn="status"
              title="Check Clock Overview"
              actions={
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="filter-date">Filter by date:</Label>
                    <div className="relative">
                      <Input
                        id="filter-date"
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="pr-4 [&::-webkit-calendar-picker-indicator]:opacity-100 
                                 [&::-webkit-calendar-picker-indicator]:absolute 
                                 [&::-webkit-calendar-picker-indicator]:right-2 
                                 [&::-webkit-calendar-picker-indicator]:w-4 
                                 [&::-webkit-calendar-picker-indicator]:h-4 
                                 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        style={{ colorScheme: 'light' }}
                      />
                    </div>
                    {filterDate && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilterDate('')}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                    <DialogTrigger asChild>
                      <Button
                        disabled={dailyLimit === 0}
                        variant="outline"
                        className={dailyLimit === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        <LogIn /> Clock In
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Clock In</DialogTitle>
                      </DialogHeader>
                      <CheckClockForm
                        employeeId={userId}
                        companyId={companyId}
                        typeId={user.typeId}
                        onSuccess={handleAddCheckClockSuccess}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              }
              pagination={{
                currentPage,
                itemsPerPage,
                onPageChange: setCurrentPage,
              }}
            />
          </div>
        </div>
      </SidebarInset>
      <CheckClockDetails
        open={openSheet}
        onOpenChange={setOpenSheet}
        selectedCheckClock={selectedCheckClock}
        avatarUrl={employees[0]?.pict_dir || ''}
      />
    </SidebarProvider>
  );
}