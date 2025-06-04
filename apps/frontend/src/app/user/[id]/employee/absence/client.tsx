'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Eye, X, Check } from 'lucide-react';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { VscSettings } from 'react-icons/vsc';

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  const [user, setUser] = useState({ name: '', first_name: '', last_name: '', position: '', avatar: '' });
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [employees, setEmployees] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  const [pictdir, setPictDir] = useState({
    pictdir: ''
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';

    try {
      // Konversi string ke Date object
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: enUS });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Fallback ke string asli jika error
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
    async function fetchData() {
      try {
        const res = await api.get(`/api/employee/${userId}`);
        const { first_name, last_name, position, pict_dir } = res.data.data;
        setUser({
          name: `${first_name} ${last_name}`,
          first_name: first_name,
          last_name: last_name,
          position,
          avatar: pict_dir || '/avatars/default.jpg',
        });

        const [absenceRes, employeeRes] = await Promise.all([
          api.get(`/api/absence?employee_id=${userId}`),
          api.get(`/api/employee?id=${userId}`),
        ]);

        const employeeMap: Record<string, any> = {};
        for (const emp of employeeRes.data ?? []) {
          employeeMap[emp.id] = emp;
        }

        setEmployees(employeeMap);
        setAbsences(absenceRes.data ?? []);
      } catch (err: any) {
        console.error(
          'Error fetching data:',
          err.response?.data || err.message,
        );
        setAbsences([]);
      }
    }

    fetchData();
  }, [userId]);

  const transformedabsences = absences.map((absence) => {
    const employee = employees[absence.employee_id];
    return {
      id: absence.id,
      employee_id: absence.employee_id,
      company_id: absence.company_id,
      reason: absence.reason ? absence.reason : '-',
      date: new Date(absence.date).toDateString(),
      status: absence.status,
      name: employee ? `${employee.first_name} ${employee.last_name}` : 'N/A',
      position: employee?.position ? employee.position : 'N/A',
      type: absence.type,
      address: employee?.address ? employee.address : '-',
      filedir: absence.filedir,
      created_at: formatTimeOnly(absence.created_at),
    };
  });

  const displayedAbsences = transformedabsences.slice(
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

    try {
      await api.delete(`/api/absence/${absenceToDelete.id}`);
      toast.success('Absence deleted successfully.');

      // Update state dengan menghapus absence yang sudah dihapus
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
    fetchAbsences(); // Refresh data absence
  };

  const handleEditAbsenceSuccess = () => {
    fetchAbsences(); // Refresh data absence
    setOpenEditDialog(false);
  };

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-md hover:bg-muted">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New absence request</DropdownMenuItem>
                <DropdownMenuItem>Pending approvals</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>

        <main className="flex-1 p-10 pt-5">
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Absence Overview</h2>

              <div className="flex items-center gap-2">
                <div className="relative hidden lg:block w-72">
                  <IoMdSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                  <Input type="search" placeholder="Search" className="pl-10" />
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
                          className="hover:text-white hover:bg-yellow-500"
                          onClick={() => {
                            setAbsenceToEdit(abs);
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
                            setAbsenceToDelete(abs);
                            setIsDeleteDialogOpen(true);
                          }}
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
              totalItems={absences.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </SidebarInset>

      {/* Absence Details Sheet */}
      {selectedAbsence && (
        <AbsenceDetails
          open={openSheet}
          onOpenChange={setOpenSheet}
          selectedAbsence={selectedAbsence}
          avatarUrl={employees[selectedAbsence.employee_id]?.pict_dir || ''}
        />
      )}

      {/* Delete Confirmation Dialog */}
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

      {/* Edit Absence Dialog */}
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