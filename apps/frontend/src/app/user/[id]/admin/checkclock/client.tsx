'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '@/lib/axios';

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
import { Bell, Check, Eye, X } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import PaginationFooter from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { CheckClockForm } from '@/components/checkclock/checkclock-form';
import CheckClockDetails from '@/components/checkclock/checkclock-details';
import { WorkshemeForm } from '@/components/workscheme/workscheme-form';
import { WorkschemeOverviewContent } from '@/components/workscheme/workscheme-overview';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { VscSettings } from 'react-icons/vsc';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type CheckClockProcessed = {
  id: string;
  employee_id: string;
  name: string;
  avatarUrl?: string;
  position: string;
  date: string;
  clockIn: string;
  clockOut: string;
  workHours: string;
  status: string;
  approval: string;
  lat: string;
  long: string;
  location: string;
  address: string;
};

type CheckClockClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

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
  });

  const [employees, setEmployee] = useState<Record<string, any>>({});
  const [attendanceType, setAttendanceType] = useState<Record<string, any>>({});
  const [company, setCompany] = useState<any[]>([]);
  const [attendances, setAttendance] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWorkschemeOverviewOpen, setIsWorkschemeOverviewOpen] =
    useState(false);

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

  async function fetchData() {
    setIsLoading(true);
    setError(null);
    try {
      const userRes = await api.get(`/api/employee/${userId}`);
      const { first_name, last_name, position, pict_dir } = userRes.data.data;

      setUser({
        name: `${first_name} ${last_name}`,
        first_name: first_name,
        last_name: last_name,
        position: position,
        avatar: pict_dir || '/avatars/default.jpg',
      });

      const [attendanceRes, employeeRes, typeRes, companyRes] =
        await Promise.all([
          api.get(`api/attendance?company_id=${companyId}`),
          api.get(`api/employee?company_id=${companyId}`),
          api.get(`api/attendanceType?company_id=${companyId}`),
          api.get(`api/company?id=${companyId}`),
        ]);

      const employeeMap: Record<string, any> = {};
      for (const emp of employeeRes.data ?? []) {
        employeeMap[emp.id] = emp;
      }
      setEmployee(employeeMap);

      const typeMap: Record<string, any> = {};
      for (const typ of typeRes.data ?? []) {
        typeMap[typ.id] = typ;
      }
      setAttendanceType(typeMap);

      setAttendance(attendanceRes.data ?? []);
      setCompany(companyRes.data ?? []);
    } catch (err: any) {
      console.error('Error fetching data:', err.response?.data || err.message);
      setError('Failed to fetch data. Please try again.');
      setAttendance([]);
      setEmployee({});
      setAttendanceType({});
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (userId && companyId) {
      fetchData();
    }
  }, [userId, companyId]);

  const checkclocks = useMemo<CheckClockProcessed[]>(() => {
    return attendances.map((attendance) => {
      const employeeData = employees[attendance.employee_id];

      // Hitung work hours
      let workHoursValue = 0;
      if (attendance.check_in && attendance.check_out) {
        workHoursValue = getTimeRangeInHours(
          formatTimeOnly(attendance.check_in),
          formatTimeOnly(attendance.check_out)
        );
      }

      return {
        id: attendance.id,
        employee_id: attendance.employee_id,
        name: employeeData
          ? `${employeeData.first_name} ${employeeData.last_name}`
          : 'Unknown Employee',
        avatarUrl: employeeData?.pict_dir || undefined,
        position: employeeData.position ? `${employeeData.position}` : 'N/A',
        date: attendance.created_at
          ? new Date(attendance.created_at).toLocaleDateString()
          : 'N/A',
        clockIn: attendance.check_in
          ? formatTimeOnly(attendance.check_in)
          : '-',
        clockOut: attendance.check_out
          ? formatTimeOnly(attendance.check_out)
          : '-',
        // Gunakan formatter yang baru
        workHours: workHoursValue > 0 ? formatWorkHours(workHoursValue) : '-',
        status: attendance.check_in_status || 'N/A',
        approval: attendance.approval || 'N/A',
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
          attendance.check_in_address == company[0].address
            ? 'Office'
            : employeeData.workscheme != 'WFO'
              ? 'Outside Office (WFA/Hybrid)'
              : 'Outside Office (WFO)',
      };
    });
  }, [attendances, employees]);

  const [openSheet, setOpenSheet] = useState(false);
  const [selectedCheckClock, setSelectedCheckClock] =
    useState<CheckClockProcessed | null>(null);

  const handleViewDetails = (checkclock: CheckClockProcessed) => {
    setSelectedCheckClock(checkclock);
    setOpenSheet(true);
  };

  const handleOperationSuccess = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Pagination logic
  const paginatedCheckclocks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return checkclocks.slice(startIndex, endIndex);
  }, [checkclocks, currentPage, itemsPerPage]);

  if (isLoading) {
    // Optional: Render a loading state
    return <div className="p-10">Loading...</div>;
  }

  if (error) {
    // Optional: Render an error message
    return <div className="p-10 text-red-500">{error}</div>;
  }

  const handleApproval = async (
    id: string,
    approval: 'APPROVED' | 'DISAPPROVED',
  ) => {
    try {
      await api.patch(`/api/attendance/${id}`, { approval });
      setAttendance((prev) =>
        prev.map((a) => (a.id === id ? { ...a, approval } : a)),
      );
    } catch (err) {
      console.error('Approval failed:', err);
    }
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
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-10 pt-5">
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Checkclock Overview</h2>
              <div className="relative w-96 hidden lg:block">
                <IoMdSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                <Input type="search" placeholder="Search" className="pl-10" />
                {/* Add onChange handler and state for search functionality */}
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-2">
                <Button variant="outline" className="w-full md:w-auto">
                  <VscSettings className="h-4 w-4 mr-1" /> Filter
                </Button>
                <Dialog
                  open={isWorkschemeOverviewOpen}
                  onOpenChange={setIsWorkschemeOverviewOpen}
                >
                  <DialogTrigger asChild>
                    <Button>Workscheme Overview</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Workscheme Data</DialogTitle>
                    </DialogHeader>
                    <WorkschemeOverviewContent
                      companyId={companyId}
                      isVisible={isWorkschemeOverviewOpen}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <IoMdAdd /> Add Workscheme
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Add Workscheme</DialogTitle>
                    </DialogHeader>
                    <WorkshemeForm
                      companyId={companyId}
                      mode="create"
                      onSuccess={handleOperationSuccess}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Approve</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCheckclocks.map((checkclock) => {
                  let approveContent;

                  switch (checkclock.approval) {
                    case 'PENDING':
                      approveContent = (
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            title="Approve"
                            onClick={() =>
                              handleApproval(checkclock.id, 'APPROVED')
                            }
                          >
                            <Check className="text-green-600 w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            title="Disapprove"
                            onClick={() =>
                              handleApproval(checkclock.id, 'DISAPPROVED')
                            }
                          >
                            <X className="text-red-600 w-4 h-4" />
                          </Button>
                        </div>
                      );
                      break;
                    case 'APPROVED':
                      approveContent = (
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-600 inline-block mr-2" />
                          Approved
                        </div>
                      );
                      break;
                    case 'DISAPPROVED':
                      approveContent = (
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-2" />
                          Disaproved
                        </div>
                      );
                      break;
                    default:
                      approveContent = checkclock.approval || 'N/A';
                  }

                  return (
                    <TableRow key={checkclock.id}>
                      <TableCell>
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={
                              `/storage/employee/${checkclock.avatarUrl}` ||
                              '/avatars/default-avatar.png'
                            }
                            alt={checkclock.name}
                          />
                          <AvatarFallback className="rounded-lg">
                            {checkclock.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{checkclock.name}</TableCell>
                      <TableCell>{checkclock.position}</TableCell>
                      <TableCell>
                        {formatDate(checkclock.date)}
                      </TableCell>
                      <TableCell>
                        {checkclock.clockIn.replace(/.*T/, '')}
                      </TableCell>
                      <TableCell>
                        {checkclock.clockOut.replace(/.*T/, '')}
                      </TableCell>
                      <TableCell>{checkclock.workHours}</TableCell>
                      <TableCell>{approveContent}</TableCell>
                      <TableCell>
                        <div>
                          <span
                            className={`px-2 py-1 rounded text-xs text-white 
                                ${checkclock.status === 'ON_TIME' ? 'bg-green-600' : ''}
                                ${checkclock.status === 'LATE' ? 'bg-red-600' : ''}
                                ${checkclock.status === 'EARLY' ? 'bg-yellow-400' : ''}
                                `}
                          >
                            {checkclock.status === 'ON_TIME'
                              ? 'On Time'
                              : checkclock.status === 'LATE'
                                ? 'Late'
                                : 'Early'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:text-white hover:bg-blue-600"
                          onClick={() => handleViewDetails(checkclock)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <PaginationFooter
              totalItems={checkclocks.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </SidebarInset>

      {selectedCheckClock && (
        <CheckClockDetails
          open={openSheet}
          onOpenChange={setOpenSheet}
          selectedCheckClock={selectedCheckClock}
          avatarUrl={employees[selectedCheckClock.employee_id]?.pict_dir || ''}
        />
      )}
    </SidebarProvider>
  );
}
