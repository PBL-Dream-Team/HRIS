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
import CountdownCard from '@/components/dashboard-employee/CountdownCard';

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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({
    name: 'Loading...',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '/avatars/default.jpg',
    compName: '',
  });

  const [workStats, setWorkStats] = useState<WorkStats>({
    workHours: '0h 0m',
    onTimeDays: 0,
    lateDays: 0,
    leaveDays: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await api.get(`/api/employee/${userId}`);
        const { first_name, last_name, email, pict_dir, position } = userRes.data.data;
        const compRes = await api.get(`/api/company/${companyId}`);
        const { name } = compRes.data.data;

        setUser({
          name: `${first_name} ${last_name}`,
          first_name,
          last_name,
          position: position || 'Employee',
          avatar: pict_dir || '/avatars/default.jpg',
          compName: name || 'Unknown Company',
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUser({
          name: 'Unknown User',
          first_name: '',
          last_name: '',
          position: '',
          avatar: '/avatars/default.jpg',
          compName: 'Unknown Company',
        });
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  useEffect(() => {
    let mounted = true;

    const fetchAttendanceData = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const res = await api.get(`/api/attendance?employee_id=${userId}`);
        const attendance = res.data;

        let totalMinutes = 0;
        let onTime = 0;
        let late = 0;

        attendance.forEach((record: any) => {
          const date = new Date(record.created_at);
          const month = date.getMonth();
          const year = date.getFullYear();

          if (
            month === currentMonth &&
            year === currentYear &&
            record.approval === 'APPROVED'
          ) {
            const checkInTime = new Date(record.check_in);
            const checkOutTime = new Date(record.check_out);
            const workDuration =
              (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60); // in minutes
            if (workDuration > 0) {
              totalMinutes += workDuration;
            }

            if (record.check_in_status === 'ON_TIME') {
              onTime++;
            } else if (record.check_in_status === 'LATE') {
              late++;
            }
          }
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);

        const resAbsence = await api.get(`/api/absence?employee_id=${userId}`);
        const absences = resAbsence.data;

        // Hitung jumlah LEAVE yang statusnya APPROVED
        const leaveDays = absences.filter((a: any) => {
          const date = new Date(a.created_at);
          const month = date.getMonth();
          const year = date.getFullYear();
          return (
            a.status === 'APPROVED' &&
            month === currentMonth &&
            year === currentYear
          );
        }).length;

        if (mounted) {
          setWorkStats({
            workHours: `${hours}h ${minutes}m`,
            onTimeDays: onTime,
            lateDays: late,
            leaveDays,
          });
        }
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
        if (mounted) {
          setWorkStats({
            workHours: '0h 0m',
            onTimeDays: 0,
            lateDays: 0,
            leaveDays: 0,
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAttendanceData();

    return () => {
      mounted = false;
    };
  }, [userId]);

  type AttendanceSummary = {
    onTime: number;
    late: number;
    leave: number;
    sick: number;
    permit: number;
  };
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary>(
    {
      onTime: 0,
      late: 0,
      leave: 0,
      sick: 0,
      permit: 0,
    },
  );

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    String(currentDate.getMonth() + 1).padStart(2, '0'), // Misal '06'
  );
  const [selectedYear, setSelectedYear] = useState(
    String(currentDate.getFullYear()),
  );

  useEffect(() => {
    let mounted = true;

    const fetchAttendanceSummary = async () => {
      if (!userId) return;

      try {
        const attendanceRes = await api.get(
          `/api/attendance?employee_id=${userId}`,
        );
        const attendances = attendanceRes.data;

        let onTime = 0;
        let late = 0;

        attendances.forEach((record: any) => {
          const date = new Date(record.created_at);
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = String(date.getFullYear());

          if (month === selectedMonth && year === selectedYear) {
            if (record.check_in_status === 'ON_TIME') onTime++;
            else if (record.check_in_status === 'LATE') late++;
          }
        });

        const absenceRes = await api.get(`/api/absence?employee_id=${userId}`);
        const absences = absenceRes.data;

        let leave = 0;
        let sick = 0;
        let permit = 0;

        absences.forEach((item: any) => {
          const date = new Date(item.created_at);
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = String(date.getFullYear());

          if (
            item.status === 'APPROVED' &&
            month === selectedMonth &&
            year === selectedYear
          ) {
            switch (item.type) {
              case 'LEAVE':
                leave++;
                break;
              case 'SICK':
                sick++;
                break;
              case 'PERMIT':
                permit++;
                break;
            }
          }
        });

        if (mounted) {
          setAttendanceSummary({ onTime, late, leave, sick, permit });
        }
      } catch (error) {
        console.error('Failed to fetch attendance summary:', error);
        if (mounted) {
          setAttendanceSummary({
            onTime: 0,
            late: 0,
            leave: 0,
            sick: 0,
            permit: 0,
          });
        }
      }
    };

    fetchAttendanceSummary();

    return () => {
      mounted = false;
    };
  }, [userId, selectedMonth, selectedYear]);

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
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <WorkInformation
            workHours={workStats.workHours}
            onTimeDays={workStats.onTimeDays}
            lateDays={workStats.lateDays}
            leaveDays={workStats.leaveDays}
          />
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <CountdownCard userId={userId} companyId={companyId} />
              <AttendanceSummaryCard
                summary={attendanceSummary}
                selectedMonth={selectedMonth}
                onChangeMonth={setSelectedMonth}
              />

              {/* <LeaveSummaryCard /> */}
            </div>
            <div className="h-[100px]">{/* <WorkHoursOverviewCard /> */}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
