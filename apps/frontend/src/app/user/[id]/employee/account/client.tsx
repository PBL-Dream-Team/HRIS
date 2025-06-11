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
import { format, parseISO, set } from 'date-fns';

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

type EducationType = 'HIGH_SCHOOL' | 'BACHELOR' | 'MASTER' | 'DOCTOR';
type GenderType = 'M' | 'F' | 'O';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [user, setUser] = useState({
    name: 'Loading...',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '/avatars/default.jpg',
    compName: '',
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

  const [openEditGenDialog, setOpenEditGenDialog] = useState(false);
  const [openEditWorkDialog, setOpenEditWorkDialog] = useState(false);
  const [openEditPassDialog, setOpenEditPassDialog] = useState(false);

  // Data Fetching
  const fetchData = useCallback(async () => {
    let mounted = true;

    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      // If initialData is provided, use it first
      if (initialData) {
        if (mounted) {
          setUser({
            name: `${String(initialData.first_name || '')} ${String(initialData.last_name || '')}`.trim() || 'Unknown User',
            first_name: String(initialData.first_name || ''),
            last_name: String(initialData.last_name || ''),
            position: String(initialData.position || ''),
            avatar: String(initialData.pict_dir || '/avatars/default.jpg'),
            compName: '',
          });

          setEmployeeData({
            first_name: String(initialData.first_name || ''),
            last_name: String(initialData.last_name || ''),
            gender: String(initialData.gender || ''),
            last_education: String(initialData.last_education || ''),
            phone: String(initialData.phone || ''),
            email: String(initialData.email || ''),
            nik: String(initialData.nik || ''),
            birth_place: String(initialData.birth_place || ''),
            birth_date: String(initialData.birth_date?.split('T')[0] || ''),
            id: String(initialData.id || ''),
            pict_dir: String(initialData.pict_dir || ''),
          });

          setEmployeeWorkData({
            position: String(initialData.position || ''),
            branch: String(initialData.branch || ''),
            contract: String(initialData.contract || ''),
            workscheme: String(initialData.workscheme || ''),
            account_bank: String(initialData.account_bank || ''),
            account_name: String(initialData.account_name || ''),
            account_number: String(initialData.account_number || ''),
          });

          setIsLoading(false);
          return;
        }
      }

      // Fetch data from API if no initialData
      const res = await api.get(`/api/employee/${userId}`);
      const employee = res.data?.data;

      if (!employee) {
        throw new Error('Failed to fetch employee data');
      }

      // Fetch company data
      const compRes = await api.get(`/api/company/${companyId}`);
      const { name } = compRes.data?.data || {};

      if (mounted) {
        const firstName = String(employee.first_name || '');
        const lastName = String(employee.last_name || '');
        const userAvatar = String(employee.pict_dir || '/avatars/default.jpg');

        setUser({
          name: `${firstName} ${lastName}`.trim() || 'Unknown User',
          first_name: firstName,
          last_name: lastName,
          position: String(employee.position || ''),
          avatar: userAvatar,
          compName: name || 'Unknown Company',
        });

        setEmployeeData({
          first_name: firstName,
          last_name: lastName,
          gender: String(employee.gender || ''),
          last_education: String(employee.last_education || ''),
          phone: String(employee.phone || ''),
          email: String(employee.email || ''),
          nik: String(employee.nik || ''),
          birth_place: String(employee.birth_place || ''),
          birth_date: String(employee.birth_date?.split('T')[0] || ''),
          id: String(employee.id || ''),
          pict_dir: String(employee.pict_dir || ''),
        });

        setEmployeeWorkData({
          position: String(employee.position || ''),
          branch: String(employee.branch || ''),
          contract: String(employee.contract || ''),
          workscheme: String(employee.workscheme || ''),
          account_bank: String(employee.account_bank || ''),
          account_name: String(employee.account_name || ''),
          account_number: String(employee.account_number || ''),
        });
      }
    } catch (err: any) {
      console.error('Error fetching user:', err.response?.data || err.message);
      
      if (mounted) {
        setError('Failed to fetch employee data. Please try again.');
        // Set safe default values on error
        setUser({
          name: 'Unknown User',
          first_name: '',
          last_name: '',
          position: '',
          avatar: '/avatars/default.jpg',
          compName: 'Unknown Company',
        });
        setEmployeeData({
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
        setEmployeeWorkData({
          position: '',
          branch: '',
          contract: '',
          workscheme: '',
          account_bank: '',
          account_name: '',
          account_number: '',
        });
      }
    } finally {
      if (mounted) {
        setIsLoading(false);
      }
    }

    return () => {
      mounted = false;
    };
  }, [userId, companyId, initialData]);

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
      case 'O':
        return 'Other';
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

  // Show loading state
  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg">Loading account data...</div>
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
              <Button onClick={() => fetchData()}>Try Again</Button>
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
                  <BreadcrumbPage>Account</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
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
                value={employeeData.email || ''}
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
                <Dialog open={openEditGenDialog} onOpenChange={setOpenEditGenDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-fit md:w-auto">
                      <Pencil className="h-4 w-4 mr-1" /> Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                        birth_date: employeeData.birth_date || '',
                        pict_dir: employeeData.pict_dir || '',
                        email: employeeData.email || '',
                      }}
                      onSuccess={handleOperationSuccess}
                      onClose={() => setOpenEditGenDialog(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog open={openEditPassDialog} onOpenChange={setOpenEditPassDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-fit md:w-auto">
                      <Pencil className="h-4 w-4 mr-1" /> Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <EditPassword
                      userId={userId}
                      onSuccess={handleOperationSuccess}
                      onClose={() => setOpenEditPassDialog(false)}
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
                <Dialog open={openEditWorkDialog} onOpenChange={setOpenEditWorkDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-fit md:w-auto">
                      <Pencil className="h-4 w-4 mr-1" /> Edit Data
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                      onClose={() => setOpenEditWorkDialog(false)}
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
