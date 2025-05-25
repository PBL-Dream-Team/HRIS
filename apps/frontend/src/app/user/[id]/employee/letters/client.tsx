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

import LetterDetails from '@/components/letter-details';
import { useEffect } from 'react';
import api from '@/lib/axios';

type LettersClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

export default function LettersClient({
  isAdmin,
  userId,
  companyId,
}: LettersClientProps) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  const [employees, setEmployees] = useState<Record<string, any>>({});
  const [letterTypeMap, setLetterTypeMap] = useState<Record<string, any>>({});
  const [letters, setLetters] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/api/employee/${userId}`);
        const { first_name, last_name, email, pict_dir } = res.data.data;

        setUser({
          name: `${first_name} ${last_name}`,
          email: email,
          avatar: pict_dir || '/avatars/default.jpg',
        });

        const [lettersRes, employeesRes, typesRes] = await Promise.all([
          api.get(`/api/letter?employee_id=${userId}`),
          api.get(`/api/employee?company_id=${companyId}`),
          api.get(`/api/letterType?company_id=${companyId}`),
        ]);

        const employeeMap: Record<string, any> = {};
        for (const emp of employeesRes.data ?? []) {
          employeeMap[emp.id] = emp;
        }
        setEmployees(employeeMap);

        const typeMap: Record<string, any> = {};
        for (const type of typesRes.data ?? []) {
          typeMap[type.id] = type;
        }
        setLetterTypeMap(typeMap);

        setLetters(lettersRes.data ?? []);
      } catch (err: any) {
        console.error(
          'Error fetching data:',
          err.response?.data || err.message,
        );
        setLetters([]);
        setEmployees({});
        setLetterTypeMap({});
      }
    }

    fetchData();
  }, [userId]);

  const transformedLetters: Letter[] = letters.map((letter) => ({
    id: letter.id,
    employee_id: letter.employee_id,
    employee_name: employees[letter.employee_id]
      ? `${employees[letter.employee_id].first_name} ${employees[letter.employee_id].last_name}`
      : 'Unknown',
    name: letter.name,
    lettertype_id: letter.lettertype_id,
    letter_type: letterTypeMap[letter.lettertype_id]?.name || 'Unknown',
    desc: letter.desc,

    valid_until: new Date(letter.valid_until).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    is_active: letter.is_active,
  }));

  const [openSheet, setOpenSheet] = useState(false);
  const [selectedLetter, setselectedLetter] = useState<any>(null);

  const handleViewDetails = (checkclock: any) => {
    setselectedLetter(checkclock);
    setOpenSheet(true);
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
                  <BreadcrumbPage>Letters</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification */}
            {/* <DropdownMenu>
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
            </DropdownMenu> */}

            {/* Nav-user */}
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
              actions={
                <>
                </>
              }
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
