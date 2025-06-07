'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import EmployeeInformation from '@/components/employeedatabase/employee-information';

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
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, Plus } from 'lucide-react';
import { VscSettings } from 'react-icons/vsc';
import { BiImport, BiExport } from 'react-icons/bi';

import { EmployeeForm } from '@/components/employeedatabase/employee-form';
import EmployeeDetails from '@/components/employeedatabase/employee-details';
import api from '@/lib/axios';
import { useEffect } from 'react';

import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';

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
    first_name: '',
    last_name: '',
    position: '',
    avatar: '',
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get(`/api/employee/${userId}`);
        const { first_name, last_name, position, pict_dir } = res.data.data;

        setUser({
          name: `${first_name} ${last_name}`,
          first_name: first_name,
          last_name: last_name,
          position: position,
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

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/api/employee', {
        params: { company_id: companyId }, // tambahkan filter company_id
      });
      setEmployees(res.data);
    } catch (err: any) {
      console.error(
        'Error fetching employees:',
        err.response?.data || err.message,
      );
    }
  };

  useEffect(() => {
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

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddEmployeeSuccess = () => {
    fetchEmployees(); // hanya fetch data baru, dialog tetap terbuka
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<any>(null);

  // Buat columns untuk DataTable Employee
  const employeeColumns = [
    {
      accessorKey: 'no',
      header: 'No',
      cell: ({ row }: any) => row.index + 1,
    },
    {
      accessorKey: 'pict_dir',
      header: 'Avatar',
      cell: ({ row }: any) => (
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage
            src={`/storage/employee/${row.original.pict_dir}`}
            alt={`${row.original.first_name} ${row.original.last_name}`}
          />
          <AvatarFallback className="rounded-lg">
            {`${row.original.first_name} ${row.original.last_name}`
              .split(' ')
              .map((n: string) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: any) =>
        `${row.original.first_name} ${row.original.last_name}`,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }: any) =>
        row.original.gender === 'M'
          ? 'Male'
          : row.original.gender === 'F'
            ? 'Female'
            : 'Other',
    },
    {
      accessorKey: 'phone',
      header: 'Mobile Number',
    },
    {
      accessorKey: 'branch',
      header: 'Branch',
    },
    {
      accessorKey: 'position',
      header: 'Position',
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="hover:text-white hover:bg-blue-600"
            onClick={() => handleViewDetails(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hover:text-white hover:bg-yellow-500"
            onClick={() => {
              setEmployeeToEdit(row.original);
              setOpenEditDialog(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hover:text-white hover:bg-red-600"
            onClick={() => {
              setEmployeeToDelete(row.original);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedEmployees = employees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Tambahkan setelah employees didefinisikan
  const employeesWithName = employees.map((emp) => ({
    ...emp,
    name: `${emp.first_name} ${emp.last_name}`,
  }));

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
            {/* Nav-user */}
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-10 pt-5">
          <EmployeeInformation employees={employees} />

          <div className="border border-gray-300 rounded-md p-4">
            {/* DataTable for Employee */}
            <DataTable
              columns={employeeColumns}
              data={employeesWithName} // Ganti dari employees ke employeesWithName
              searchableColumn="name"
              title="Employee Database Overview"
              actions={
                <>
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
                    <Dialog
                      open={openAddDialog}
                      onOpenChange={setOpenAddDialog}
                    >
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
                          onSuccess={handleAddEmployeeSuccess}
                          onClose={() => setOpenAddDialog(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              }
              pagination={{
                currentPage,
                itemsPerPage: ITEMS_PER_PAGE,
                onPageChange: setCurrentPage,
              }}
            />
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

      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            companyId={companyId}
            initialData={employeeToEdit}
            mode="edit"
            onSuccess={() => {
              fetchEmployees();
              setOpenEditDialog(false);
            }}
            onClose={() => setOpenEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
