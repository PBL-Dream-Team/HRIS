'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Input } from '@/components/ui/input';
import { Bell } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

import EmployeeInformation from '@/components/dashboard-admin/EmployeeInformation';
import EmployeeStatisticsCard from '@/components/dashboard-admin/EmployeeStatisticsCard';
import EmployeeStatusCard from '@/components/dashboard-admin/EmployeeStatusCard';
import AttendanceOverviewCard from '@/components/dashboard-admin/AttendanceOverviewCard';
import AttendanceTableCard from '@/components/dashboard-admin/AttendanceTableCard';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { IoMdSearch } from 'react-icons/io';

const data = {
  user: {
    name: 'Admin',
    email: 'admin@hris.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

type DashboardClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

export default function DashboardClient({
  isAdmin,
  userId,
  companyId,
}: DashboardClientProps) {
  const [user, setUser] = useState({
    name: 'Loading...',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '/avatars/default.jpg',
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get(`/api/employee/${userId}`);
        const userData = res.data?.data;
        
        if (userData) {
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
      } catch (err: any) {
        console.error(
          'Error fetching user:',
          err.response?.data || err.message,
        );
        // Set default values on error
        setUser({
          name: 'Unknown User',
          first_name: '',
          last_name: '',
          position: '',
          avatar: '/avatars/default.jpg',
        });
      }
    }

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const [employeeCount, setEmployeeCount] = useState({
    total: 0,
    newEmployees: 0,
    activeEmployees: 0,
    absentEmployees: 0,
  });

  useEffect(() => {
    async function fetchEmployeeCount() {
      try {
        const res = await api.get(`/api/employee/count/${companyId}`);
        setEmployeeCount(res.data);
      } catch (err: any) {
        console.error(
          'Error fetching employee count:',
          err.response?.data || err.message,
        );
      }
    }

    fetchEmployeeCount();
  }, [companyId]);

  const [employeeStatusData, setEmployeeStatusData] = useState<
    { name: string; total: number; color: string }[]
  >([]);

  useEffect(() => {
    async function fetchEmployeeStatus() {
      try {
        const res = await api.get(`/api/employee/status-count/${companyId}`);
        const data = res.data;

        // Add null/undefined checks
        if (!Array.isArray(data)) {
          console.warn('Employee status data is not an array:', data);
          setEmployeeStatusData([]);
          return;
        }

        const colorMap: Record<string, string> = {
          PERMANENT: '#257047',
          CONTRACT: '#FFAB00',
          INTERN: '#2D8EFF',
        };

        const formatted = data
          .filter(item => item && typeof item === 'object' && item.name)
          .map((item: any) => ({
            name: String(item.name || ''),
            total: Number(item.total || 0),
            color: colorMap[item.name] || '#8884d8',
          }));

        setEmployeeStatusData(formatted);
      } catch (err: any) {
        console.error(
          'Error fetching employee status:',
          err.response?.data || err.message,
        );
        setEmployeeStatusData([]);
      }
    }

    if (companyId) {
      fetchEmployeeStatus();
    }
  }, [companyId]);


  const [attendanceOverview, setAttendanceOverview] = useState<
    { attendance: 'onTime' | 'late' | 'leave'; total: number }[]
  >([]);

  useEffect(() => {
    async function fetchAttendanceOverview() {
      try {
        const res = await api.get(`/api/employee/attendance-count/${companyId}`);
        const data = res.data;
        
        // Add null checks and default values
        const onTime = data?.onTime ?? 0;
        const late = data?.late ?? 0;
        const leave = data?.leave ?? 0;

        const mapped = [
          { attendance: 'onTime' as const, total: onTime },
          { attendance: 'late' as const, total: late },
          { attendance: 'leave' as const, total: leave },
        ];

        setAttendanceOverview(mapped);
      } catch (err: any) {
        console.error(
          'Error fetching attendance overview:',
          err.response?.data || err.message,
        );
        // Set default values on error
        setAttendanceOverview([
          { attendance: 'onTime' as const, total: 0 },
          { attendance: 'late' as const, total: 0 },
          { attendance: 'leave' as const, total: 0 },
        ]);
      }
    }

    if (companyId) {
      fetchAttendanceOverview();
    }
  }, [companyId]);

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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-md hover:bg-muted focus:outline-none">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side="bottom"
                sideOffset={8}
                align="end"
              >
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New user registered</DropdownMenuItem>
                <DropdownMenuItem>Monthly report is ready</DropdownMenuItem>
                <DropdownMenuItem>Server restarted</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700">
                  View all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Nav-user */}
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <EmployeeInformation employeeInfo={employeeCount} />
          <div className="grid auto-rows-min gap-4 md:grid-cols-2 sm:grid-cols-1">
            <EmployeeStatusCard data={employeeStatusData} />
            <AttendanceOverviewCard attendancesData={attendanceOverview} />
            {/* <EmployeeStatisticsCard /> */}
            {/* <AttendanceTableCard /> */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
