'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { useState } from 'react';
import { useEffect } from 'react';
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
import { CheckClockForm } from '@/components/checkclock-form';
import CheckClockDetails from '@/components/checkclock-details';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

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

const checkclocks = [
  {
    name: 'Alice Johnson',
    position: 'Software Engineer',
    clockIn: '08:00',
    clockOut: '16:00',
    workHours: '8h',
    status: 'Waiting Approval',
  },
  {
    name: 'Michael Chen',
    position: 'Project Manager',
    clockIn: '08:15',
    clockOut: '16:30',
    workHours: '8h 15m',
    status: 'Waiting Approval',
  },
  {
    name: 'Nina Patel',
    position: 'UI/UX Designer',
    clockIn: '08:00',
    clockOut: '17:00',
    workHours: '9h',
    status: 'On Time',
  },
  {
    name: 'David Lee',
    position: 'DevOps Engineer',
    clockIn: '09:20',
    clockOut: '18:00',
    workHours: '8h 40m',
    status: 'Late',
  },
  {
    name: 'Sarah Kim',
    position: 'HR Staff',
    clockIn: '-',
    clockOut: '-',
    workHours: '0h',
    status: 'Absent/Leave',
  },
];

type CheckClockClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

export default function CheckClockClient({
  isAdmin,
  userId,
  companyId,
}: CheckClockClientProps) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get(`/api/employee/${userId}`);
        const { first_name, last_name, email, pict_dir } = res.data.data;

        setUser({
          name: `${first_name} ${last_name}`,
          email: email,
          avatar: pict_dir || '/avatars/default.jpg',
        });
      } catch (err: any) {
        console.error(
          'Error fetching user:',
          err.response?.data || err.message,
        );
      }
    }

    fetchUser();
  }, [userId]);

  const [openSheet, setOpenSheet] = useState(false);
  const [selectedCheckClock, setselectedCheckClock] = useState<any>(null);

  const handleViewDetails = (checkclock: any) => {
    setselectedCheckClock(checkclock);
    setOpenSheet(true);
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

        <div className="flex flex-1 flex-col gap-4 p-10 pt-5">
          <div className="border border-gray-300 rounded-md p-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Checkclock Overview</h2>
              {/* Search Input */}
              <div className="relative w-96 hidden lg:block">
                <IoMdSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                <Input type="search" placeholder="Search" className="pl-10" />
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-2">
                <Button variant="outline" className="w-full md:w-auto">
                  <VscSettings className="h-4 w-4 mr-1" /> Filter
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <IoMdAdd /> Add Check Clock
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Add Check Clock</DialogTitle>
                    </DialogHeader>
                    <CheckClockForm />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Approve</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkclocks.map((checkclock, i) => {
                  let approveContent;

                  switch (checkclock.status) {
                    case 'Waiting Approval':
                      approveContent = (
                        <div className="flex gap-1">
                          <Button size="icon" variant="outline">
                            <Check className="text-green-600 w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="outline">
                            <X className="text-red-600 w-4 h-4" />
                          </Button>
                        </div>
                      );
                      break;
                    case 'On Time':
                      approveContent = (
                        <span className="h-2 w-2 rounded-full bg-green-600 inline-block" />
                      );
                      break;
                    case 'Late':
                      approveContent = (
                        <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" />
                      );
                      break;
                    case 'Absent/Leave':
                      approveContent = (
                        <span className="h-2 w-2 rounded-full bg-red-600 inline-block" />
                      );
                      break;
                  }

                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src="/avatars/user.jpg" alt="avatar" />
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
                      <TableCell>{checkclock.clockIn}</TableCell>
                      <TableCell>{checkclock.clockOut}</TableCell>
                      <TableCell>{checkclock.workHours}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center">
                          {approveContent}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-black">{checkclock.status}</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:text-white hover:bg-blue-600"
                          onClick={() => handleViewDetails(checkclock)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            <PaginationFooter
              totalItems={checkclocks.length}
              itemsPerPage={10}
            />
          </div>
        </div>
      </SidebarInset>

      <CheckClockDetails
        open={openSheet}
        onOpenChange={setOpenSheet}
        selectedCheckClock={selectedCheckClock}
      />
    </SidebarProvider>
  );
}
