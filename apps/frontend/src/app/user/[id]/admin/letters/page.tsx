'use client';

import Link from 'next/link';
import { AppSidebar } from '@/components/app-sidebar';
import { Pencil, Trash2 } from 'lucide-react';
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
import { LetterForm } from '@/components/letter-form';
import PaginationFooter from '@/components/pagination';
import { useState } from 'react';
import LetterDetails from '@/components/letter-details';
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
import { Download } from 'lucide-react';

const data = {
  user: {
    name: 'Admin',
    email: 'admin@hris.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

const letters = [
  {
    id: 1,
    employeeName: 'John Doe',
    position: 'Software Engineer',
    letterName: 'Employee of the Month',
    letterType: 'Award',
    validUntil: '01 Desember 2025',
    status: 'Active',
  },
  {
    id: 2,
    employeeName: 'Jane Smith',
    position: 'Project Manager',
    letterName: 'Work From Home Approval',
    letterType: 'Permission',
    validUntil: '01 Januari 2023',
    status: 'Not Active',
  },
  {
    id: 3,
    employeeName: 'Alice Johnson',
    position: 'UX Designer',
    letterName: 'Training Completion Certificate',
    letterType: 'Certificate',
    validUntil: '15 Maret 2024',
    status: 'Not Active',
  },
];

export default function Page() {
    const [openSheet, setOpenSheet] = useState(false);
    const [selectedLetter, setselectedLetter] = useState<any>(null);
  
    const handleViewDetails = (checkclock: any) => {
      setselectedLetter(checkclock);
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
                  <BreadcrumbPage>Letters</BreadcrumbPage>
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
              <div className="text-lg font-semibold">Letter Overview</div>
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
                      <IoMdAdd /> Add Letter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Letter</DialogTitle>
                    </DialogHeader>
                    <LetterForm />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Letter Name</TableHead>
                  <TableHead>Letter Type</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {letters.map((letter) => (
                  <TableRow key={letter.id}>
                    <TableCell>{letter.employeeName}</TableCell>
                    <TableCell>{letter.letterName}</TableCell>
                    <TableCell>{letter.letterType}</TableCell>
                    <TableCell>{letter.validUntil}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 rounded text-xs text-white ${
                            letter.status === 'Active'
                              ? 'bg-green-600'
                              : 'bg-gray-400'
                          }`}
                        >
                          {letter.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Link href={`download/${letter.id}`}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:text-white hover:bg-green-600"
                        >
                          <Download />
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:text-white hover:bg-blue-600"
                        onClick={() => handleViewDetails(letter)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="hover:text-white hover:bg-yellow-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Letter</DialogTitle>
                          </DialogHeader>
                          <LetterForm />
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:text-white hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <PaginationFooter totalItems={letters.length} itemsPerPage={10} />
          </div>
        </div>
      </SidebarInset>
      <LetterDetails
        open={openSheet}
        onOpenChange={setOpenSheet}
        selectedLetter={selectedLetter}
      />
    </SidebarProvider>
  );
}
