'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Eye, X, Check } from 'lucide-react';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { VscSettings } from 'react-icons/vsc';

import api from '@/lib/axios';
import { AppSidebar } from '@/components/app-sidebar';
import { NavUser } from '@/components/nav-user';
import { AbsenceForm } from '@/components/absence-form';
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

type Absence = {
    id: string;
    employee_id: string;
    company_id: string;
    reason: string;
    date: string;
    status: string;
};

type AbsenceClientProps = {
    isAdmin: boolean;
    userId: string;
    companyId: string;
};

export default function AbsenceClient({ isAdmin, userId, companyId }: AbsenceClientProps) {
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
                setUser({ name: `${first_name} ${last_name}`, email, avatar: pict_dir || '/avatars/default.jpg' });

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
                console.error('Error fetching data:', err.response?.data || err.message);
                setAbsences([]);
            }
        }

        fetchData();
    }, [userId]);

    const displayedAbsences = absences.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                                <Button variant="outline"><VscSettings className="w-4 h-4 mr-1" /> Filter</Button>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button><IoMdAdd /> Add Absence</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                            <DialogTitle>Add Absence</DialogTitle>
                                        </DialogHeader>
                                        <AbsenceForm />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Avatar</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayedAbsences.map((abs, i) => {
                                    const emp = employees[abs.employee_id];
                                    return (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Avatar className="h-8 w-8 rounded-lg">
                                                    <AvatarImage src={emp?.pict_dir || '/avatars/default.jpg'} />
                                                    <AvatarFallback>
                                                        {emp ? emp.first_name[0] + emp.last_name[0] : 'NA'}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell>{emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'}</TableCell>
                                            <TableCell>{emp?.position || '-'}</TableCell>
                                            <TableCell>{new Date(abs.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{abs.reason}</TableCell>
                                            <TableCell>{abs.status}</TableCell>
                                            <TableCell>
                                                <Button size="icon" variant="outline">
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
        </SidebarProvider>
    );
}
