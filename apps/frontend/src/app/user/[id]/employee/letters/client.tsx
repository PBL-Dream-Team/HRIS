'use client';

import { useState } from 'react';
import { letterColumns, Letter } from '@/components/columns/letters-employee';
import { AppSidebar } from '@/components/app-sidebar';
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
import { DataTable } from '@/components/data-table';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';

import LetterDetails from '@/components/letter/letter-details';
import { useEffect } from 'react';
import api from '@/lib/axios';

type LettersClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

type UserState = {
  name: string;
  first_name: string;
  last_name: string;
  position: string;
  avatar: string;
  compName: string;
};

export default function LettersClient({
  isAdmin,
  userId,
  companyId,
}: LettersClientProps) {
  // State Hooks
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserState>({
    name: 'Loading...',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '/avatars/default.jpg',
    compName: '',
  });

  const [employees, setEmployees] = useState<Record<string, any>>({});
  const [letterTypeMap, setLetterTypeMap] = useState<Record<string, any>>({});
  const [letters, setLetters] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [openSheet, setOpenSheet] = useState(false);
  const [selectedLetter, setselectedLetter] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!userId || !companyId) return;

      try {
        setIsLoading(true);
        setError(null);

        const res = await api.get(`/api/employee/${userId}`);
        const userData = res.data?.data;

        if (userData) {
          const { first_name, last_name, position, pict_dir } = userData;

          // Ensure all values are strings and handle null/undefined
          const firstName = String(first_name || '');
          const lastName = String(last_name || '');
          const userPosition = String(position || '');
          const userAvatar = String(pict_dir || '/avatars/default.jpg');

          // Fetch company data
          const compRes = await api.get(`/api/company/${companyId}`);
          const { name } = compRes.data?.data || {};

          setUser({
            name: `${firstName} ${lastName}`.trim() || 'Unknown User',
            first_name: firstName,
            last_name: lastName,
            position: userPosition,
            avatar: userAvatar,
            compName: name || 'Unknown Company',
          });
        }

        const [lettersRes, employeesRes, typesRes] = await Promise.all([
          api.get(`/api/letter?employee_id=${userId}`),
          api.get(`/api/employee?company_id=${companyId}`),
          api.get(`/api/letterType?company_id=${companyId}`),
        ]);

        // Process employee data with null safety
        const employeeMap: Record<string, any> = {};
        const employeeData = Array.isArray(employeesRes.data)
          ? employeesRes.data
          : [];

        employeeData.forEach((emp: any) => {
          if (emp && emp.id) {
            employeeMap[emp.id] = {
              ...emp,
              first_name: String(emp.first_name || ''),
              last_name: String(emp.last_name || ''),
              position: String(emp.position || ''),
            };
          }
        });
        setEmployees(employeeMap);

        // Process letter type data with null safety
        const typeMap: Record<string, any> = {};
        const typeData = Array.isArray(typesRes.data) ? typesRes.data : [];

        typeData.forEach((type: any) => {
          if (type && type.id) {
            typeMap[type.id] = {
              ...type,
              name: String(type.name || 'Unknown Type'),
            };
          }
        });
        setLetterTypeMap(typeMap);

        // Process letters data with null safety
        const lettersData = Array.isArray(lettersRes.data) ? lettersRes.data : [];
        const validLetters = lettersData.filter(
          (letter) =>
            letter &&
            typeof letter === 'object' &&
            letter.id &&
            letter.employee_id,
        );

        setLetters(validLetters);
      } catch (err: any) {
        console.error(
          'Error fetching data:',
          err.response?.data || err.message,
        );
        setError('Failed to fetch letters data. Please try again.');
        // Set safe default values on error
        setUser({
          name: 'Unknown User',
          first_name: '',
          last_name: '',
          position: '',
          avatar: '/avatars/default.jpg',
          compName: 'Unknown Company',
        });
        setLetters([]);
        setEmployees({});
        setLetterTypeMap({});
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId, companyId]);

  const transformedLetters: Letter[] = letters.map((letter) => {
    const employee = employees[letter.employee_id];
    const letterType = letterTypeMap[letter.lettertype_id];

    return {
      ...letter,
      employee_name:
        employee &&
        `${String(employee.first_name || '')} ${String(employee.last_name || '')}`.trim()
          ? `${String(employee.first_name || '')} ${String(employee.last_name || '')}`.trim()
          : 'Unknown Employee',
      letter_type: String(letterType?.name || 'Unknown Type'),
      valid_until:
        letter.valid_until &&
        new Date(letter.valid_until).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
    };
  });

  const handleViewDetails = (checkclock: any) => {
    setselectedLetter(checkclock);
    setOpenSheet(true);
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
              <div className="text-lg">Loading letters data...</div>
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
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-10 pt-5">
          <div className="border border-gray-300 rounded-md p-4">
            {/* Data Table */}
            <DataTable
              columns={letterColumns(handleViewDetails)}
              data={transformedLetters}
              searchableColumn="name"
              title="Letter Overview"
              actions={<></>}
              pagination={{
                currentPage,
                itemsPerPage,
                onPageChange: setCurrentPage,
              }}
            />
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
