'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import EmployeeInformation from '@/components/employee-information';

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

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import api from '@/lib/axios';
import { useEffect } from 'react';

import { toast } from 'sonner'; // atau dari 'react-toastify'

type EmployeeDatabaseClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

export default function EmployeeDatabaseClient({
  isAdmin,
  userId,
  companyId,
}: EmployeeDatabaseClientProps) {
  const router = useRouter();

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

  const [employees, setEmployees] = useState<any[]>([]);
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await api.get('/api/employee');
        setEmployees(res.data); // atau `res.data.data` jika API kamu membungkus hasil dalam `data`
      } catch (err: any) {
        console.error(
          'Error fetching employees:',
          err.response?.data || err.message,
        );
      }
    }

    fetchEmployees();
  }, []);

  const [openSheet, setOpenSheet] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const handleViewDetails = async (employee: any) => {
    try {
      const res = await api.get(`/api/employee/${employee.id}`);
      setSelectedEmployee(res.data.data); // Update dengan data detail dari server
      setOpenSheet(true);
    } catch (err: any) {
      console.error(
        'Error fetching employee details:',
        err.response?.data || err.message,
      );
    }
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);

  const handleDeleteConfirmed = async () => {
    if (!employeeToDelete) return;

    try {
      await api.delete(`/api/employee/${employeeToDelete.id}`);
      toast.success('Employee deleted successfully.');
      setEmployees((prev) =>
        prev.filter((emp) => emp.id !== employeeToDelete.id),
      );
    } catch (err: any) {
      console.error(
        'Error deleting employee:',
        err.response?.data || err.message,
      );
      toast.error('Failed to delete employee. Please try again.');
    } finally {
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
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
                  <BreadcrumbPage>Employee Database</BreadcrumbPage>
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
          <EmployeeInformation employees={employees} />

          <div className="border border-gray-300 rounded-md p-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">
                Employee Database Overview
              </div>
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
                    <EmployeeForm
                      companyId={companyId}
                      onSuccess={() => router.refresh()}
                    />
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
                  {/* <TableHead className="text-white">Grade</TableHead> */}
                  {/* <TableHead className="text-white">Status</TableHead> */}
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp, i) => (
                  <TableRow key={emp.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={`/storage/employee/${emp.pict_dir}`}
                          alt={`${emp.first_name} ${emp.last_name}`}
                        />
                        <AvatarFallback className="rounded-lg">
                          {`${emp.first_name} ${emp.last_name}`
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{`${emp.first_name} ${emp.last_name}`}</TableCell>
                    <TableCell>
                      {emp.gender === 'M'
                        ? 'Male'
                        : emp.gender === 'F'
                          ? 'Female'
                          : 'Other'}
                    </TableCell>
                    <TableCell>{emp.phone}</TableCell>
                    <TableCell>{emp.branch}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    {/* <TableCell>{emp.grade}</TableCell> */}
                    {/* <TableCell>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 rounded text-xs text-white ${
                            emp.status ? 'bg-green-600' : 'bg-gray-400'
                          }`}
                        >
                          {emp.status ? 'Active' : 'Not Active'}
                        </span>
                      </div>
                    </TableCell> */}
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:text-white hover:bg-blue-600"
                        onClick={() => handleViewDetails(emp)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* <Dialog>
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
                      </Dialog> */}

                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:text-white hover:bg-red-600"
                        onClick={() => {
                          setEmployeeToDelete(emp);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {/* <PaginationFooter totalItems={employees.length} itemsPerPage={10} /> */}
          </div>
        </div>
      </SidebarInset>
      <EmployeeDetails
        open={openSheet}
        onOpenChange={setOpenSheet}
        selectedEmployee={selectedEmployee}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
          </DialogHeader>
          <div>
            Are you sure you want to delete{' '}
            <strong>
              {employeeToDelete?.first_name} {employeeToDelete?.last_name}
            </strong>
            ? This action cannot be undone.
          </div>
          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
