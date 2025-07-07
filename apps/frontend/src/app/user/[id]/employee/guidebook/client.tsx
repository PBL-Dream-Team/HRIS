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
import { NavUser } from '@/components/nav-user';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/axios';
import { useEffect } from 'react';
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type GuideBookClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

export default function GuideBookClient({
  isAdmin,
  userId,
  companyId
}: GuideBookClientProps) {
  const [user, setUser] = useState({
    name: '',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '',
    compName: '',
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await api.get(`/api/employee/${userId}`);
        const { first_name, last_name, position, pict_dir } = res.data.data;
        const compRes = await api.get(`/api/company/${companyId}`);
        const { name } = compRes.data.data;

        setUser({
          name: `${first_name} ${last_name}`,
          first_name: first_name,
          last_name: last_name,
          position: position,
          avatar: pict_dir || '/avatars/default.jpg',
          compName: name || 'Unknown Company',
        });
      } catch (err: any) {
        console.error(
          'Error fetching user:',
          err.response?.data || err.message,
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg">Loading guidebook...</div>
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
            <TabsList className="grid w-full grid-cols-3 sm:w-full">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="letter">Letter</TabsTrigger>
            </TabsList>

            {/* Account Menu */}
            <TabsContent value="account">
              <Card className="w-full p-4 sm:p-6">
                <CardTitle className="mb-4 sm:mb-6 text-lg sm:text-xl">Account Management Guide</CardTitle>
                <Tabs defaultValue="account_information" className="w-full">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-full sm:w-64 flex-shrink-0 mb-2 sm:mb-0">
                      <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                        <TabsList className="flex flex-row sm:flex-col h-auto w-full bg-transparent p-0 space-y-0 sm:space-y-1 space-x-1 sm:space-x-0">
                          <TabsTrigger
                            value="account_information"
                            className="w-full justify-start text-left p-2 sm:p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium text-xs sm:text-base"
                          >
                            Account Information
                          </TabsTrigger>
                          <TabsTrigger
                            value="edit_account_data"
                            className="w-full justify-start text-left p-2 sm:p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium text-xs sm:text-base"
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
                            <CardTitle className="text-base sm:text-lg">Account Information Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Account data information can be accessed on the profile page.</p>
                              <p>To navigate to the profile page, follow these steps:</p>
                              <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm bg-blue-50 p-2 sm:p-4 rounded-lg">
                                <li>Click on the account name information in the top right corner.</li>
                                <li>The system will display account information along with the "Account" menu and "Log out" button.</li>
                                <li>Click the "Account" menu to go to the profile page.</li>
                              </ol>

                              <p>Here the system displays personal data details of the account owner that have been added by the admin. Data is divided into two types: general information and work information.</p>
                              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">General Information:</h4>
                                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                      <li>Avatar/Profile Picture</li>
                                      <li>First Name</li>
                                      <li>Last Name</li>
                                      <li>Gender</li>
                                      <li>Last Education</li>
                                    </ul>
                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                      <li>Phone Number</li>
                                      <li>Email</li>
                                      <li>Place of Birth</li>
                                      <li>Date of Birth</li>
                                      <li>National ID Number (NIK)</li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">Work Information:</h4>
                                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                      <li>Position</li>
                                      <li>Branch</li>
                                      <li>Contact Type</li>
                                      <li>Gender</li>
                                      <li>Workscheme</li>
                                    </ul>
                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
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
                            <CardTitle className="text-base sm:text-lg">Account Data Edit Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Account information can be modified directly by the user. However, some data can only be changed by the admin.</p>
                              <p>Here is the data that can be changed directly by the user:</p>
                              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">General Information:</h4>
                                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                      <li>First Name</li>
                                      <li>Last Name</li>
                                      <li>Gender</li>
                                      <li>Last Education</li>
                                    </ul>
                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                      <li>Phone Number</li>
                                      <li>National ID Number (NIK)</li>
                                      <li>Place of Birth</li>
                                      <li>Date of Birth</li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">Work Information:</h4>
                                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                    <li>Bank</li>
                                    <li>Account Holder Name</li>
                                    <li>Account Number</li>
                                  </ul>
                                </div>
                              </div>
                              <p>To edit account data, follow these steps:</p>
                              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className="bg-yellow-50 p-2 sm:p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">General Information:</h4>
                                  <ul className="list-decimal list-inside space-y-1 text-xs sm:text-sm">
                                    <li>Go to the profile page.</li>
                                    <li>In the "General Information" section, click the "Edit Profile" button.</li>
                                    <li>The system will display a form to edit data.</li>
                                    <li>In this form, users can change information as desired.</li>
                                    <li>Click the "Save" button to save changes.</li>
                                    <li>Information on the profile page will automatically update.</li>
                                  </ul>
                                </div>
                                <div className="bg-yellow-50 p-2 sm:p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">Work Information:</h4>
                                  <ul className="list-decimal list-inside space-y-1 text-xs sm:text-sm">
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
                              <div className='bg-yellow-50 p-2 sm:p-4 rounded-lg'>
                                <h4 className="font-semibold mb-2">Change Password:</h4>
                                <ul className="list-decimal list-inside space-y-1 text-xs sm:text-sm">
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
              <Card className="w-full p-4 sm:p-6">
                <Tabs defaultValue="checkclock_management" className="w-full">
                  <div className="hidden sm:block">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="checkclock_management">
                        Checkclock Management
                      </TabsTrigger>
                      <TabsTrigger value="leave_management">
                        Leave Management
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="flex-1 min-h-fit">
                    {/* Checkclock Management */}
                    <TabsContent value="checkclock_management" className="mt-0 h-full">
                      {/* Content */}
                      <Card className="w-full p-2 sm:p-6">
                        <CardTitle className="mb-4 sm:mb-6 text-lg sm:text-xl">Checkclock Management Guide</CardTitle>
                        {/* Tabs untuk Checkclock Management, handle mobile hamburger */}
                        <div className="w-full">
                          <Tabs
                            defaultValue="checkclock_overview"
                            className="w-full"
                          >
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                              {/* Sidebar Navigation */}
                              <div className="w-full sm:w-64 flex-shrink-0 mb-2 sm:mb-0">
                                <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                                  {/* TabsList hanya tampil di desktop */}
                                  <TabsList className="hidden sm:flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                                    <TabsTrigger
                                      value="checkclock_overview"
                                      className="w-full justify-start text-left p-2 sm:p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium text-xs sm:text-base"
                                    >
                                      Checkclock Overview
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="clock_in"
                                      className="w-full justify-start text-left p-2 sm:p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium text-xs sm:text-base"
                                    >
                                      Clock In
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="clock_out"
                                      className="w-full justify-start text-left p-2 sm:p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium text-xs sm:text-base"
                                    >
                                      Clock Out
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="checkclock_details"
                                      className="w-full justify-start text-left p-2 sm:p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium text-xs sm:text-base"
                                    >
                                      Checkclock Details
                                    </TabsTrigger>
                                  </TabsList>
                                </div>
                              </div>
                              {/* Content Area */}
                              <div className="flex-1 min-h-fit">
                                <TabsContent value="checkclock_overview" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle className="text-base sm:text-lg">Checkclock Overview Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Checkclock data previously submitted by users will be recorded by the system and displayed on the "Checkclock" page in table form.</p>
                                        <p className='bg-blue-50 p-2 rounded-lg'>The "Checkclock" page can be accessed from the navigation menu on the left.</p>
                                        <p>The checkclock data displayed in the table includes:</p>
                                        <div className="bg-purple-50 p-2 sm:p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                            <li>Date</li>
                                            <li>Clock In</li>
                                            <li>Clock Out</li>
                                          </ul>
                                          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
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
                                      <CardTitle className="text-base sm:text-lg">Clock In Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Users can record attendance using the clock in feature. This feature is available on the "Checkclock" menu.</p>
                                        <div className="bg-green-50 p-2 sm:p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Clock In Steps:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm">
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
                                      <CardTitle className="text-base sm:text-lg">Clock Out Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Users who have finished working can use the clock out feature to complete attendance for that day. This feature is available on the "Checkclock" menu.</p>
                                        <div className="bg-green-50 p-2 sm:p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Clock Out Steps:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm">
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
                                {/* Checkclock Details */}
                                <TabsContent value="checkclock_details" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle className="text-base sm:text-lg">Checkclock Details Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Users can view checkclock details for specific days.</p>
                                        <p className='bg-blue-50 p-2 rounded-lg'>This feature can be accessed by clicking the "detail checkclock" button in the table on the "Checkclock" page.</p>
                                        <p>The checkclock details displayed include:</p>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                          <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2">Checkclock Information:</h4>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Date</li>
                                                <li>Clock In</li>
                                                <li>Work Hours</li>
                                              </ul>
                                              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Status</li>
                                                <li>Clock Out</li>
                                              </ul>
                                            </div>
                                          </div>
                                          <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2">Location Information:</h4>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
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
                        </div>
                      </Card>
                    </TabsContent>

                    {/* Leave Management */}
                    <TabsContent value="leave_management" className="mt-0 h-full">
                      {/* Content */}
                      <Card className="w-full p-6">
                        <CardTitle className="mb-6 text-xl">Leave Management Guide</CardTitle>
                        <div className="w-full">
                          <Tabs
                            defaultValue="leave_overview"
                            className="w-full"
                          >
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                              {/* Sidebar Navigation */}
                              <div className="w-full sm:w-64 flex-shrink-0 mb-2 sm:mb-0">
                                <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                                  {/* TabsList hanya tampil di desktop */}
                                  <TabsList className="hidden sm:flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                                    <TabsTrigger
                                      value="leave_overview"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Leave Overview
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="add_leave"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Add Leave
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="edit_leave"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Edit Leave
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="delete_leave"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Delete Leave
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="leave_details"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Leave Details
                                    </TabsTrigger>
                                  </TabsList>
                                </div>
                              </div>
                              {/* Content Area */}
                              <div className="flex-1 min-h-fit">
                                <TabsContent value="leave_overview" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Leave Overview Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Leave request data previously submitted by users will be recorded by the system and displayed on the "Leave" page.</p>
                                        <p className='bg-blue-50 p-2 rounded-lg'>The "Leave" page can be accessed from the navigation menu on the left.</p>
                                        <p>The leave request data displayed in the table includes:</p>
                                        <div className="bg-purple-50 p-2 sm:p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <TabsContent value="add_leave" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Add Leave Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Users can submit leave requests to the admin using the "Add Leave" feature. This feature is available on the "Leave" menu.</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Add Leave Steps:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Go to the "Leave" page.</li>
                                            <li>Above the table, there is an "Add Leave" button.</li>
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
                                <TabsContent value="edit_leave" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Edit Leave Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>The system allows users to modify leave request data if there are errors when filling out the form. As long as the request status is "Pending", users can still edit their leave request data.</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Edit Leave Steps:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Go to the "Leave" page.</li>
                                            <li>In the table, there is an edit button (pencil icon) for each request.</li>
                                            <li>Click this button to display the edit Leave form.</li>
                                            <li>In this form, users can modify the request data as desired.</li>
                                            <li>Click the "Save" button to save changes.</li>
                                            <li>The system will record the new request data and display it in the table.</li>
                                          </ol>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                <TabsContent value="delete_leave" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Delete Leave Guide</CardTitle>
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
                                <TabsContent value="leave_details" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Leave Details Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Users can view leave request details by clicking the eye icon button in the table.</p>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Leave Details:</h4>
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
                        </div>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
            </TabsContent>

            {/* Letter Management Menu */}
            <TabsContent value="letter">
              <Card className="w-full p-4 sm:p-6">
                <CardTitle className="mb-4 sm:mb-6 text-lg sm:text-xl">Letter Overview Guide</CardTitle>
                <Tabs defaultValue="letter_list" className="w-full">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-full sm:w-64 flex-shrink-0 mb-2 sm:mb-0">
                      <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                        <TabsList className="flex flex-row sm:flex-col h-auto w-full bg-transparent p-0 space-y-0 sm:space-y-1 space-x-1 sm:space-x-0">
                          <TabsTrigger
                            value="letter_list"
                            className="w-full justify-start text-left p-2 sm:p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium text-xs sm:text-base"
                          >
                            Letter List
                          </TabsTrigger>
                          <TabsTrigger
                            value="letter_details"
                            className="w-full justify-start text-left p-2 sm:p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium text-xs sm:text-base"
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
                            <CardTitle className="text-base sm:text-lg">Letter List Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Users can view letters entered into the system by the admin. Letter data can only be viewed by the intended user, and users can download the letter file. Letter data is displayed on the "Letters" page in table form.</p>
                              <p className='bg-blue-50 p-2 rounded-lg'>The "Letters" page can be accessed from the navigation menu on the left.</p>
                              <p>The letter data displayed in the table includes:</p>
                              <div className='bg-purple-50 p-2 sm:p-4 rounded-lg'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                    <li>Letter Name</li>
                                    <li>Employee Name</li>
                                    <li>Letter Type</li>
                                  </ul>
                                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
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
                            <CardTitle className="text-base sm:text-lg">Letter Details Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>Users can view letter details by clicking the eye icon button in the table.</p>
                              <p>The letter details displayed include:</p>
                              <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                    <li>Status (Active/Inactive)</li>
                                    <li>Letter Name</li>
                                    <li>Letter Type</li>
                                  </ul>
                                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
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