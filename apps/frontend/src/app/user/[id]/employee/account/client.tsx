'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Input } from '@/components/ui/input';
import {
  Bell,
  Upload,
  CreditCardIcon,
  CalendarIcon,
  Pencil,
} from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EmployeeEditGeneralDataForm } from '@/components/editData-Employee/generalInformation-form';
import { EmployeeEditWorkDataForm } from '@/components/editData-Employee/workInformation-form';

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

import { IoMdSearch } from 'react-icons/io';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

type AccountClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

export default function AccountClient({
  isAdmin,
  userId,
  companyId,
}: AccountClientProps) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get(`/api/employee/${userId}`);
        const { first_name, last_name, email, pict_dir } = res.data.data;

        setUser({
          name: `${first_name} ${last_name}`,
          email: email,
          avatar: pict_dir || '/avatars/default.jpg',
        });
      } catch (err: any) {
        console.error(
          'Error fetching user:',
          err.response?.data || err.message,
        );
      }
    }

    fetchUser();
  }, [userId]);

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
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <Label>First Name</Label>
              <Input placeholder="Your first name" readOnly />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input placeholder="Your last name" readOnly />
            </div>
            <div>
              <Label>Gender</Label>
              <Input placeholder="Your gender" readOnly />
            </div>
            <div>
              <Label>Last Education</Label>
              <Input placeholder="Your last education" readOnly />
            </div>
            <div>
              <Label>Mobile Number</Label>
              <Input placeholder="Your phone number" readOnly />
            </div>
            <div>
              <Label>NIK</Label>
              <Input placeholder="Your NIK" readOnly />
            </div>
            <div>
              <Label>Place of Birth</Label>
              <Input placeholder="Your place of birth" readOnly />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input placeholder="Your date of birth" readOnly />
            </div>
            <div>
              <Label>ID</Label>
              <Input placeholder="Your ID" readOnly />
            </div>
            <div>
              <Label>Password</Label>
              <Input placeholder="Your password" readOnly />
            </div>
            <div className="col-span-full flex justify-end">
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
                  <EmployeeEditGeneralDataForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Work Information */}
          <div className="w-full h-fit md:w-1/3 grid grid-cols-1 gap-4 border-2 p-4 bg-white rounded-lg shadow">
            <h1 className="text-lg font-semibold mb-1">Work Information</h1>
            <Card className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
              <div>
                <Label>Position</Label>
                <Input placeholder="Your position" readOnly />
              </div>
              <div>
                <Label>Branch</Label>
                <Input placeholder="Your branch" readOnly />
              </div>
              <div>
                <Label>Contract Type</Label>
                <Input placeholder="Your contract type" readOnly />
              </div>
              <div>
                <Label>Grade</Label>
                <Input placeholder="Your grade" readOnly />
              </div>
              <div className="col-span-full">
                <Label>SP Type</Label>
                <Input placeholder="Your sp type" readOnly />
              </div>
            </Card>
            <Card className="grid grid-cols-1 gap-2 p-4">
              <div className="col-span-full">
                <Label>Bank</Label>
                <Input placeholder="Your bank" readOnly />
              </div>
              <div>
                <Label>Account Number</Label>
                <Input placeholder="Your account number" readOnly />
              </div>
              <div>
                <Label>Account Holder Name</Label>
                <Input placeholder="Your account holder name" readOnly />
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
                    <EmployeeEditWorkDataForm />
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
