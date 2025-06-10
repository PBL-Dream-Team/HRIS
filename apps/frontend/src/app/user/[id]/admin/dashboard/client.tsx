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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({
    name: 'Loading...',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '/avatars/default.jpg',
  });

  const [employeeCount, setEmployeeCount] = useState({
    total: 0,
    newEmployees: 0,
    activeEmployees: 0,
    absentEmployees: 0,
  });

  const [employeeStatusData, setEmployeeStatusData] = useState<
    { name: string; total: number; color: string }[]
  >([]);

  const [attendanceOverview, setAttendanceOverview] = useState<
    { attendance: 'onTime' | 'late' | 'leave'; total: number }[]
  >([
    { attendance: 'onTime' as const, total: 0 },
    { attendance: 'late' as const, total: 0 },
    { attendance: 'leave' as const, total: 0 },
  ]);

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

  useEffect(() => {
    let mounted = true;

    async function fetchAllData() {
      if (!companyId) return;

      try {
        setIsLoading(true);

        // Fetch employee count
        const countRes = await api.get(`/api/employee/count/${companyId}`);
        const countData = countRes.data || {};
        
        if (mounted) {
          setEmployeeCount({
            total: Number(countData.total || 0),
            newEmployees: Number(countData.newEmployees || 0),
            activeEmployees: Number(countData.activeEmployees || 0),
            absentEmployees: Number(countData.absentEmployees || 0),
          });
        }

        // Fetch employee status
        const statusRes = await api.get(`/api/employee/status-count/${companyId}`);
        const statusData = statusRes.data;

        if (mounted) {
          if (Array.isArray(statusData) && statusData.length > 0) {
            const colorMap: Record<string, string> = {
              PERMANENT: '#257047',
              CONTRACT: '#FFAB00',
              INTERN: '#2D8EFF',
            };

            const formatted = statusData
              .filter(item => item && typeof item === 'object' && item.name)
              .map((item: any) => ({
                name: String(item.name || 'Unknown'),
                total: Number(item.total || 0),
                color: colorMap[item.name] || '#8884d8',
              }));

            setEmployeeStatusData(formatted);
          } else {
            setEmployeeStatusData([]);
          }
        }

        // Fetch attendance overview
        const attendanceRes = await api.get(`/api/employee/attendance-count/${companyId}`);
        const attendanceData = attendanceRes.data || {};
        
        if (mounted) {
          const onTime = Number(attendanceData.onTime || 0);
          const late = Number(attendanceData.late || 0);
          const leave = Number(attendanceData.leave || 0);

          setAttendanceOverview([
            { attendance: 'onTime' as const, total: onTime },
            { attendance: 'late' as const, total: late },
            { attendance: 'leave' as const, total: leave },
          ]);
        }

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err.response?.data || err.message);
        
        if (mounted) {
          // Set safe default values on error
          setEmployeeCount({
            total: 0,
            newEmployees: 0,
            activeEmployees: 0,
            absentEmployees: 0,
          });
          setEmployeeStatusData([]);
          setAttendanceOverview([
            { attendance: 'onTime' as const, total: 0 },
            { attendance: 'late' as const, total: 0 },
            { attendance: 'leave' as const, total: 0 },
          ]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchAllData();

    return () => {
      mounted = false;
    };
  }, [companyId]);

  // Show loading state
  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg">Loading dashboard...</div>
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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
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

            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <EmployeeInformation employeeInfo={employeeCount} />
          <div className="grid auto-rows-min gap-4 md:grid-cols-2 sm:grid-cols-1">
            <EmployeeStatusCard data={employeeStatusData} />
            <AttendanceOverviewCard attendancesData={attendanceOverview} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
