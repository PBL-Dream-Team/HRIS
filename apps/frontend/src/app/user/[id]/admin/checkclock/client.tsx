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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({
    name: 'Loading...',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '/avatars/default.jpg',
  });

  const [employees, setEmployee] = useState<Record<string, any>>({});
  const [attendanceType, setAttendanceType] = useState<Record<string, any>>({});
  const [company, setCompany] = useState<any[]>([]);
  const [attendances, setAttendance] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset ke halaman pertama saat pencarian berubah
  };

  const [isWorkschemeOverviewOpen, setIsWorkschemeOverviewOpen] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';

    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: enUS });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  async function fetchData() {
    let mounted = true;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch user data
      const userRes = await api.get(`/api/employee/${userId}`);
      const userData = userRes.data?.data;

      if (mounted && userData) {
        const { first_name, last_name, position, pict_dir } = userData;

        // Ensure all values are strings and handle null/undefined
        const firstName = String(first_name || '');
        const lastName = String(last_name || '');
        const userPosition = String(position || '');
        const userAvatar = String(pict_dir || '/avatars/default.jpg');

        setUser({
          name: `${firstName} ${lastName}`.trim() || 'Unknown User',
          first_name: firstName,
          last_name: lastName,
          position: userPosition,
          avatar: userAvatar,
        });
      }

      // Fetch all other data
      const [attendanceRes, employeeRes, typeRes, companyRes] = await Promise.all([
        api.get(`api/attendance?company_id=${companyId}`),
        api.get(`api/employee?company_id=${companyId}`),
        api.get(`api/attendanceType?company_id=${companyId}`),
        api.get(`api/company?id=${companyId}`),
      ]);

      if (mounted) {
        // Process employee data with null safety
        const employeeMap: Record<string, any> = {};
        const employeeData = Array.isArray(employeeRes.data) ? employeeRes.data : [];
        
        for (const emp of employeeData) {
          if (emp && emp.id) {
            employeeMap[emp.id] = {
              ...emp,
              first_name: String(emp.first_name || ''),
              last_name: String(emp.last_name || ''),
              position: String(emp.position || ''),
              pict_dir: String(emp.pict_dir || ''),
              workscheme: String(emp.workscheme || ''),
            };
          }
        }
        setEmployee(employeeMap);

        // Process attendance type data with null safety
        const typeMap: Record<string, any> = {};
        const typeData = Array.isArray(typeRes.data) ? typeRes.data : [];
        
        for (const typ of typeData) {
          if (typ && typ.id) {
            typeMap[typ.id] = typ;
          }
        }
        setAttendanceType(typeMap);

        // Process attendance data with null safety
        const attendanceData = Array.isArray(attendanceRes.data) ? attendanceRes.data : [];
        const validAttendances = attendanceData.filter(att => 
          att && 
          typeof att === 'object' && 
          att.id && 
          att.employee_id
        );
        setAttendance(validAttendances);

        // Process company data with null safety
        const companyData = Array.isArray(companyRes.data) ? companyRes.data : [];
        setCompany(companyData);
      }

    } catch (err: any) {
      console.error('Error fetching data:', err.response?.data || err.message);
      
      if (mounted) {
        setError('Failed to fetch data. Please try again.');
        // Set safe default values on error
        setUser({
          name: 'Unknown User',
          first_name: '',
          last_name: '',
          position: '',
          avatar: '/avatars/default.jpg',
        });
        setAttendance([]);
        setEmployee({});
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
  }

  useEffect(() => {
    if (userId && companyId) {
      fetchData();
    }
  }, [userId, companyId]);

  const checkclocks = useMemo<CheckClockProcessed[]>(() => {
    return attendances.map((attendance) => {
      const employeeData = employees[attendance.employee_id];

      // Hitung work hours dengan null safety
      let workHoursValue = 0;
      if (attendance.check_in && attendance.check_out) {
        workHoursValue = getTimeRangeInHours(
          formatTimeOnly(attendance.check_in),
          formatTimeOnly(attendance.check_out)
        );
      }

      return {
        id: String(attendance.id || ''),
        employee_id: String(attendance.employee_id || ''),
        name: employeeData
          ? `${employeeData.first_name} ${employeeData.last_name}`.trim() || 'Unknown Employee'
          : 'Unknown Employee',
        avatarUrl: employeeData?.pict_dir || undefined,
        position: String(employeeData?.position || 'N/A'),
        date: attendance.created_at
          ? new Date(attendance.created_at).toLocaleDateString()
          : 'N/A',
        clockIn: attendance.check_in
          ? formatTimeOnly(attendance.check_in)
          : '-',
        clockOut: attendance.check_out
          ? formatTimeOnly(attendance.check_out)
          : '-',
        workHours: workHoursValue > 0 ? formatWorkHours(workHoursValue) : '-',
        status: String(attendance.check_in_status || 'N/A'),
        approval: String(attendance.approval || 'N/A'),
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
  }, [attendances, employees, company]);

  const filteredCheckclocks = useMemo(() => {
    return checkclocks.filter((checkclock) =>
      checkclock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [checkclocks, searchTerm]);

  const [openSheet, setOpenSheet] = useState(false);
  const [selectedCheckClock, setSelectedCheckClock] = useState<CheckClockProcessed | null>(null);

  const handleViewDetails = (checkclock: CheckClockProcessed) => {
    setSelectedCheckClock(checkclock);
    setOpenSheet(true);
  };

  const handleOperationSuccess = useCallback(async () => {
    await fetchData();
  }, []);

  // Pagination logic
  const paginatedCheckclocks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCheckclocks.slice(startIndex, endIndex);
  }, [filteredCheckclocks, currentPage, itemsPerPage]);

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
              <Button onClick={() => fetchData()}>Try Again</Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
              <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-2">                <Dialog
                open={isWorkschemeOverviewOpen}
                onOpenChange={setIsWorkschemeOverviewOpen}
              >
              <div className="relative w-96 hidden lg:block">
                <IoMdSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search by employee name"
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
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
              totalItems={filteredCheckclocks.length}
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
