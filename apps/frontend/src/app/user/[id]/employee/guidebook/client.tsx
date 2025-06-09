'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { useState } from 'react';

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
import { Bell } from 'lucide-react';
import { NavUser } from '@/components/nav-user';

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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>

        {/* Content */}
        <div className="p-4">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="attendance">Attendance Management</TabsTrigger>
              <TabsTrigger value="letter">Letter Management</TabsTrigger>
            </TabsList>

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
                            Edit Account Data
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
                              <p>Account data information can be accessed on the profile page.</p>
                              <p>To navigate to the profile page, follow these steps:</p>
                              <ol className="list-decimal list-inside space-y-1 text-sm bg-blue-50 p-4 rounded-lg">
                                <li>Click on the account name information in the top right corner.</li>
                                <li>The system will display account information along with the "Account" menu and "Log out" button.</li>
                                <li>Click the "Account" menu to go to the profile page.</li>
                              </ol>

                              <p>Here the system displays personal data details of the account owner that have been added by the admin. Data is divided into two types: general information and work information.</p>
                              <div className='grid grid-cols-2 gap-4'>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">General Information:</h4>
                                  <div className='grid grid-cols-2 gap-4'>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      <li>Avatar/Profile Picture</li>
                                      <li>First Name</li>
                                      <li>Last Name</li>
                                      <li>Gender</li>
                                      <li>Last Education</li>
                                    </ul>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      <li>Phone Number</li>
                                      <li>Email</li>
                                      <li>Place of Birth</li>
                                      <li>Date of Birth</li>
                                      <li>National ID Number (NIK)</li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">Work Information:</h4>
                                  <div className='grid grid-cols-2 gap-4'>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      <li>Position</li>
                                      <li>Branch</li>
                                      <li>Contact Type</li>
                                      <li>Gender</li>
                                      <li>Workscheme</li>
                                    </ul>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      <li>Employee ID</li>
                                      <li>Bank</li>
                                      <li>Account Number</li>
                                      <li>Account Name</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      {/* Edit Account Data */}
                      <TabsContent value="edit_account_data" className="mt-0 h-full">
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Account Data Edit Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Account information can be modified directly by the user. However, some data can only be changed by the admin.</p>
                              <p>Here is the data that can be changed directly by the user:</p>
                              <div className='grid grid-cols-2 gap-4'>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">General Information:</h4>
                                  <div className='grid grid-cols-2 gap-4'>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      <li>First Name</li>
                                      <li>Last Name</li>
                                      <li>Gender</li>
                                      <li>Last Education</li>
                                    </ul>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      <li>Phone Number</li>
                                      <li>National ID Number (NIK)</li>
                                      <li>Place of Birth</li>
                                      <li>Date of Birth</li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">Work Information:</h4>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Bank</li>
                                    <li>Account Holder Name</li>
                                    <li>Account Number</li>
                                  </ul>
                                </div>
                              </div>
                              <p>To edit account data, follow these steps:</p>
                              <div className='grid grid-cols-2 gap-4'>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">General Information:</h4>
                                  <ul className="list-decimal list-inside space-y-1 text-sm">
                                    <li>Go to the profile page.</li>
                                    <li>In the "General Information" section, click the "Edit Profile" button.</li>
                                    <li>The system will display a form to edit data.</li>
                                    <li>In this form, users can change information as desired.</li>
                                    <li>Click the "Save" button to save changes.</li>
                                    <li>Information on the profile page will automatically update.</li>
                                  </ul>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">Work Information:</h4>
                                  <ul className="list-decimal list-inside space-y-1 text-sm">
                                    <li>Go to the profile page.</li>
                                    <li>In the "Work Information" section, click the "Edit Data" button.</li>
                                    <li>The system will display a form to edit data.</li>
                                    <li>In this form, users can change information as desired.</li>
                                    <li>Click the "Save" button to save changes.</li>
                                    <li>Information on the profile page will automatically update.</li>
                                  </ul>
                                </div>
                              </div>
                              <p>Users can also change their account password, follow these steps:</p>
                              <div className='bg-yellow-50 p-4 rounded-lg'>
                                <h4 className="font-semibold mb-2">Change Password:</h4>
                                <ul className="list-decimal list-inside space-y-1 text-sm">
                                  <li>Go to the profile page.</li>
                                  <li>In the "General Information" section, click the "Change Password" button.</li>
                                  <li>The system will display a form to change the password.</li>
                                  <li>Enter the old password, new password, and confirm the new password.</li>
                                  <li>Click the "Save" button to save changes.</li>
                                  <li>The account password will automatically change.</li>
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
                          <Tabs defaultValue="attendance_overview" className="w-full">
                            <div className="flex gap-6">
                              {/* Sidebar Navigation */}
                              <div className="w-64 flex-shrink-0">
                                <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                                  <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                                    <TabsTrigger
                                      value="attendance_overview"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Attendance Overview
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="clock_in"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Clock In
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="clock_out"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Clock Out
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
                                {/* Attendance Overview */}
                                <TabsContent value="attendance_overview" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Attendance Overview Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Attendance data previously submitted by users will be recorded by the system and displayed on the "Checkclock" page in table form.</p>
                                        <p className='bg-blue-50 p-2 rounded-lg'>The "Checkclock" page can be accessed from the navigation menu on the left.</p>
                                        <p>The attendance data displayed in the table includes:</p>
                                        <div className="bg-purple-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Date</li>
                                            <li>Clock In</li>
                                            <li>Clock Out</li>
                                          </ul>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Work Hours</li>
                                            <li>Status (On Time/Late)</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Clock In */}
                                <TabsContent value="clock_in" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Clock In Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Users can record attendance using the clock in feature. This feature is available on the "Checkclock" menu.</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Clock In Steps:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Go to the "Checkclock" page.</li>
                                            <li>Above the table, there is a "Clock In" button.</li>
                                            <li>Click this button to save attendance data.</li>
                                            <li>The system will record the clock in time and display the data in the table.</li>
                                          </ol>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Clock Out */}
                                <TabsContent value="clock_out" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Clock Out Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Users who have finished working can use the clock out feature to complete attendance for that day. This feature is available on the "Checkclock" menu.</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Clock Out Steps:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Go to the "Checkclock" page.</li>
                                            <li>In the table, there is a "Clock Out" button next to the "detail attendance" button.</li>
                                            <li>Click this button to save attendance data.</li>
                                            <li>The system will record the clock out time and display the data in the table.</li>
                                            <li>The system automatically calculates working hours based on clock in and clock out times.</li>
                                          </ol>
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
                                        <p>Users can view attendance details for specific days.</p>
                                        <p className='bg-blue-50 p-2 rounded-lg'>This feature can be accessed by clicking the "detail attendance" button in the table on the "Checkclock" page.</p>
                                        <p>The attendance details displayed include:</p>
                                        <div className='grid grid-cols-2 gap-4'>
                                          <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2">Attendance Information:</h4>
                                            <div className='grid grid-cols-2 gap-4'>
                                              <ul className="list-disc list-inside space-y-1 text-sm">
                                                <li>Date</li>
                                                <li>Clock In</li>
                                                <li>Work Hours</li>
                                              </ul>
                                              <ul className="list-disc list-inside space-y-1 text-sm">
                                                <li>Status</li>
                                                <li>Clock Out</li>
                                              </ul>
                                            </div>
                                          </div>
                                          <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2">Location Information:</h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                              <li>Location</li>
                                              <li>Detail Address</li>
                                              <li>Latitude</li>
                                              <li>Longitude</li>
                                            </ul>
                                          </div>
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
                          <Tabs defaultValue="absence_overview" className="w-full">
                            <div className="flex gap-6">
                              {/* Sidebar Navigation */}
                              <div className="w-64 flex-shrink-0">
                                <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                                  <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                                    <TabsTrigger
                                      value="absence_overview"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Absence Overview
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
                                <TabsContent value="absence_overview" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Absence Overview Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Leave request data previously submitted by users will be recorded by the system and displayed on the "Absence" page.</p>
                                        <p className='bg-blue-50 p-2 rounded-lg'>The "Absence" page can be accessed from the navigation menu on the left.</p>
                                        <p>The leave request data displayed in the table includes:</p>
                                        <div className="bg-purple-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Created At (time)</li>
                                            <li>Date (Sick/Permission/Leave)</li>
                                            <li>Type</li>
                                          </ul>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Reason</li>
                                            <li>Status (Approved/Rejected/Pending)</li>
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
                                        <p>Users can submit leave requests to the admin using the "Add Absence" feature. This feature is available on the "Absence" menu.</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Add Absence Steps:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Go to the "Absence" page.</li>
                                            <li>Above the table, there is an "Add Absence" button.</li>
                                            <li>Click this button to display the leave request form.</li>
                                            <li>Fill in the required data.</li>
                                            <li>Click the "Submit" button to submit the request.</li>
                                            <li>The system will record the request data and display it in the table.</li>
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
                                        <p>The system allows users to modify leave request data if there are errors when filling out the form. As long as the request status is "Pending", users can still edit their leave request data.</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Edit Absence Steps:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Go to the "Absence" page.</li>
                                            <li>In the table, there is an edit button (pencil icon) for each request.</li>
                                            <li>Click this button to display the edit absence form.</li>
                                            <li>In this form, users can modify the request data as desired.</li>
                                            <li>Click the "Save" button to save changes.</li>
                                            <li>The system will record the new request data and display it in the table.</li>
                                          </ol>
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
                                        <p>Users can cancel leave requests by deleting the request data. There is a trash can icon button to delete request data.</p>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Important Notes:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Users can only delete data when the request status is "Pending".</li>
                                            <li>Once data is deleted, users cannot recover it.</li>
                                            <li>Before deleting, make sure to check the details first.</li>
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
                                        <p>Users can view leave request details by clicking the eye icon button in the table.</p>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Absence Details:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Status (Pending/Approved/Rejected)</li>
                                            <li>Created At (Time)</li>
                                            <li>Date</li>
                                            <li>Type (Sick/Permit/Leave)</li>
                                            <li>Reason</li>
                                            <li>Evidence Picture</li>
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

            {/* Letter Management Menu */}
            <TabsContent value="letter">
              <Card className="w-full p-6">
                <CardTitle className="mb-6 text-xl">Letter Overview Guide</CardTitle>
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
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Letter List Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Users can view letters entered into the system by the admin. Letter data can only be viewed by the intended user, and users can download the letter file. Letter data is displayed on the "Letters" page in table form.</p>
                              <p className='bg-blue-50 p-2 rounded-lg'>The "Letters" page can be accessed from the navigation menu on the left.</p>
                              <p>The letter data displayed in the table includes:</p>
                              <div className='bg-purple-50 p-4 rounded-lg'>
                                <div className='grid grid-cols-2 gap-4'>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Letter Name</li>
                                    <li>Employee Name</li>
                                    <li>Letter Type</li>
                                  </ul>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Valid Until</li>
                                    <li>Status</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      {/* Letter Details */}
                      <TabsContent value="letter_details" className="mt-0 h-full">
                        <Card className="w-full h-fit">
                          <CardHeader>
                            <CardTitle>Letter Details Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Users can view letter details by clicking the eye icon button in the table.</p>
                              <p>The letter details displayed include:</p>
                              <div className="bg-purple-50 p-4 rounded-lg">
                                <div className='grid grid-cols-2 gap-4'>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Status (Active/Inactive)</li>
                                    <li>Letter Name</li>
                                    <li>Letter Type</li>
                                  </ul>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Description</li>
                                    <li>Valid Until (date)</li>
                                  </ul>
                                </div>
                              </div>
                              <p>To download the letter, users can click the download button next to the detail letter button.</p>
                            </div>
                          </CardContent>
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