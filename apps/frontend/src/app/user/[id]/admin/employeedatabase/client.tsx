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
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState({
    name: 'Loading...',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '/avatars/default.jpg',
  });

  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchInitialData() {
      if (!userId || !companyId) return;

      try {
        setIsLoading(true);

        // Fetch user data
        const userRes = await api.get(`/api/employee/${userId}`);
        const userData = userRes.data?.data;

        if (mounted && userData) {
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

        // Fetch employees data
        const employeesRes = await api.get('/api/employee', {
          params: { company_id: companyId },
        });

        if (mounted) {
          // Ensure employees data is an array and handle null values
          const employeesData = Array.isArray(employeesRes.data) ? employeesRes.data : [];
          
          // Filter out any null/undefined employees and ensure required fields exist
          const validEmployees = employeesData.filter(emp => 
            emp && 
            typeof emp === 'object' && 
            emp.id &&
            (emp.first_name || emp.last_name)
          ).map(emp => ({
            ...emp,
            first_name: String(emp.first_name || ''),
            last_name: String(emp.last_name || ''),
            gender: String(emp.gender || ''),
            phone: String(emp.phone || ''),
            branch: String(emp.branch || ''),
            position: String(emp.position || ''),
            pict_dir: String(emp.pict_dir || ''),
          }));

          setEmployees(validEmployees);
        }

      } catch (err: any) {
        console.error('Error fetching initial data:', err.response?.data || err.message);
        
        if (mounted) {
          // Set safe default values on error
          setUser({
            name: 'Unknown User',
            first_name: '',
            last_name: '',
            position: '',
            avatar: '/avatars/default.jpg',
          });
          setEmployees([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchInitialData();

    return () => {
      mounted = false;
    };
  }, [userId, companyId]);

  // Update fetchEmployees function to handle loading state
  const fetchEmployees = async () => {
    try {
      const res = await api.get('/api/employee', {
        params: { company_id: companyId },
      });
      
      const employeesData = Array.isArray(res.data) ? res.data : [];
      
      const validEmployees = employeesData.filter(emp => 
        emp && 
        typeof emp === 'object' && 
        emp.id &&
        (emp.first_name || emp.last_name)
      ).map(emp => ({
        ...emp,
        first_name: String(emp.first_name || ''),
        last_name: String(emp.last_name || ''),
        gender: String(emp.gender || ''),
        phone: String(emp.phone || ''),
        branch: String(emp.branch || ''),
        position: String(emp.position || ''),
        pict_dir: String(emp.pict_dir || ''),
      }));

      setEmployees(validEmployees);
    } catch (err: any) {
      console.error('Error fetching employees:', err.response?.data || err.message);
      setEmployees([]);
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
      cell: ({ row }: any) => {
        const firstName = String(row.original.first_name || '');
        const lastName = String(row.original.last_name || '');
        const fullName = `${firstName} ${lastName}`.trim() || 'Unknown';
        
        return (
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={row.original.pict_dir ? `/storage/employee/${row.original.pict_dir}` : '/avatars/default.jpg'}
              alt={fullName}
            />
            <AvatarFallback className="rounded-lg">
              {fullName
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase() || 'UN'}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: any) => {
        const firstName = String(row.original.first_name || '');
        const lastName = String(row.original.last_name || '');
        return `${firstName} ${lastName}`.trim() || 'Unknown User';
      },
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }: any) => {
        const gender = String(row.original.gender || '').toUpperCase();
        return gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other';
      },
    },
    {
      accessorKey: 'phone',
      header: 'Mobile Number',
      cell: ({ row }: any) => String(row.original.phone || '-'),
    },
    {
      accessorKey: 'branch',
      header: 'Branch',
      cell: ({ row }: any) => String(row.original.branch || '-'),
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: ({ row }: any) => String(row.original.position || '-'),
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
  const employeesWithName = employees.map((emp) => {
    const firstName = String(emp.first_name || '');
    const lastName = String(emp.last_name || '');
    return {
      ...emp,
      name: `${firstName} ${lastName}`.trim() || 'Unknown User',
    };
  });

  const handleExport = async () => {
    try {
      const response = await api.post(
        '/api/employee/list-export',
        { companyId },
        { responseType: 'blob' },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employees.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      toast.error('Failed to export employee data.');
      console.error('Export error:', err);
    }
  };

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importing, setImporting] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setImporting(true);
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', companyId);

    try {
      const res = await api.post('/api/employee/list-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.statusCode !== 201) {
        toast.error(res.data?.error || res.data?.message || 'Import failed');
        return;
      }
      toast.success('Import successful!');
      fetchEmployees();
      setImportDialogOpen(false);
    } catch (err: any) {
      toast.error('Failed to import employee data.');
      console.error('Import error:', err);
    } finally {
      setImporting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg">Loading employee data...</div>
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
                    <Button
                      variant="outline"
                      className="w-full md:w-auto"
                      onClick={handleExport}
                    >
                      <BiExport className="h-4 w-4 mr-1" /> Export
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full md:w-auto"
                      onClick={() => setImportDialogOpen(true)}
                    >
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
                    <Dialog
                      open={importDialogOpen}
                      onOpenChange={setImportDialogOpen}
                    >
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Import Employees</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 w-full bg-gray-50">
                            <BiImport className="mb-2 h-10 w-10 text-blue-500" />
                            <p className="mb-2 text-sm text-gray-700">
                              Drag & drop file here or{' '}
                              <label
                                htmlFor="employee-import"
                                className="text-blue-600 underline cursor-pointer"
                              >
                                browse
                              </label>
                            </p>
                            <input
                              id="employee-import"
                              type="file"
                              accept=".xlsx,.xls"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setImporting(true);
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('companyId', companyId);

                                try {
                                  const res = await api.post(
                                    '/api/employee/list-import',
                                    formData,
                                    {
                                      headers: {
                                        'Content-Type': 'multipart/form-data',
                                      },
                                    },
                                  );
                                  if (res.data?.statusCode !== 201) {
                                    toast.error(
                                      res.data?.error ||
                                        res.data?.message ||
                                        'Import failed',
                                    );
                                    return;
                                  }
                                  toast.success('Import successful!');
                                  fetchEmployees();
                                  setImportDialogOpen(false);
                                } catch (err: any) {
                                  toast.error(
                                    'Failed to import employee data.',
                                  );
                                  console.error('Import error:', err);
                                } finally {
                                  setImporting(false);
                                }
                              }}
                              disabled={importing}
                            />
                            {importing && (
                              <span className="mt-2 text-xs text-gray-500">
                                Importing, please wait...
                              </span>
                            )}
                            {/* Tampilkan Company ID di bawah upload file */}
                            <div className="mt-4 text-xs text-gray-500">
                              <span className="font-semibold text-gray-700">
                                Company ID:
                              </span>{' '}
                              {companyId}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setImportDialogOpen(false)}
                            disabled={importing}
                          >
                            Cancel
                          </Button>
                        </DialogFooter>
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
