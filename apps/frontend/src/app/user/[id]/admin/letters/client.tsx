'use client';

import Link from 'next/link';
import { AppSidebar } from '@/components/app-sidebar';
import { Pencil, Trash2, MailPlus } from 'lucide-react';
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

import { Input } from '@/components/ui/input';
import { Bell } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { LetterForm } from '@/components/letter-form';
import { LetterTypeForm } from '@/components/lettertype-form';
import PaginationFooter from '@/components/pagination';
import { useState } from 'react';
import LetterDetails from '@/components/letter-details';
import { Eye } from 'lucide-react';
import api from '@/lib/axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { VscSettings } from 'react-icons/vsc';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { Download } from 'lucide-react';

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
            <DropdownMenu>
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
            </DropdownMenu>

            {/* Nav-user */}
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-10 pt-5">
          <div className="border border-gray-300 rounded-md p-4">
            {/* Title and Search */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">Letter Overview</div>
              <div className="relative w-96 hidden lg:block">
                <IoMdSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                <Input type="search" placeholder="Search" className="pl-10" />
              </div>
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                <Button className="bg-gray-100 text-black shadow-xs hover:bg-gray-200">
                  <VscSettings /> Filter
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <MailPlus /> Add Letter Type
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Letter Type</DialogTitle>
                    </DialogHeader>
                    <LetterTypeForm
                      companyId={companyId}
                      onSuccess={() => router.refresh()}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <IoMdAdd /> Add Letter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Letter</DialogTitle>
                    </DialogHeader>
                    <LetterForm
                      mode="create"
                      companyId={companyId}
                      onSuccess={() => router.refresh()}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Letter Name</TableHead>
                  <TableHead>Letter Type</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {letters.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-500 py-6"
                    >
                      No letter data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  letters.map((letter) => {
                    const employee = employees[letter.employee_id];
                    const letterType = letterTypeMap[letter.lettertype_id];

                    return (
                      <TableRow key={letter.id}>
                        <TableCell>
                          {employee
                            ? `${employee.first_name} ${employee.last_name}`
                            : 'Unknown'}
                        </TableCell>
                        <TableCell>{letter.name}</TableCell>
                        <TableCell>
                          {letterType ? letterType.name : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {new Date(letter.valid_until).toLocaleDateString(
                            'id-ID',
                            {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            },
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span
                              className={`px-2 py-1 rounded text-xs text-white ${
                                letter.is_active
                                  ? 'bg-green-600'
                                  : 'bg-gray-400'
                              }`}
                            >
                              {letter.is_active ? 'Active' : 'Not Active'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Link href={`download/${letter.id}`}>
                            <Button
                              variant="outline"
                              size="icon"
                              className="hover:text-white hover:bg-green-600"
                            >
                              <Download />
                            </Button>
                          </Link>

                          <Button
                            variant="outline"
                            size="icon"
                            className="hover:text-white hover:bg-blue-600"
                            onClick={() => handleViewDetails(letter)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="hover:text-white hover:bg-yellow-500"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Letter</DialogTitle>
                              </DialogHeader>
                              <LetterForm
                                mode="edit"
                                companyId={companyId}
                                initialData={letter}
                                onSuccess={() => router.refresh()}
                              />
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="icon"
                            className="hover:text-white hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <PaginationFooter totalItems={letters.length} itemsPerPage={10} />
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
