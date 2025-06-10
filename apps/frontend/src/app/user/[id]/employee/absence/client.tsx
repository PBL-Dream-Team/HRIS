'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

import api from '@/lib/axios';
import { AppSidebar } from '@/components/app-sidebar';
import { NavUser } from '@/components/nav-user';
import PaginationFooter from '@/components/pagination';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AbsenceDetails from '@/components/absence/absence-details';
import { AbsenceAddForm } from '@/components/absence/absenceAdd-form';
import { AbsenceEditForm } from '@/components/absence/absenceEdit-form';
import { Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';

type Absence = {
  id: string;
  employee_id: string;
  company_id: string;
  reason: string;
  date: string;
  status: string;
  name: string;
  position: string;
  type: AbsenceType;
  address: string;
  created_at: string;
  filedir: string;
};

type AbsenceClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

type AbsenceType = 'SICK' | 'PERMIT' | 'LEAVE';

export function formatTimeOnly(input: Date | string): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (typeof input === 'string') {
    const timePart = input.split('.')[0];
    if (timePart.includes('T')) {
      const dateObj = new Date(input);
      return `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
    }
    return timePart;
  }
  return `${pad(input.getHours())}:${pad(input.getMinutes())}:${pad(input.getSeconds())}`;
}

export default function AbsenceClient({
  isAdmin,
  userId,
  companyId,
}: AbsenceClientProps) {
  // Add loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [user, setUser] = useState({ 
    name: 'Loading...', 
    first_name: '', 
    last_name: '', 
    position: '', 
    avatar: '/avatars/default.jpg', 
    compName: '' 
  });
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [employees, setEmployees] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const [filterDate, setFilterDate] = useState<string>('');

  const [pictdir, setPictDir] = useState({
    pictdir: ''
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';

    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: enUS });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const fetchAbsences = async () => {
    try {
      const absenceRes = await api.get(`/api/absence?employee_id=${userId}`);
      setAbsences(absenceRes.data ?? []);

      const res = await api.get(`/api/employee/${userId}`);
      const pict = res.data.data;

      setPictDir({
        pictdir: pict.pict_dir || '',
      })

    } catch (err: any) {
      console.error(
        'Error fetching absences:',
        err.response?.data || err.message,
      );
      setAbsences([]);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!userId || !companyId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch user data with null safety
        const res = await api.get(`/api/employee/${userId}`);
        const userData = res.data?.data;
        const compRes = await api.get(`/api/company/${companyId}`);
        const companyData = compRes.data?.data;

        if (mounted && userData && companyData) {
          const { first_name, last_name, position, pict_dir } = userData;
          const { name } = companyData;

          // Ensure all values are strings and handle null/undefined
          const firstName = String(first_name || '');
          const lastName = String(last_name || '');
          const userPosition = String(position || '');
          const userAvatar = String(pict_dir || '/avatars/default.jpg');
          const companyName = String(name || 'Unknown Company');

          setUser({
            name: `${firstName} ${lastName}`.trim() || 'Unknown User',
            first_name: firstName,
            last_name: lastName,
            position: userPosition,
            avatar: userAvatar,
            compName: companyName,
          });

          setPictDir({
            pictdir: String(pict_dir || ''),
          });
        }

        // Fetch absences and employees data
        const [absenceRes, employeeRes] = await Promise.all([
          api.get(`/api/absence?employee_id=${userId}`),
          api.get(`/api/employee?id=${userId}`),
        ]);

        if (mounted) {
          // Process employee data with null safety
          const employeeMap: Record<string, any> = {};
          const employeeData = Array.isArray(employeeRes.data) 
            ? employeeRes.data 
            : [];

          for (const emp of employeeData) {
            if (emp && emp.id) {
              employeeMap[emp.id] = {
                ...emp,
                first_name: String(emp.first_name || ''),
                last_name: String(emp.last_name || ''),
                position: String(emp.position || ''),
                address: String(emp.address || ''),
                pict_dir: String(emp.pict_dir || ''),
              };
            }
          }
          setEmployees(employeeMap);

          // Process absence data with null safety
          const absenceData = Array.isArray(absenceRes.data) 
            ? absenceRes.data 
            : [];
          const validAbsences = absenceData
            .filter(abs => abs && typeof abs === 'object' && abs.id && abs.employee_id)
            .map(abs => ({
              ...abs,
              reason: String(abs.reason || ''),
              status: String(abs.status || 'PENDING'),
              type: String(abs.type || ''),
              filedir: String(abs.filedir || ''),
            }));

          setAbsences(validAbsences);
        }
      } catch (err: any) {
        console.error(
          'Error fetching data:',
          err.response?.data || err.message,
        );

        if (mounted) {
          setError('Failed to fetch absence data. Please try again.');
          // Set safe default values on error
          setUser({
            name: 'Unknown User',
            first_name: '',
            last_name: '',
            position: '',
            avatar: '/avatars/default.jpg',
            compName: ''
          });
          setAbsences([]);
          setEmployees({});
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [userId, companyId]);

  // Safe data transformation with null checks
  const transformedabsences = absences.map((absence) => {
    const employee = employees[absence.employee_id];
    return {
      id: String(absence.id || ''),
      employee_id: String(absence.employee_id || ''),
      company_id: String(absence.company_id || ''),
      reason: String(absence.reason || '-'),
      date: absence.date ? new Date(absence.date).toDateString() : 'No date',
      status: String(absence.status || 'PENDING'),
      name: employee 
        ? `${String(employee.first_name || '')} ${String(employee.last_name || '')}`.trim() || 'Unknown Employee'
        : 'Unknown Employee',
      position: String(employee?.position || 'N/A'),
      type: absence.type,
      address: String(employee?.address || '-'),
      filedir: String(absence.filedir || ''),
      created_at: absence.created_at ? formatTimeOnly(absence.created_at) : 'No date',
    };
  });

  const filteredAbsences = filterDate
    ? transformedabsences.filter((absence) => {
        const absenceDate = new Date(absence.date);
        const selectedDate = new Date(filterDate);
        return (
          absenceDate.getFullYear() === selectedDate.getFullYear() &&
          absenceDate.getMonth() === selectedDate.getMonth() &&
          absenceDate.getDate() === selectedDate.getDate()
        );
      })
    : transformedabsences;

  const displayedAbsences = filteredAbsences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const [openSheet, setOpenSheet] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);

  const handleViewDetails = (absence: Absence) => {
    setSelectedAbsence(absence);
    setOpenSheet(true);
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [absenceToEdit, setAbsenceToEdit] = useState<{
    id: string;
    type: AbsenceType;
    date: string;
    reason: string;
    filedir: string;
  }>({
    id: '',
    type: 'SICK',
    date: '',
    reason: '',
    filedir: '',
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState<Absence | null>(null);

  const handleDeleteConfirmed = async () => {
    if (!absenceToDelete) return;

    if (absenceToDelete.status !== 'PENDING') {
      toast.error('Only pending absences can be deleted.');
      setIsDeleteDialogOpen(false);
      setAbsenceToDelete(null);
      return;
    }

    try {
      await api.delete(`/api/absence/${absenceToDelete.id}`);
      toast.success('Absence deleted successfully.');

      setAbsences((prev) =>
        prev.filter((abs) => abs.id !== absenceToDelete.id),
      );
    } catch (err: any) {
      console.error(
        'Error deleting absence:',
        err.response?.data || err.message,
      );
      toast.error('Failed to delete absence. Please try again.');
    } finally {
      setIsDeleteDialogOpen(false);
      setAbsenceToDelete(null);
    }
  };

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddAbsenceSuccess = () => {
    fetchAbsences();
  };

  const handleEditAbsenceSuccess = () => {
    fetchAbsences();
    setOpenEditDialog(false);
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
              <div className="text-lg">Loading absence data...</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Show error state
  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="text-lg text-red-500 mb-4">{error}</div>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
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
        <header className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Absence</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>

        <main className="flex-1 p-10 pt-5">
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Absence Overview</h2>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="filter-date">Filter by date:</Label>
                  <div className="relative">
                    <Input
                      id="filter-date"
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="pr-4 [&::-webkit-calendar-picker-indicator]:opacity-100 
                               [&::-webkit-calendar-picker-indicator]:absolute 
                               [&::-webkit-calendar-picker-indicator]:right-2 
                               [&::-webkit-calendar-picker-indicator]:w-4 
                               [&::-webkit-calendar-picker-indicator]:h-4 
                               [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      style={{
                        colorScheme: 'light'
                      }}
                    />
                  </div>
                  {filterDate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterDate('')}
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <IoMdAdd /> Add Absence
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Add Absence</DialogTitle>
                    </DialogHeader>
                    <AbsenceAddForm
                      employeeId={userId}
                      companyId={companyId}
                      onSuccess={handleAddAbsenceSuccess}
                      onClose={() => setOpenAddDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Created At</TableHead>
                  <TableHead>On Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedAbsences.map((abs, i) => {
                  return (
                    <TableRow key={abs.id}>
                      <TableCell>
                        {abs.created_at}
                      </TableCell>
                      <TableCell>
                        {formatDate(abs.date)}
                      </TableCell>
                      <TableCell>{abs.type}</TableCell>
                      <TableCell>{abs.reason}</TableCell>
                      <TableCell>
                        <div>
                          {(() => {
                            switch (abs.status) {
                              case 'APPROVED':
                                return (
                                  <div className="flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2" />
                                    Approved
                                  </div>
                                );
                              case 'REJECTED':
                                return (
                                  <div className="flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-2" />
                                    Rejected
                                  </div>
                                );
                              case 'PENDING':
                                return (
                                  <div className="flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block mr-2" />
                                    Pending
                                  </div>
                                );
                              default:
                                return (
                                  <span className="text-gray-500 font-medium">
                                    Unknown Status
                                  </span>
                                );
                            }
                          })()}
                        </div>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="hover:text-white hover:bg-blue-600"
                          onClick={() => handleViewDetails(abs)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          className={`${abs.status === 'PENDING'
                            ? 'hover:text-white hover:bg-yellow-500'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300 hover:bg-gray-300 hover:text-gray-500'
                            }`}
                          onClick={() => {
                            setAbsenceToEdit(abs);
                            setOpenEditDialog(true);
                          }}
                          disabled={abs.status !== 'PENDING'}
                          title={abs.status !== 'PENDING' ? 'Only pending absences can be edited' : 'Edit absence'}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          className={`${abs.status === 'PENDING'
                            ? 'hover:text-white hover:bg-yellow-500'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300 hover:bg-gray-300 hover:text-gray-500'
                            }`}
                          onClick={() => {
                            setAbsenceToDelete(abs);
                            setIsDeleteDialogOpen(true);
                          }}
                          disabled={abs.status !== 'PENDING'}
                          title={abs.status !== 'PENDING' ? 'Only pending absences can be deleted' : 'Delete absence'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <PaginationFooter
              totalItems={filteredAbsences.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </SidebarInset>

      {selectedAbsence && (
        <AbsenceDetails
          open={openSheet}
          onOpenChange={setOpenSheet}
          selectedAbsence={selectedAbsence}
          avatarUrl={employees[selectedAbsence.employee_id]?.pict_dir || ''}
        />
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Absence</DialogTitle>
          </DialogHeader>
          <div>
            Are you sure you want to delete this absence record? This action cannot be undone.
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Absence</DialogTitle>
          </DialogHeader>
          <AbsenceEditForm
            employeeId={userId}
            companyId={companyId}
            initialData={absenceToEdit}
            onSuccess={handleEditAbsenceSuccess}
            onClose={() => setOpenEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}