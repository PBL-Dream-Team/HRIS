'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { useState } from 'react';

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

import { Input } from '@/components/ui/input';
import { Bell } from 'lucide-react';
import { NavUser } from '@/components/nav-user';

import { Card, CardContent } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, Eye, Plus } from 'lucide-react';
import { VscSettings } from 'react-icons/vsc';
import { IoMdSearch } from 'react-icons/io';
import { BiImport, BiExport } from 'react-icons/bi';

import { EmployeeForm } from '@/components/employee-form';
import PaginationFooter from '@/components/pagination';
import EmployeeDetails from '@/components/employee-details';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

const employees = [
  {
    id: 1,
    name: 'John Doe',
    gender: 'Male',
    mobile: '081221211122',
    branch: 'Jakarta',
    position: 'Head of HR',
    grade: 'Management',
    avatar: '/avatars/shadcn.jpg',
    status: true,
  },
  {
    id: 2,
    name: 'Jane Smith',
    gender: 'Female',
    mobile: '082233344455',
    branch: 'Bandung',
    position: 'Finance Analyst',
    grade: 'Staff',
    avatar: '/avatars/user2.jpg',
    status: false,
  },
  {
    id: 3,
    name: 'Michael Chen',
    gender: 'Male',
    mobile: '081334455667',
    branch: 'Surabaya',
    position: 'Software Engineer',
    grade: 'Senior',
    avatar: '/avatars/user3.jpg',
    status: true,
  },
  {
    id: 4,
    name: 'Ayu Lestari',
    gender: 'Female',
    mobile: '085566778899',
    branch: 'Bali',
    position: 'Marketing Lead',
    grade: 'Supervisor',
    avatar: '/avatars/user4.jpg',
    status: true,
  },
];
type EmployeeDatabaseClientProps = {
  isAdmin: boolean;
};

export default function EmployeeDatabaseClient({ isAdmin }: EmployeeDatabaseClientProps) {
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setOpenSheet(true);
  };

  return (
    <SidebarProvider>
      <AppSidebar isAdmin={ isAdmin }/>
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
                  <BreadcrumbPage>Employee Database</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
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
            <NavUser user={data.user} isAdmin={isAdmin} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-10 pt-5">
          <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h2 className="text-2xl font-bold">$1,250.00</h2>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">New Customers</p>
                <h2 className="text-2xl font-bold">320</h2>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Orders Completed
                </p>
                <h2 className="text-2xl font-bold">842</h2>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Refund Requests</p>
                <h2 className="text-2xl font-bold">17</h2>
              </CardContent>
            </Card>
          </div>

          <div className="border border-gray-300 rounded-md p-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">Employee Database Overview</div>
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
                <Button variant="outline" className="w-full md:w-auto">
                  <BiExport className="h-4 w-4 mr-1" /> Export
                </Button>
                <Button variant="outline" className="w-full md:w-auto">
                  <BiImport className="h-4 w-4 mr-1" /> Import
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full md:w-auto">
                      <Plus className="h-4 w-4 mr-1" /> Add Employee
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Employee</DialogTitle>
                    </DialogHeader>
                    <EmployeeForm />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">No</TableHead>
                  <TableHead className="text-white">Avatar</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Gender</TableHead>
                  <TableHead className="text-white">Mobile Number</TableHead>
                  <TableHead className="text-white">Branch</TableHead>
                  <TableHead className="text-white">Position</TableHead>
                  <TableHead className="text-white">Grade</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp, i) => (
                  <TableRow key={emp.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={emp.avatar} alt={emp.name} />
                        <AvatarFallback className="rounded-lg">
                          {emp.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.gender}</TableCell>
                    <TableCell>{emp.mobile}</TableCell>
                    <TableCell>{emp.branch}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>{emp.grade}</TableCell>
                    <TableCell>
                      <Switch defaultChecked={emp.status} />
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:text-white hover:bg-blue-600"
                        onClick={() => handleViewDetails(emp)}
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
                        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Employee</DialogTitle>
                          </DialogHeader>
                          <EmployeeForm />
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
            <PaginationFooter totalItems={employees.length} itemsPerPage={10} />
          </div>
        </div>
      </SidebarInset>
      <EmployeeDetails
        open={openSheet}
        onOpenChange={setOpenSheet}
        selectedEmployee={selectedEmployee}
      />
    </SidebarProvider>
  );
}
