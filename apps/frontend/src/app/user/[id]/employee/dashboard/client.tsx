'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

import WorkInformation from '@/components/dashboard-employee/WorkInformation';
import AttendanceSummaryCard from '@/components/dashboard-employee/AttendanceSummaryCard';
import LeaveSummaryCard from '@/components/dashboard-employee/LeaveSummaryCard';
import WorkHoursOverviewCard from '@/components/dashboard-employee/WorkHoursOverviewCard';

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

import { Bell } from 'lucide-react';
import { NavUser } from '@/components/nav-user';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

type DashboardClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

type WorkStats = {
  workHours: string;
  onTimeDays: number;
  lateDays: number;
  leaveDays: number;
};

export default function DashboardClient({
  isAdmin,
  userId,
  companyId,
}: DashboardClientProps) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  const [workStats, setWorkStats] = useState<WorkStats>({
    workHours: '0h 0m',
    onTimeDays: 0,
    lateDays: 0,
    leaveDays: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get(`/api/employee/${userId}`);
        const { first_name, last_name, email, pict_dir } = userRes.data.data;

        setUser({
          name: `${first_name} ${last_name}`,
          email,
          avatar: pict_dir || '/avatars/default.jpg',
        });

        const statsRes = await api.get(`/api/employee/${userId}/work-info`);
        const { workHours, onTimeDays, lateDays, leaveDays } = statsRes.data;

        setWorkStats({
          workHours,
          onTimeDays,
          lateDays,
          leaveDays,
        });
      } catch (err: any) {
        console.error(
          'Error fetching data:',
          err.response?.data || err.message,
        );
      }
    };

    fetchData();
  }, [userId]);

  return (
    <SidebarProvider>
      <AppSidebar isAdmin={isAdmin} />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
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
          <WorkInformation stats={workStats} />
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <AttendanceSummaryCard />
              <LeaveSummaryCard />
            </div>
            <div className="h-[100px]">
              <WorkHoursOverviewCard />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
