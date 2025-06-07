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
  const [user, setUser] = useState({
    name: '',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '',
    typeId: '',
  });

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
    try {
      const res = await api.get(`/api/employee/${userId}`);
      const { first_name, last_name, position, attendance_id, pict_dir } =
        res.data.data;

      setUser({
        name: `${first_name} ${last_name}`,
        first_name: first_name,
        last_name: last_name,
        position: position,
        avatar: pict_dir || '/avatars/default.jpg',
        typeId: attendance_id,
      });

      const [attendanceRes, employeeRes, typeRes, companyRes] =
        await Promise.all([
          api.get(`api/attendance?employee_id=${userId}`),
          api.get(`api/employee?id=${userId}`),
          api.get(`api/attendanceType?company_id=${companyId}`),
          api.get(`api/company?id=${companyId}`),
        ]);

      setEmployee(employeeRes.data ?? []);

      const typeMap: Record<string, any> = {};
      for (const typ of typeRes.data ?? []) {
        typeMap[typ.id] = typ;
      }
      setAttendanceType(typeMap);

      setAttendance(attendanceRes.data ?? []);

      setCompany(companyRes.data ?? []);
    } catch (err: any) {
      console.error(
        'Error fetching data:',
        err.response?.data || err.message,
      );
      setAttendance([]);
      setEmployee([]);
      setAttendanceType([]);
    }
  };

  useEffect(() => {
    fetchAllData();
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

    return {
      id: attendance.id,
      date: attendance.created_at,
      name: `${employees[0]?.first_name || ''} ${employees[0]?.last_name || ''}`,
      avatarUrl: employees[0]?.pict_dir || undefined,
      position: employees[0]?.position || '',
      clockIn: formatTimeOnly(attendance.check_in),
      clockOut: attendance.check_out
        ? formatTimeOnly(attendance.check_out)
        : '-',
      // Gunakan formatWorkHours yang baru ditambahkan
      workHours: workHoursValue > 0 ? formatWorkHours(workHoursValue) : '-',
      status: attendance.check_in_status,
      address: attendance.check_out
        ? attendance.check_out_address
        : attendance.check_in_address,
      lat: attendance.check_out
        ? attendance.check_out_lat
        : attendance.check_in_lat,
      long: attendance.check_out
        ? attendance.check_out_long
        : attendance.check_in_long,
      location:
        attendance.check_in_address == company[0]?.address
          ? 'Office'
          : employees[0]?.workscheme != 'WFO'
            ? 'Outside Office (WFA/Hybrid)'
            : 'Outside Office (WFO)',
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
            {/* Title and Search */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">Check Clock Overview</div>
              <div className="hidden lg:block">
              </div>
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
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
                      style={{
                        colorScheme: 'light'
                      }}
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
                      className={
                        dailyLimit === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }
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
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCheckClocks.map((checkclock) => (
                  <TableRow key={checkclock.id}>
                    <TableCell>{formatDate(checkclock.date)}</TableCell>
                    <TableCell>
                      {checkclock.clockIn.replace(/.*T/, '')}
                    </TableCell>
                    <TableCell>
                      {checkclock.clockOut.replace(/.*T/, '')}
                    </TableCell>
                    <TableCell>{checkclock.workHours}</TableCell>
                    <TableCell>
                      <div>
                        <span
                          className={`px-2 py-1 rounded text-xs text-white 
                                ${checkclock.status === 'ON_TIME' ? 'bg-green-600' : ''}
                                ${checkclock.status === 'LATE' ? 'bg-red-600' : ''}
                                ${checkclock.status === 'EARLY' ? 'bg-yellow-600' : ''}
                                `}
                        >
                          {checkclock.status === 'ON_TIME'
                            ? 'ON TIME'
                            : checkclock.status === 'LATE'
                              ? 'LATE'
                              : 'EARLY'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:text-white hover:bg-blue-600"
                          onClick={() => handleViewDetails(checkclock)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {checkclock.clockOut === '-' && (
                          <Dialog
                            open={openCheckOutDialog}
                            onOpenChange={setOpenCheckOutDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="hover:bg-white-600 bg-green-600 hover:text-white"
                                onClick={() => handleCheckOut(checkclock.id)}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <PaginationFooter
              totalItems={filteredCheckClocks.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
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