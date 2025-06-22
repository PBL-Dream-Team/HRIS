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
    compName: '',
  });

  const [employees, setEmployees] = useState<any[]>([]);

  const [employeeCount, setEmployeeCount] = useState({
    total: 0,
    newEmployees: 0,
    activeEmployees: 0,
    absentEmployees: 0,
  });

  const [maxEmployee, setMaxEmployee] = useState<number>(0);

  const [hasWorkscheme, setHasWorkscheme] = useState<boolean>(true);

  // Pindahkan ke sini, sebelum useEffect
  const fetchEmployeeCount = async () => {
    if (!companyId) return;
    try {
      const countRes = await api.get(`/api/employee/count/${companyId}`);
      const countData = countRes.data || {};
      setEmployeeCount({
        total: Number(countData.total || 0),
        newEmployees: Number(countData.newEmployees || 0),
        activeEmployees: Number(countData.activeEmployees || 0),
        absentEmployees: Number(countData.absentEmployees || 0),
      });
    } catch (err) {
      setEmployeeCount({
        total: 0,
        newEmployees: 0,
        activeEmployees: 0,
        absentEmployees: 0,
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    async function fetchInitialData() {
      if (!userId || !companyId) return;

      try {
        setIsLoading(true);

        // Fetch user data
        const userRes = await api.get(`/api/employee/${userId}`);
        const userData = userRes.data?.data;
        const compRes = await api.get(`/api/company/${companyId}`);
        const compData = compRes.data?.data;

        if (mounted && userData && compData) {
          const { first_name, last_name, position, pict_dir } = userData;
          const { name, max_employee } = compData;

          // Ensure all values are strings and handle null/undefined
          const firstName = String(first_name || '');
          const lastName = String(last_name || '');
          const userPosition = String(position || '');
          const userAvatar = String(pict_dir || '/avatars/default.jpg');
          const compName = String(name || 'Unknown Company');

          setUser({
            name: `${firstName} ${lastName}`.trim() || 'Unknown User',
            first_name: firstName,
            last_name: lastName,
            position: userPosition,
            avatar: userAvatar,
            compName: compName,
          });

          setMaxEmployee(Number(max_employee || 0)); // Tambahkan ini
        }

        // Fetch employees data
        const employeesRes = await api.get('/api/employee', {
          params: { company_id: companyId },
        });

        if (mounted) {
          // Ensure employees data is an array and handle null values
          const employeesData = Array.isArray(employeesRes.data)
            ? employeesRes.data
            : [];

          // Filter out any null/undefined employees and ensure required fields exist
          // Tambahkan filter agar is_admin: true tidak ditampilkan
          const validEmployees = employeesData
            .filter(
              (emp) =>
                emp &&
                typeof emp === 'object' &&
                emp.id &&
                (emp.first_name || emp.last_name) &&
                emp.is_admin !== true,
            )
            .map((emp) => ({
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
        console.error(
          'Error fetching initial data:',
          err.response?.data || err.message,
        );

        if (mounted) {
          // Set safe default values on error
          setUser({
            name: 'Unknown User',
            first_name: '',
            last_name: '',
            position: '',
            avatar: '/avatars/default.jpg',
            compName: '',
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

  useEffect(() => {
    let mounted = true;
    fetchEmployeeCount();
    return () => {
      mounted = false;
    };
  }, [companyId]);

  // Update fetchEmployees function to handle loading state
  const fetchEmployees = async () => {
    try {
      const res = await api.get('/api/employee', {
        params: { company_id: companyId },
      });

      const employeesData = Array.isArray(res.data) ? res.data : [];

      const validEmployees = employeesData
        .filter(
          (emp) =>
            emp &&
            typeof emp === 'object' &&
            emp.id &&
            (emp.first_name || emp.last_name) &&
            emp.is_admin !== true,
        )
        .map((emp) => ({
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
      console.error(
        'Error fetching employees:',
        err.response?.data || err.message,
      );
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
      fetchEmployeeCount(); // Tambahkan ini
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
    fetchEmployees();
    fetchEmployeeCount(); // Tambahkan ini
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<any>(null);

  // Buat columns untuk DataTable Employee
  const employeeColumns = [
    {
      accessorKey: 'no',
      header: 'No',
      cell: ({ row }: any) => (
        <span className={row.original.is_deleted ? 'text-gray-400' : ''}>
          {row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: 'pict_dir',
      header: 'Avatar',
      cell: ({ row }: any) => {
        const firstName = String(row.original.first_name || '');
        const lastName = String(row.original.last_name || '');
        const fullName = `${firstName} ${lastName}`.trim() || 'Unknown';
        return (
          <span className={row.original.is_deleted ? 'text-gray-400' : ''}>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={
                  row.original.pict_dir
                    ? `/storage/employee/${row.original.pict_dir}`
                    : '/avatars/default.jpg'
                }
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
          </span>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: any) => {
        const firstName = String(row.original.first_name || '');
        const lastName = String(row.original.last_name || '');
        const name = `${firstName} ${lastName}`.trim() || 'Unknown User';
        return (
          <span className={row.original.is_deleted ? 'text-gray-400' : ''}>
            {name}
          </span>
        );
      },
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }: any) => {
        const gender = String(row.original.gender || '').toUpperCase();
        return (
          <span className={row.original.is_deleted ? 'text-gray-400' : ''}>
            {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'}
          </span>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Mobile Number',
      cell: ({ row }: any) => (
        <span className={row.original.is_deleted ? 'text-gray-400' : ''}>
          {String(row.original.phone || '-')}
        </span>
      ),
    },
    {
      accessorKey: 'branch',
      header: 'Branch',
      cell: ({ row }: any) => (
        <span className={row.original.is_deleted ? 'text-gray-400' : ''}>
          {String(row.original.branch || '-')}
        </span>
      ),
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: ({ row }: any) => (
        <span className={row.original.is_deleted ? 'text-gray-400' : ''}>
          {String(row.original.position || '-')}
        </span>
      ),
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
  // Urutkan employees: yang is_deleted: true di bawah
  const sortedEmployees = [
    ...employees.filter((emp) => !emp.is_deleted),
    ...employees.filter((emp) => emp.is_deleted),
  ];

  // Tambahkan name property
  const employeesWithName = sortedEmployees.map((emp) => {
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

      // Add success toast
      toast.success('Employee data exported successfully!');
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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data?.statusCode !== 201) {
        toast.error(res.data?.error || res.data?.message || 'Import failed');
        return;
      }
      toast.success('Import successful!');
      fetchEmployees();
      fetchEmployeeCount(); // Tambahkan ini
      setImportDialogOpen(false);
    } catch (err: any) {
      toast.error('Failed to import employee data.');
      console.error('Import error:', err);
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    async function checkWorkscheme() {
      try {
        const res = await api.get('/api/attendanceType');
        // Filter berdasarkan company_id
        const filtered = Array.isArray(res.data)
          ? res.data.filter((ws) => ws.company_id === companyId)
          : [];
        setHasWorkscheme(filtered.length > 0);
        if (filtered.length === 0) {
          toast.warning('Please add a workscheme first in checkclock menu before adding employees.', { id: 'no-workscheme' });
        }
      } catch (err) {
        setHasWorkscheme(false);
      }
    }
    if (companyId) checkWorkscheme();
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
              <div className="text-lg">Loading employee data...</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const isEmployeeLimitReached =
    maxEmployee > 0 && employeeCount.total >= maxEmployee - 1;

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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <EmployeeInformation employeeInfo={employeeCount} />

          <div className="border border-gray-300 rounded-md p-4">
            {/* DataTable for Employee */}
            <DataTable
              columns={employeeColumns}
              data={employeesWithName}
              searchableColumn="name"
              title="Employee Database Overview"
              rowClassName={(row) =>
                row.original.is_deleted ? 'text-gray-400 bg-gray-50' : ''
              }
              actions={
                <>
                  {/* Buttons */}
                  <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-2">
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
                      disabled={isEmployeeLimitReached} // Tambahkan ini
                    >
                      <BiImport className="h-4 w-4 mr-1" /> Import
                    </Button>
                    <Dialog
                      open={openAddDialog}
                      onOpenChange={setOpenAddDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="w-full md:w-auto"
                          disabled={isEmployeeLimitReached || !hasWorkscheme} // Tambahkan disable jika tidak ada workscheme
                        >
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
                                  fetchEmployeeCount(); // Tambahkan ini
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
              onSearchChange={() => setCurrentPage(1)}
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
              fetchEmployeeCount(); // Tambahkan ini
              setOpenEditDialog(false);
            }}
            onClose={() => setOpenEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
