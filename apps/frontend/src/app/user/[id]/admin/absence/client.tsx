'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, X, Check } from 'lucide-react';
import { IoMdSearch } from 'react-icons/io';

import api from '@/lib/axios';
import { AppSidebar } from '@/components/app-sidebar';
import { NavUser } from '@/components/nav-user';
import PaginationFooter from '@/components/pagination';
import { DataTable } from '@/components/data-table';

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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AbsenceDetails from '@/components/absence/absence-details';
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
  type: string;
  address: string;
  filedir: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({
    name: 'Loading...',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '/avatars/default.jpg',
    compName: '',
  });
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [employees, setEmployees] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // search function
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!userId || !companyId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch user data
        const userRes = await api.get(`/api/employee/${userId}`);
        const userData = userRes.data?.data;
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
            compName: name,
          });
        }

        // Fetch absences and employees data
        const [absenceRes, employeeRes] = await Promise.all([
          api.get(`/api/absence?company_id=${companyId}`),
          api.get(`/api/employee?company_id=${companyId}`),
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
            .filter(
              (abs) =>
                abs &&
                typeof abs === 'object' &&
                abs.id &&
                abs.employee_id,
            )
            .map((abs) => ({
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
          'Error fetching absence data:',
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
      name:
        employee
          ? `${String(employee.first_name || '')} ${String(
              employee.last_name || '',
            )}`.trim() || 'Unknown Employee'
          : 'Unknown Employee',
      position: String(employee?.position || 'N/A'),
      type: String(absence.type || ''),
      address: String(employee?.address || '-'),
      filedir: String(absence.filedir || ''),
      created_at: absence.created_at
        ? formatTimeOnly(absence.created_at)
        : 'No date',
    };
  });

  const filteredAbsences = transformedabsences.filter((absence) =>
    absence.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'No date') return 'No date';

    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: enUS });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

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

  const handleApproval = async (
    id: string,
    status: 'APPROVED' | 'REJECTED',
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

  const absenceColumns = [
    {
      accessorKey: 'avatar',
      header: 'Avatar',
      cell: ({ row }: any) => {
        const emp = employees[row.original.employee_id];
        return (
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={
                emp?.pict_dir
                  ? `/storage/employee/${emp.pict_dir}`
                  : '/avatars/default.jpg'
              }
              alt={row.original.name}
            />
            <AvatarFallback>
              {String(emp?.first_name?.[0] || '')}
              {String(emp?.last_name?.[0] || '')}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'position',
      header: 'Position',
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
    },
    {
      accessorKey: 'date',
      header: 'On Date',
      cell: ({ row }: any) => formatDate(row.original.date),
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        let statusContent;
        switch (status) {
          case 'PENDING':
            statusContent = (<div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block mr-2" />
                Pending
              </div>);
            break;
          case 'APPROVED':
            statusContent = (
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2" />
                Approved
              </div>
            );
            break;
          case 'REJECTED':
            statusContent = (
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-2" />
                Rejected
              </div>
            );
            break;
          default:
            statusContent = status || 'N/A';
        }
        return statusContent;
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <Button
          size="icon"
          variant="outline"
          className="hover:text-white hover:bg-blue-600"
          onClick={() => handleViewDetails(row.original)}
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

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
            <DataTable
              columns={absenceColumns}
              data={displayedAbsences}
              searchableColumn="name"
              title="Absence Overview"
              pagination={{
                currentPage,
                itemsPerPage,
                onPageChange: setCurrentPage,
              }}
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
    </SidebarProvider>
  );
}
