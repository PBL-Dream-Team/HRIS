'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { MailPlus } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { letterColumns, Letter } from '@/components/columns/letters-admin';

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

import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { LetterForm } from '@/components/letter-form';
import { LetterTypeForm } from '@/components/lettertype-form';
import { useState } from 'react';
import LetterDetails from '@/components/letter-details';
import api from '@/lib/axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IoMdAdd } from 'react-icons/io';

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

  const router = useRouter();
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
          api.get(`/api/letter?company_id=${companyId}`),
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

  const handleViewDetails = (letters: any) => {
    setselectedLetter(letters);
    setOpenSheet(true);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');


  const handleDeleteConfirmed = async () => {
    if (!letterToDelete) return;

    try {
      await api.delete(`/api/letter/${letterToDelete.id}`);
      setLetters((prevLetters) =>
        prevLetters.filter((l) => l.id !== letterToDelete.id),
      );
      setSuccessMessage('Letter successfully deleted.');
    } catch (err: any) {
      console.error('Error deleting letter:', err.response?.data || err.message);
    } finally {
      setDeleteDialogOpen(false);
      setLetterToDelete(null);
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
          {successMessage && (
            <Alert className="border-green-300 bg-green-50 text-green-800">
              <AlertTitle className="font-medium">Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          <div className="border border-gray-300 rounded-md p-4">
            {/* Data Table */}
            <DataTable
              columns={letterColumns(handleViewDetails, setLetterToDelete, setDeleteDialogOpen, companyId, router)}
              data={transformedLetters}
              searchableColumn="name"
              title="Letter Overview"
              actions={
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button><MailPlus /> Add Letter Type</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Letter Type</DialogTitle>
                      </DialogHeader>
                      <LetterTypeForm companyId={companyId} onSuccess={() => router.refresh()} />
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button><IoMdAdd /> Add Letter</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Letter</DialogTitle>
                      </DialogHeader>
                      <LetterForm mode="create" companyId={companyId} onSuccess={() => router.refresh()} />
                    </DialogContent>
                  </Dialog>
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Letter</DialogTitle>
            </DialogHeader>
            <div>Are you sure you want to delete this letter?</div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleDeleteConfirmed}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </SidebarInset>

      {/* Letter Details Sheet */}
      <LetterDetails
        open={openSheet}
        onOpenChange={setOpenSheet}
        selectedLetter={selectedLetter}
      />
    </SidebarProvider>
  );
}
