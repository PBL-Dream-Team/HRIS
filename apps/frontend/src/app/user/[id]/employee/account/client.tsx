'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Input } from '@/components/ui/input';
import { Bell, Pencil } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EmployeeEditGeneralDataForm } from '@/components/editData-Employee/generalInformation-form';
import { EmployeeEditWorkDataForm } from '@/components/editData-Employee/workInformation-form';
import { EditPassword } from '@/components/editData-Employee/editPass-form';
import { format, parseISO } from 'date-fns';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Card } from '@/components/ui/card';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { use } from 'chai';

type EducationType = 'HIGH_SCHOOL' | 'BACHELOR' | 'MASTER' | 'DOCTOR';
type GenderType = 'M' | 'F';
type Bank =
  | 'BRI'
  | 'Mandiri'
  | 'BNI'
  | 'Danamon'
  | 'Permata'
  | 'BCA'
  | 'Maybank'
  | 'Panin'
  | 'Bukopin'
  | 'CIMB'
  | 'UOB'
  | 'OCBC'
  | 'BJB'
  | 'Muamalat'
  | 'BTN'
  | 'BTPN'
  | 'Mega'
  | 'SyariahMandiri'
  | 'Commonwealth';

type AccountClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
  initialData?: {
    id: string;
    employee_id: string;
    first_name: string;
    last_name: string;
    gender: GenderType;
    last_education: EducationType;
    phone: string;
    nik: string;
    birth_place: string;
    birth_date: string;
    position: string;
    branch: string;
    contract: string;
    workscheme: string;
    account_bank: Bank;
    account_name: string;
    account_number: string;
    email: string;
    pict_dir: string;
  };
};

