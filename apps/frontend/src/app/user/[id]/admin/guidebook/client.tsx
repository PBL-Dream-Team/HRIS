'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { useState } from 'react';

import EmployeeInformation from '@/components/employeedatabase/employee-information';

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

import { Input } from '@/components/ui/input';
import { Bell } from 'lucide-react';
import { NavUser } from '@/components/nav-user';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/axios';
import { useEffect } from 'react';

type GuideBookClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

export default function GuideBookClient({
  isAdmin,
  userId,
  companyId,
}: GuideBookClientProps) {
  const [user, setUser] = useState({
    name: '',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '',
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get(`/api/employee/${userId}`);
        const { first_name, last_name, position, pict_dir } = res.data.data;

        setUser({
          name: `${first_name} ${last_name}`,
          first_name: first_name,
          last_name: last_name,
          position: position,
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
                  <BreadcrumbPage>Guide Book</BreadcrumbPage>
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
        <div className="p-4">
          <Tabs defaultValue="subscription" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="company">Company Data</TabsTrigger>
              <TabsTrigger value="employee">Employee Management</TabsTrigger>
              <TabsTrigger value="attendance">Attendance Management</TabsTrigger>
              <TabsTrigger value="letter">Letter Management</TabsTrigger>
            </TabsList>
            <TabsContent value="subscription">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Subscription Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Panduan mengenai pengelolaan subscription dan pembayaran.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Menu */}
            <TabsContent value="account">
              <Card className="w-full p-6">
                <CardTitle className="mb-6 text-xl">Account Management Guide</CardTitle>
                <Tabs defaultValue="account_information" className="w-full">
                  <div className="flex gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-64 flex-shrink-0">
                      <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                        <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                          <TabsTrigger
                            value="account_information"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Account Information
                          </TabsTrigger>
                          <TabsTrigger
                            value="edit_account_data"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Account Data Edit
                          </TabsTrigger>
                          <TabsTrigger
                            value="subscription_information"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Subscription Information
                          </TabsTrigger>
                        </TabsList>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-h-fit">
                      {/* Account Information */}
                      <TabsContent value="account_information" className="mt-0 h-full">
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Account Information Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Here you can view detailed information about an employee. This section covers viewing employee profiles, attendance records, and performance data.</p>
                              <div className="bg-purple-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Available Information:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>bla bla bla</li>
                                  <li>ble ble ble</li>
                                  <li>blo blo blo</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      {/* Edit Account Data */}
                      <TabsContent value="edit_account_data" className="mt-0 h-full">
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Edit Account Data Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Follow the steps to edit an existing employee's information. Learn how to update personal details, job information, and access permissions.</p>
                              <div className="bg-yellow-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Editable Information:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>bla bla bla</li>
                                  <li>ble ble ble</li>
                                  <li>blo blo blo</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      {/* Subscription Information */}
                      <TabsContent value="subscription_information" className="mt-0 h-full">
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Subscription Information Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Here you can view detailed information about an employee. This section covers viewing employee profiles, attendance records, and performance data.</p>
                              <div className="bg-purple-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Available Information:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>bla bla bla</li>
                                  <li>ble ble ble</li>
                                  <li>blo blo blo</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </div>
                  </div>
                </Tabs>
              </Card>
            </TabsContent>

            {/* Company Menu  */}
            <TabsContent value="company">
              <Card className="w-full p-6">
                <CardTitle className="mb-6 text-xl">Company Management Guide</CardTitle>
                <Tabs defaultValue="company_data_information" className="w-full">
                  <div className="flex gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-64 flex-shrink-0">
                      <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                        <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                          <TabsTrigger
                            value="company_data_information"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Company Data Information
                          </TabsTrigger>
                          <TabsTrigger
                            value="edit_company_data"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Company Data Edit
                          </TabsTrigger>
                        </TabsList>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-h-fit">
                      {/* Company Data Information */}
                      <TabsContent value="company_data_information" className="mt-0 h-full">
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Company Data Information Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Here you can view detailed information about an employee. This section covers viewing employee profiles, attendance records, and performance data.</p>
                              <div className="bg-purple-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Available Information:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>bla bla bla</li>
                                  <li>ble ble ble</li>
                                  <li>blo blo blo</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      {/* Edit Company Data */}
                      <TabsContent value="edit_company_data" className="mt-0 h-full">
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Edit Company Data Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Follow the steps to edit an existing employee's information. Learn how to update personal details, job information, and access permissions.</p>
                              <div className="bg-yellow-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Editable Information:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>bla bla bla</li>
                                  <li>ble ble ble</li>
                                  <li>blo blo blo</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </div>
                  </div>
                </Tabs>
              </Card>
            </TabsContent>

            {/* Employee Management Menu */}
            <TabsContent value="employee">
              <Card className="w-full p-6">
                <CardTitle className="mb-6 text-xl">Employee Management Guide</CardTitle>
                <Tabs defaultValue="employee_list" className="w-full">
                  <div className="flex gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-64 flex-shrink-0">
                      <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                        <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                          <TabsTrigger
                            value="employee_list"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Employee List
                          </TabsTrigger>
                          <TabsTrigger
                            value="add_employee"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Add Employee
                          </TabsTrigger>
                          <TabsTrigger
                            value="edit_employee"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Edit Employee
                          </TabsTrigger>
                          <TabsTrigger
                            value="delete_employee"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Delete Employee
                          </TabsTrigger>
                          <TabsTrigger
                            value="employee_information"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Employee Information
                          </TabsTrigger>
                        </TabsList>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-h-fit">
                      {/* Employee List */}
                      <TabsContent value="employee_list" className="mt-0 h-full">
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Employee List Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Here you can view all employees in the company. This section shows how to navigate the employee list, filter employees, and access their basic information.</p>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Key Features:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>bla bla bla</li>
                                  <li>ble ble ble</li>
                                  <li>blo blo blo</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      {/* Add Employee */}
                      <TabsContent value="add_employee" className="mt-0 h-full">
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Add Employee Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Follow the steps to add a new employee. This guide covers filling out employee forms, uploading documents, and setting initial permissions.</p>
                              <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Steps to Add Employee:</h4>
                                <ol className="list-decimal list-inside space-y-1 text-sm">
                                  <li>bla bla bla</li>
                                  <li>ble ble ble</li>
                                  <li>blo blo blo</li>
                                </ol>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      {/* Edit Employee */}
                      <TabsContent value="edit_employee" className="mt-0 h-full">
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Edit Employee Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Follow the steps to edit an existing employee's information. Learn how to update personal details, job information, and access permissions.</p>
                              <div className="bg-yellow-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Editable Information:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>bla bla bla</li>
                                  <li>ble ble ble</li>
                                  <li>blo blo blo</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      {/* Delete Employee */}
                      <TabsContent value="delete_employee" className="mt-0 h-full">
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Delete Employee Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Follow the steps to delete an employee from the system. This guide explains the deletion process and data retention policies.</p>
                              <div className="bg-red-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Important Notes:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>bla bla bla</li>
                                  <li>ble ble ble</li>
                                  <li>blo blo blo</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      {/* Employee Information */}
                      <TabsContent value="employee_information" className="mt-0 h-full">
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Employee Information Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Here you can view detailed information about an employee. This section covers viewing employee profiles, attendance records, and performance data.</p>
                              <div className="bg-purple-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Available Information:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>bla bla bla</li>
                                  <li>ble ble ble</li>
                                  <li>blo blo blo</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </div>
                  </div>
                </Tabs>
              </Card>
            </TabsContent>

            {/* Attendance Management Menu */}
            <TabsContent value="attendance">
              <Card className="w-full p-6">
                <CardTitle className="mb-6 text-xl">Attendance Management Guide</CardTitle>
                <Tabs defaultValue="attendance_management" className="w-full">
                  <div className="flex gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-64 flex-shrink-0">
                      <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                        <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                          <TabsTrigger
                            value="attendance_management"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Attendance Management
                          </TabsTrigger>
                          <TabsTrigger
                            value="workscheme_management"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Workscheme Management
                          </TabsTrigger>
                          <TabsTrigger
                            value="absence_management"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Absence Management
                          </TabsTrigger>
                        </TabsList>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-h-fit">

                      {/* Attendance Management */}
                      <TabsContent value="attendance_management" className="mt-0 h-full">
                        {/* Content */}
                        <Card className="w-full p-6">
                          <CardTitle className="mb-6 text-xl">Attendance Management Guide</CardTitle>
                          <Tabs defaultValue="attendance_list" className="w-full">
                            <div className="flex gap-6">
                              {/* Sidebar Navigation */}
                              <div className="w-64 flex-shrink-0">
                                <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                                  <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                                    <TabsTrigger
                                      value="attendance_list"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Attendance List
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="add_attendance"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Add Attendance
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="edit_attendance"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Edit Attendance
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="delete_attendance"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Delete Attendance
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="attendance_details"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Attendance Details
                                    </TabsTrigger>
                                  </TabsList>
                                </div>
                              </div>

                              {/* Content Area */}
                              <div className="flex-1 min-h-fit">
                                {/* Attendance List */}
                                <TabsContent value="attendance_list" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Attendance List Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Here you can view all employees in the company. This section shows how to navigate the employee list, filter employees, and access their basic information.</p>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Key Features:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Add Attendance */}
                                <TabsContent value="add_attendance" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Add Attendance Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to add a new letter. This guide covers filling out employee forms, uploading documents, and setting initial permissions.</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Steps to Add Employee:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ol>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Edit Attendance */}
                                <TabsContent value="edit_attendance" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Edit Attendance Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to edit an existing letter's information.</p>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Editable Information:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Delete Attendance */}
                                <TabsContent value="delete_attendance" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Delete Attendance Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to delete an letter from the system. This guide explains the deletion process and data retention policies.</p>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Important Notes:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Attendance Details */}
                                <TabsContent value="attendance_details" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Attendance Details Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Here you can view detailed information about a letter.</p>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Available Information:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </div>
                            </div>
                          </Tabs>
                        </Card>
                      </TabsContent>

                      {/* Workscheme Management */}
                      <TabsContent value="workscheme_management" className="mt-0 h-full">
                        {/* Content */}
                        <Card className="w-full p-6">
                          <CardTitle className="mb-6 text-xl">Workscheme Management Guide</CardTitle>
                          <Tabs defaultValue="workscheme_list" className="w-full">
                            <div className="flex gap-6">
                              {/* Sidebar Navigation */}
                              <div className="w-64 flex-shrink-0">
                                <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                                  <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                                    <TabsTrigger
                                      value="workscheme_list"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Workscheme List
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="add_workscheme"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Add Workscheme
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="edit_workscheme"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Edit Workscheme
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="delete_workscheme"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Delete Workscheme
                                    </TabsTrigger>
                                  </TabsList>
                                </div>
                              </div>

                              {/* Content Area */}
                              <div className="flex-1 min-h-fit">
                                {/* Workscheme List */}
                                <TabsContent value="workscheme_list" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Workscheme List Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Here you can view all type of letter in the company. This section shows how to navigate the employee list, filter employees, and access their basic information.</p>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Key Features:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Add Workscheme */}
                                <TabsContent value="add_workscheme" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Add Workscheme Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to add a new letter. This guide covers filling out employee forms, uploading documents, and setting initial permissions.</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Steps to Add Employee:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ol>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Edit Letter */}
                                <TabsContent value="edit_workscheme" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Edit Workscheme Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to edit an existing letter's information.</p>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Editable Information:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Delete Letter */}
                                <TabsContent value="delete_workscheme" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Delete Letter Type Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to delete an letter from the system. This guide explains the deletion process and data retention policies.</p>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Important Notes:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </div>
                            </div>
                          </Tabs>
                        </Card>
                      </TabsContent>

                      {/* Absence Management */}
                      <TabsContent value="absence_management" className="mt-0 h-full">
                        {/* Content */}
                        <Card className="w-full p-6">
                          <CardTitle className="mb-6 text-xl">Absence Management Guide</CardTitle>
                          <Tabs defaultValue="absence_list" className="w-full">
                            <div className="flex gap-6">
                              {/* Sidebar Navigation */}
                              <div className="w-64 flex-shrink-0">
                                <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                                  <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                                    <TabsTrigger
                                      value="absence_list"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Absence List
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="add_absence"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Add Absence
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="edit_absence"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Edit Absence
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="delete_absence"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Delete Absence
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="absence_details"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Absence Details
                                    </TabsTrigger>
                                  </TabsList>
                                </div>
                              </div>

                              {/* Content Area */}
                              <div className="flex-1 min-h-fit">
                                {/* Absence List */}
                                <TabsContent value="absence_list" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Absence List Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Here you can view all employees in the company. This section shows how to navigate the employee list, filter employees, and access their basic information.</p>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Key Features:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Add Absence */}
                                <TabsContent value="add_absence" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Add Absence Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to add a new letter. This guide covers filling out employee forms, uploading documents, and setting initial permissions.</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Steps to Add Employee:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ol>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Edit Absence */}
                                <TabsContent value="edit_absence" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Edit Absence Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to edit an existing letter's information.</p>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Editable Information:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Delete Absence */}
                                <TabsContent value="delete_absence" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Delete Absence Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to delete an letter from the system. This guide explains the deletion process and data retention policies.</p>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Important Notes:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Absence Details */}
                                <TabsContent value="absence_details" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Absence Details Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Here you can view detailed information about a letter.</p>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Available Information:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </div>
                            </div>
                          </Tabs>
                        </Card>
                      </TabsContent>
                    </div>
                  </div>
                </Tabs>
              </Card>
            </TabsContent>

            <TabsContent value="letter">
              <Card className="w-full p-6">
                <CardTitle className="mb-6 text-xl">Letter Management Guide</CardTitle>
                <Tabs defaultValue="letter_management" className="w-full">
                  <div className="flex gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-64 flex-shrink-0">
                      <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                        <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                          <TabsTrigger
                            value="letter_management"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Letter Management
                          </TabsTrigger>
                          <TabsTrigger
                            value="letter_type_management"
                            className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                          >
                            Letter Type Management
                          </TabsTrigger>
                        </TabsList>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-h-fit">
                      {/* Letter Management */}
                      <TabsContent value="letter_management" className="mt-0 h-full">
                        {/* Content */}
                        <Card className="w-full p-6">
                          <CardTitle className="mb-6 text-xl">Letter Management Guide</CardTitle>
                          <Tabs defaultValue="letter_list" className="w-full">
                            <div className="flex gap-6">
                              {/* Sidebar Navigation */}
                              <div className="w-64 flex-shrink-0">
                                <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                                  <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                                    <TabsTrigger
                                      value="letter_list"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Letter List
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="add_letter"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Add Letter
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="edit_letter"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Edit Letter
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="delete_letter"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Delete Letter
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="letter_details"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Letter Details
                                    </TabsTrigger>
                                  </TabsList>
                                </div>
                              </div>

                              {/* Content Area */}
                              <div className="flex-1 min-h-fit">
                                {/* Letter List */}
                                <TabsContent value="letter_list" className="mt-0 h-full">
                                  <Card className="w-full h-full">
                                    <CardHeader>
                                      <CardTitle>Letter List Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>asdgwaubdjagwudyag ahwdoiua wjdbagwda</p>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Key Features:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Add Letter */}
                                <TabsContent value="add_letter" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Add Letter Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to add a new letter. This guide covers filling out employee forms, uploading documents, and setting initial permissions.</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Steps to Add Employee:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ol>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Edit Letter */}
                                <TabsContent value="edit_letter" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Edit Letter Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to edit an existing letter's information.</p>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Editable Information:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Delete Letter */}
                                <TabsContent value="delete_letter" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Delete Letter Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to delete an letter from the system. This guide explains the deletion process and data retention policies.</p>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Important Notes:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Letter Details */}
                                <TabsContent value="letter_details" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Letter Details Information Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Here you can view detailed information about a letter.</p>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Available Information:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </div>
                            </div>
                          </Tabs>
                        </Card>
                      </TabsContent>
                      {/* Letter Type Management */}
                      <TabsContent value="letter_type_management" className="mt-0 h-full">
                        {/* Content */}
                        <Card className="w-full p-6">
                          <CardTitle className="mb-6 text-xl">Letter Type Management Guide</CardTitle>
                          <Tabs defaultValue="letter_type_list" className="w-full">
                            <div className="flex gap-6">
                              {/* Sidebar Navigation */}
                              <div className="w-64 flex-shrink-0">
                                <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                                  <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                                    <TabsTrigger
                                      value="letter_type_list"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Letter Type List
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="add_letter_type"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Add Letter Type
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="edit_letter_type"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Edit Letter Type
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="delete_letter_type"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Delete Letter Type
                                    </TabsTrigger>
                                  </TabsList>
                                </div>
                              </div>

                              {/* Content Area */}
                              <div className="flex-1 min-h-fit">
                                {/* Letter Type List */}
                                <TabsContent value="letter_type_list" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Letter Type List Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Here you can view all type of letter in the company. This section shows how to navigate the employee list, filter employees, and access their basic information.</p>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Key Features:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Add Letter Type */}
                                <TabsContent value="add_letter_type" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Add Letter Type Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to add a new letter. This guide covers filling out employee forms, uploading documents, and setting initial permissions.</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Steps to Add Employee:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ol>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Edit Letter */}
                                <TabsContent value="edit_letter_type" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Edit Letter Type Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to edit an existing letter's information.</p>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Editable Information:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Delete Letter */}
                                <TabsContent value="delete_letter_type" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Delete Letter Type Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Follow the steps to delete an letter from the system. This guide explains the deletion process and data retention policies.</p>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Important Notes:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>bla bla bla</li>
                                            <li>ble ble ble</li>
                                            <li>blo blo blo</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </div>
                            </div>
                          </Tabs>
                        </Card>
                      </TabsContent>
                    </div>
                  </div>
                </Tabs>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}