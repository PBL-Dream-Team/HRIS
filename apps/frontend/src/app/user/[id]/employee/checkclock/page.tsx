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
  DialogFooter,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Bell } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { CheckClockForm } from '@/components/checkclock-form';
import { useState } from 'react';
import PaginationFooter from '@/components/pagination';
import CheckClockDetails from '@/components/checkclock-details';
import { Eye } from 'lucide-react';

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

const data = {
  user: {
    name: 'Employee',
    email: 'employee@hris.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

const checkclocks = [
  {
    id: 1,
    name: 'John Doe',
    position: 'Software Engineer',
    date: '20 March 2025',
    clockIn: '09.00',
    clockOut: '17.00',
    workHours: '8h',
    status: 'On Time',
  },
  {
    id: 2,
    name: 'John Doe',
    position: 'Software Engineer',
    date: '20 March 2025',
    clockIn: '09.00',
    clockOut: '18.00',
    workHours: '8h',
    status: 'On Time',
  },
];

export default function Page() {
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedCheckClock, setselectedCheckClock] = useState<any>(null);

  const handleViewDetails = (checkclock: any) => {
    setselectedCheckClock(checkclock);
    setOpenSheet(true);
  };
  return (
    <SidebarProvider>
      <AppSidebar />
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
            <div className="relative w-80 hidden lg:block">
              <IoMdSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <Input type="search" placeholder="Search" className="pl-10" />
            </div>

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
            <NavUser user={data.user} />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-10 pt-5">
          <div className="border border-gray-300 rounded-md p-4">
            {/* Title and Search */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">Check Clock Overview</div>
              <div className="relative w-96 hidden lg:block">
                <IoMdSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                <Input type="search" placeholder="Search" className="pl-10" />
              </div>
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                <Button className="bg-gray-100 text-black shadow-xs hover:bg-gray-200">
                  <VscSettings /> Filter
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
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkclocks.map((checkclock) => (
                  <TableRow key={checkclock.id}>
                    <TableCell>{checkclock.date}</TableCell>
                    <TableCell>{checkclock.clockIn}</TableCell>
                    <TableCell>{checkclock.clockOut}</TableCell>
                    <TableCell>{checkclock.workHours}</TableCell>
                    <TableCell>
                      <div>
                        <span
                          className={`px-2 py-1 rounded text-xs text-white 
                                ${checkclock.status === 'On Time' ? 'bg-green-600' : ''}
                                ${checkclock.status === 'Late' ? 'bg-yellow-600' : ''}
                                ${checkclock.status === 'Absent' ? 'bg-red-600' : ''}
                                `}
                        >
                          {checkclock.status}
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