export default function AccountClient({
  isAdmin,
  userId,
  companyId,
  initialData,
}: AccountClientProps) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
  });
  const router = useRouter();

  const [employeeData, setEmployeeData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    last_education: '',
    email: '',
    phone: '',
    nik: '',
    birth_place: '',
    birth_date: '',
    id: '',
    pict_dir: '',
  });
  const [employeeWorkData, setEmployeeWorkData] = useState({
    position: '',
    branch: '',
    contract: '',
    workscheme: '',
    account_bank: '',
    account_name: '',
    account_number: '',
  });

  // Data Fetching
  const fetchData = useCallback(async () => {
    try {
      const res = await api.get(`/api/employee/${userId}`);
      const employee = res.data.data;

      setUser({
        name: `${employee.first_name} ${employee.last_name}`,
        email: employee.email,
        avatar: employee.pict_dir || '/avatars/default.jpg',
      });

      setEmployeeData({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        gender: employee.gender || '',
        last_education: employee.last_education || '',
        phone: employee.phone || '',
        email: employee.email || '',
        nik: employee.nik || '',
        birth_place: employee.birth_place || '',
        birth_date: employee.birth_date?.split('T')[0] || '',
        id: employee.id || '',
        pict_dir: employee.pict_dir || '',
      });

      setEmployeeWorkData({
        position: employee.position || '',
        branch: employee.branch || '',
        contract: employee.contract || '',
        workscheme: employee.workscheme || '',
        account_bank: employee.account_bank || '',
        account_name: employee.account_name || '',
        account_number: employee.account_number || '',
      });
    } catch (err: any) {
      console.error('Error fetching user:', err.response?.data || err.message);
    }
  }, [userId, companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOperationSuccess = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const displayValue = (value: string | undefined | null) => {
    return value || '';
  };

  const formatGender = (genderCode: string) => {
    switch (genderCode) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      default:
        return genderCode;
    }
  };

  const formatLastEducation = (education: string) => {
    switch (education) {
      case 'HIGH_SCHOOL':
        return 'High School';
      case 'BACHELOR':
        return 'Bachelor';
      case 'MASTER':
        return 'Master';
      case 'DOCTOR':
        return 'Doctor';
      default:
        return education;
    }
  };

  const formatContractType = (contract: string) => {
    switch (contract) {
      case 'PERMANENT':
        return 'Permanent';
      case 'CONTRACT':
        return 'Contract';
      case 'INTERN':
        return 'Intern';
      default:
        return contract;
    }
  };

  const formatWorkscheme = (workscheme: string) => {
    switch (workscheme) {
      case 'WFO':
        return 'Work From Office';
      case 'WFA':
        return 'Work From Anywhere';
      case 'HYBRID':
        return 'Hybrid';
      default:
        return workscheme;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      return format(date, 'PPP'); // Format menjadi "January 1st, 1990"
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Fallback ke string asli jika parsing gagal
    }
  };

  const [open, setOpen] = useState(false);

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
                  <BreadcrumbPage>Account</BreadcrumbPage>
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

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-4 p-4 relative">
          {/* Profile Data */}
          <div className="w-full h-fit md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 border-2 p-4 bg-white rounded-lg shadow">
            <h1 className="text-lg font-semibold mb-2">General Information</h1>
            <div className="col-span-full flex items-center gap-4">
              <Avatar className="w-25 h-25">
                <AvatarImage
                  src={'/storage/employee/' + employeeData.pict_dir}
                  alt={employeeData.first_name || 'Avatar'}
                />
                <AvatarFallback>
                  {employeeData.first_name?.[0]}
                  {employeeData.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <Label>First Name</Label>
              <Input
                id="first_name"
                value={employeeData.first_name || ''}
                readOnly
                placeholder="Your first name"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                id="last_name"
                value={employeeData.last_name || ''}
                readOnly
                placeholder="Your last name"
              />
            </div>
            <div>
              <Label>Gender</Label>
              <Input
                id="gender"
                value={formatGender(employeeData.gender) || ''}
                readOnly
                placeholder="Your gender"
              />
            </div>
            <div>
              <Label>Last Education</Label>
              <Input
                id="last_education"
                value={formatLastEducation(employeeData.last_education) || ''}
                readOnly
                placeholder="Your last education"
              />
            </div>
            <div>
              <Label>Mobile Number</Label>
              <Input
                id="phone"
                value={employeeData.phone || ''}
                readOnly
                placeholder="Your phone number"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                id="email"
                value={user.email || ''}
                readOnly
                placeholder="Your email"
              />
            </div>
            <div>
              <Label>Place of Birth</Label>
              <Input
                id="birth_place"
                value={employeeData.birth_place || ''}
                readOnly
                placeholder="Your place of birth"
              />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input
                id="birth_date"
                value={formatDate(employeeData.birth_date) || ''}
                readOnly
                placeholder="Your date of birth"
              />
            </div>
            <div className="col-span-full">
              <Label>NIK</Label>
              <Input
                id="nik"
                value={employeeData.nik || ''}
                readOnly
                placeholder="Your NIK"
              />
            </div>
            <div className="col-span-full flex justify-end items-center mt-4">
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full md:w-auto">
                      <Pencil className="h-4 w-4 mr-1" /> Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <EmployeeEditGeneralDataForm
                      employeeId={employeeData.id}
                      initialData={{
                        id: employeeData.id || '',
                        first_name: employeeData.first_name || '',
                        last_name: employeeData.last_name || '',
                        gender: employeeData.gender as GenderType,
                        last_education:
                          employeeData.last_education as EducationType,
                        phone: employeeData.phone || '',
                        nik: employeeData.nik || '',
                        birth_place: employeeData.birth_place || '',
                        birth_date: initialData?.birth_date || '',
                        pict_dir: employeeData.pict_dir || '',
                        email: employeeData.email || '',
                      }}
                      onSuccess={handleOperationSuccess}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full md:w-auto">
                      <Pencil className="h-4 w-4 mr-1" /> Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <EditPassword
                      userId={userId}
                      onSuccess={handleOperationSuccess}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="w-full h-fit md:w-1/3 grid grid-cols-1 gap-4 border-2 p-4 bg-white rounded-lg shadow">
            <h1 className="text-lg font-semibold mb-1">Work Information</h1>
            <Card className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
              <div>
                <Label>Position</Label>
                <Input
                  id="position"
                  value={employeeWorkData.position || ''}
                  readOnly
                  placeholder="Your position"
                />
              </div>
              <div>
                <Label>Branch</Label>
                <Input
                  id="branch"
                  value={employeeWorkData.branch || ''}
                  readOnly
                  placeholder="Your branch"
                />
              </div>
              <div>
                <Label>Contract Type</Label>
                <Input
                  id="contract"
                  value={formatContractType(employeeWorkData.contract) || ''}
                  readOnly
                  placeholder="Your contract type"
                />
              </div>
              <div>
                <Label>Workscheme</Label>
                <Input
                  id="workscheme"
                  value={formatWorkscheme(employeeWorkData.workscheme) || ''}
                  readOnly
                  placeholder="Your workscheme"
                />
              </div>
              <div className="col-span-full">
                <Label>ID</Label>
                <Input
                  id="id"
                  value={employeeData.id || ''}
                  readOnly
                  placeholder="Your ID"
                />
              </div>
            </Card>
            <Card className="grid grid-cols-1 gap-2 p-4">
              <div className="col-span-full">
                <Label>Bank</Label>
                <Input
                  id="account_bank"
                  value={employeeWorkData.account_bank || ''}
                  readOnly
                  placeholder="Your bank"
                />
              </div>
              <div>
                <Label>Account Number</Label>
                <Input
                  id="account_number"
                  value={employeeWorkData.account_number || ''}
                  readOnly
                  placeholder="Your account number"
                />
              </div>
              <div>
                <Label>Account Holder Name</Label>
                <Input
                  id="account_name"
                  value={employeeWorkData.account_name || ''}
                  readOnly
                  placeholder="Your account holder name"
                />
              </div>
              <div className="col-span-full flex justify-end mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full md:w-auto">
                      <Pencil className="h-4 w-4 mr-1" /> Edit Data
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Data</DialogTitle>
                    </DialogHeader>
                    <EmployeeEditWorkDataForm
                      employeeId={employeeData.id}
                      initialData={{
                        id: employeeData.id || '',
                        account_bank: employeeWorkData.account_bank as Bank,
                        account_name: employeeWorkData.account_name || '',
                        account_number: employeeWorkData.account_number || '',
                      }}
                      onSuccess={handleOperationSuccess}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
