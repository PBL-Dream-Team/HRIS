'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Eye, X, Check } from 'lucide-react';
import { IoMdSearch } from 'react-icons/io';
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

type Absence = {
  id: string;
  employee_id: string;
  company_id: string;
  reason: string;
  date: string;
  status: string;
  name: string;
  position: string;
  type: string;
  address: string;
  created_at: string;
};

type AbsenceClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

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
  const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [employees, setEmployees] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/api/employee/${userId}`);
        const { first_name, last_name, email, pict_dir } = res.data.data;
        setUser({
          name: `${first_name} ${last_name}`,
          email,
          avatar: pict_dir || '/avatars/default.jpg',
        });

        const [absenceRes, employeeRes] = await Promise.all([
          api.get(`/api/absence?company_id=${companyId}`),
          api.get(`/api/employee?company_id=${companyId}`),
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
      date: formatTimeOnly(absence.date),
      status: absence.status,
      name: `${employee.first_name} ${employee.last_name}`,
      position: employee.position ? employee.position : 'N/A',
      type: absence.type,
      address: employee.address ? employee.address : '-',
      created_at: new Date(absence.created_at).toDateString(),
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

  const handleApproval = async (
    id: string,
    status: 'APPROVED' | 'DISAPPROVED',
  ) => {
    try {
      await api.patch(`/api/absence/${id}`, { status });
      setAbsences((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
    } catch (err) {
      console.error('Approval failed:', err);
    }
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
                <Button variant="outline">
                  <VscSettings className="w-4 h-4 mr-1" /> Filter
                </Button>

                {/* <Dialog>
                                    <DialogTrigger asChild>
                                        <Button><IoMdAdd /> Add Absence</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                            <DialogTitle>Add Absence</DialogTitle>
                                        </DialogHeader>
                                        <AbsenceForm />
                                    </DialogContent>
                                </Dialog> */}
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>On Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedAbsences.map((abs, i) => {
                  const emp = employees[abs.employee_id];
                  let approveContent;

                  switch (abs.status) {
                    case 'PENDING':
                      approveContent = (
                        <div className="flex gap-1">
                          {/* Add onClick handlers for approval actions */}
                          <Button
                            size="icon"
                            variant="outline"
                            title="Approve"
                            onClick={() => handleApproval(abs.id, 'APPROVED')}
                          >
                            <Check className="text-green-600 w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            title="Disapprove"
                            onClick={() =>
                              handleApproval(abs.id, 'DISAPPROVED')
                            }
                          >
                            <X className="text-red-600 w-4 h-4" />
                          </Button>
                        </div>
                      );
                      break;
                    case 'APPROVED':
                      approveContent = (
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-600 inline-block mr-2" />
                          Approved
                        </div>
                      );
                      break;
                    case 'DISAPPROVED':
                      approveContent = (
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-2" />
                          Rejected
                        </div>
                      );
                    default:
                      approveContent = abs.status || 'N/A';
                  }

                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={emp?.pict_dir || '/avatars/default.jpg'}
                          />
                          <AvatarFallback>
                            {emp ? emp.first_name[0] + emp.last_name[0] : 'NA'}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        {emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'}
                      </TableCell>
                      <TableCell>{emp?.position || '-'}</TableCell>
                      <TableCell>
                        {new Date(abs.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(abs.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{abs.reason}</TableCell>
                      <TableCell>{approveContent}</TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="outline"
                          className="hover:text-white hover:bg-blue-600"
                          onClick={() => handleViewDetails(abs)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
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

      {selectedAbsence && (
        <AbsenceDetails
          open={openSheet}
          onOpenChange={setOpenSheet}
          selectedAbsence={selectedAbsence}
          // selectedCheckClock={selectedCheckClock.originalData || selectedCheckClock}
        />
      )}
    </SidebarProvider>
  );
}
