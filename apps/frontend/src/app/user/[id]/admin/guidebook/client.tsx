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
          compName: name || '',
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="employee">Employee Management</TabsTrigger>
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
                            Account Data Edit
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
                              <p>Account data information can be accessed on the "Account" page. To access the "Account" page, follow these steps:</p>
                              <ol className="list-decimal list-inside space-y-1 text-sm bg-blue-50 p-4 rounded-lg">
                                <li>Click on the account name information in the top right corner of the page.</li>
                                <li>The system will display menu options for "Account", "Subscription", and a "Log out" button.</li>
                                <li>Click the "Account" menu to navigate to the "Account" page.</li>
                              </ol>

                              <p>On the "Account" page, the system will display account information data. The displayed data is divided into three sections: "Account Information", "Subscription Information", and "Company Information".</p>
                              <p>Here is the information displayed on the "Account" page:</p>
                              <div className='grid grid-cols-3 gap-4'>
                                <div className='bg-purple-50 p-4 rounded-lg'>
                                  <h4 className="font-semibold mb-2">Account Information:</h4>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Avatar</li>
                                    <li>First Name</li>
                                    <li>Last Name</li>
                                    <li>Email</li>
                                    <li>Phone Number</li>
                                  </ul>
                                </div>
                                <div className='bg-purple-50 p-4 rounded-lg'>
                                  <h4 className="font-semibold mb-2">Subscription Information:</h4>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Joined Date</li>
                                    <li>Plan Type</li>
                                    <li>Overdue Date</li>
                                  </ul>
                                </div>
                                <div className='bg-purple-50 p-4 rounded-lg'>
                                  <h4 className="font-semibold mb-2">Company Information:</h4>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Company Name</li>
                                    <li>Company Address</li>
                                    <li>Address Map Display</li>
                                    <li>Latitude</li>
                                    <li>Longitude</li>
                                  </ul>
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
                            <CardTitle>Edit Account Data Guide</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p>All displayed account information data can be modified by the user. Here are the step-by-step instructions for modifying data for each section:</p>
                              <div className='grid grid-cols-3 gap-4'>
                                <div className='bg-yellow-50 p-4 rounded-lg'>
                                  <h4 className="font-semibold mb-2">Account Information:</h4>
                                  <ol className="list-decimal list-inside space-y-1 text-sm">
                                    <li>Go to the "Account" page.</li>
                                    <li>In the "Account Information" section, click the "Edit Profile" button.</li>
                                    <li>The system will display a form for editing data.</li>
                                    <li>In this form, users can change the desired information:</li>
                                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                      <li>Avatar Picture</li>
                                      <li>First Name</li>
                                      <li>Last Name</li>
                                      <li>Email</li>
                                      <li>Mobile Number</li>
                                    </ul>
                                    <li>Click the "Save" button to save data changes.</li>
                                  </ol>
                                </div>
                                <div className='bg-yellow-50 p-4 rounded-lg'>
                                  <h4 className="font-semibold mb-2">Subscription Information:</h4>
                                  <ol className="list-decimal list-inside space-y-1 text-sm">
                                    <li>Go to the "Account" page.</li>
                                    <li>In the "Subscription Information" section, click the "Change Subscription" button.</li>
                                    <li>The system will display plan options that users can choose from.</li>
                                    <li>Select a plan and make payment.</li>
                                    <li>After successful payment, the system will update the information in "Subscription Information".</li>
                                  </ol>
                                </div>
                                <div className='bg-yellow-50 p-4 rounded-lg'>
                                  <h4 className="font-semibold mb-2">Company Information:</h4>
                                  <ol className="list-decimal list-inside space-y-1 text-sm">
                                    <li>Go to the "Account" page.</li>
                                    <li>In the "Company Information" section, click the "Edit Data" button.</li>
                                    <li>The system will display a form for editing data.</li>
                                    <li>In this form, users can change the desired information:</li>
                                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                      <li>Company Name</li>
                                      <li>Company Address</li>
                                    </ul>
                                    <li>Click the "Save" button to save data changes.</li>
                                  </ol>
                                </div>
                              </div>
                              <p>Users can also change their account password by following these steps:</p>
                              <div className='bg-yellow-50 p-4 rounded-lg'>
                                <h4>Change Password:</h4>
                                <ol className="list-decimal list-inside space-y-1 text-sm">
                                  <li>Go to the "Account" page.</li>
                                  <li>In the "Account Information" section, click the "Change Password" button.</li>
                                  <li>The system will display a form for changing the password.</li>
                                  <li>Enter the old password, new password, and confirm the new password.</li>
                                  <li>Click the "Save" button to save the changes.</li>
                                  <li>The system will automatically change the account password.</li>
                                </ol>
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
                              <p>On the "Employee Database" page, there is a table showing the list of employees in the company. To access the "Employee Database" page, follow these steps:</p>
                              <p className="bg-blue-50 p-3 rounded-lg">The "Employee Database" page can be accessed by clicking the "Employee" menu in the left navigation menu.</p>
                              <p>The employee data information displayed in the table includes:</p>
                              <div className="bg-purple-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>Avatar</li>
                                  <li>Name</li>
                                  <li>Gender</li>
                                  <li>Mobile Number</li>
                                </ul>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>Branch</li>
                                  <li>Position</li>
                                  <li>Actions</li>
                                </ul>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Additional Features:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>Search functionality - search employees by name</li>
                                  <li>Pagination - display data with page system</li>
                                  <li>Export data - download employee data in CSV format</li>
                                  <li>Import data - upload employee data from CSV file</li>
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
                              <p>To add a new employee to the system, you can do so manually through the provided form.</p>
                              <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Steps to add an employee:</h4>
                                <ol className="list-decimal list-inside space-y-1 text-sm">
                                  <li>Go to the "Employee Database" page</li>
                                  <li>Click the "Add Employee" button located in the top right corner of the page.</li>
                                  <li>The system will display a form to add a new employee.</li>
                                  <li>Fill in the required data according to the following sections:
                                    <div className="ml-4 mt-2 space-y-2">
                                      <div className="bg-purple-50 p-3 rounded border">
                                        <h5 className="font-medium mb-1">Avatar & Personal Information:</h5>
                                        <ul className="list-disc list-inside text-xs space-y-1">
                                          <li>Upload Avatar (optional)</li>
                                          <li>First Name</li>
                                          <li>Last Name</li>
                                          <li>Gender (dropdown)</li>
                                          <li>Date of Birth</li>
                                          <li>Birth Place</li>
                                          <li>NIK (National ID Number)</li>
                                          <li>Last Education (dropdown)</li>
                                        </ul>
                                      </div>
                                      <div className="bg-purple-50 p-3 rounded border">
                                        <h5 className="font-medium mb-1">Contact Information:</h5>
                                        <ul className="list-disc list-inside text-xs space-y-1">
                                          <li>Address</li>
                                          <li>Email</li>
                                          <li>Password</li>
                                          <li>Phone Number</li>
                                        </ul>
                                      </div>
                                      <div className="bg-purple-50 p-3 rounded border">
                                        <h5 className="font-medium mb-1">Employment Details:</h5>
                                        <ul className="list-disc list-inside text-xs space-y-1">
                                          <li>Work Scheme (dropdown)</li>
                                          <li>Position</li>
                                          <li>Branch</li>
                                          <li>Contract (dropdown)</li>
                                        </ul>
                                      </div>
                                      <div className="bg-purple-50 p-3 rounded border">
                                        <h5 className="font-medium mb-1">Bank Information:</h5>
                                        <ul className="list-disc list-inside text-xs space-y-1">
                                          <li>Bank (dropdown)</li>
                                          <li>Account Number</li>
                                          <li>Account Name</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </li>
                                  <li>Click the "Add" button to save the employee data.</li>
                                  <li>The system will automatically display the new employee data in the table.</li>
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
                              <p>Users can modify employee information data if there are errors during data input or other reasons. To edit employee information data, users can click the button with the "Pencil" icon in the "Actions" column.</p>
                              <p>For more details, follow these steps:</p>
                              <div className="bg-yellow-50 p-4 rounded-lg">
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>Go to the "Employee Database" page</li>
                                  <li>In the table, there is a button with a "Pencil" icon in the "Actions" column.</li>
                                  <li>Click that button to display the employee data edit form.</li>
                                  <li>In this form, users can modify the desired employee data:
                                    <div className="ml-4 mt-2 space-y-2">
                                      <div className="bg-purple-50 p-3 rounded border">
                                        <h5 className="font-medium mb-1">Avatar & Personal Information:</h5>
                                        <ul className="list-disc list-inside text-xs space-y-1">
                                          <li>Upload Avatar (optional)</li>
                                          <li>First Name</li>
                                          <li>Last Name</li>
                                          <li>Gender (dropdown)</li>
                                          <li>Date of Birth</li>
                                          <li>Birth Place</li>
                                          <li>NIK (National ID Number)</li>
                                          <li>Last Education (dropdown)</li>
                                        </ul>
                                      </div>
                                      <div className="bg-purple-50 p-3 rounded border">
                                        <h5 className="font-medium mb-1">Contact Information:</h5>
                                        <ul className="list-disc list-inside text-xs space-y-1">
                                          <li>Address</li>
                                          <li>Email</li>
                                          <li>Password</li>
                                          <li>Phone Number</li>
                                        </ul>
                                      </div>
                                      <div className="bg-purple-50 p-3 rounded border">
                                        <h5 className="font-medium mb-1">Employment Details:</h5>
                                        <ul className="list-disc list-inside text-xs space-y-1">
                                          <li>Work Scheme (dropdown)</li>
                                          <li>Position</li>
                                          <li>Branch</li>
                                          <li>Contract (dropdown)</li>
                                        </ul>
                                      </div>
                                      <div className="bg-purple-50 p-3 rounded border">
                                        <h5 className="font-medium mb-1">Bank Information:</h5>
                                        <ul className="list-disc list-inside text-xs space-y-1">
                                          <li>Bank (dropdown)</li>
                                          <li>Account Number</li>
                                          <li>Account Name</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </li>
                                  <li>Click the "Update" button to save the changes.</li>
                                  <li>The system will automatically display the updated data.</li>
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
                              <p>Employee data that is no longer active or no longer working at the company can be deleted from the system. To delete employee data, you can click the button with the "Trashcan" icon in the "Actions" column.</p>
                              <div className="bg-red-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Steps to delete an employee:</h4>
                                <ol className="list-decimal list-inside space-y-1 text-sm mb-3">
                                  <li>Go to the "Employee Database" page</li>
                                  <li>In the table, there is a button with a "Trashcan" icon in the "Actions" column.</li>
                                  <li>Click that button to delete the employee data.</li>
                                  <li>The system will ask for deletion confirmation.</li>
                                  <li>Confirm the deletion to complete the process.</li>
                                </ol>
                                <h4 className="font-semibold mb-2">Important Notes:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>Make sure the employee data you want to delete corresponds to the employee who is no longer active.</li>
                                  <li>If you accidentally delete data, users can restore the data by manually adding the data again.</li>
                                  <li>Deleted data cannot be automatically restored.</li>
                                  <li>Consider changing the employee's status to "Inactive" instead of deleting the data.</li>
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
                              <p>Not all employee data information is displayed in the table. To view detailed employee data information, users can click the button with the "Eye" icon in the "Actions" column.</p>
                              <p>Here are the detailed information displayed:</p>
                              <div className='grid grid-cols-4 gap-4'>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">Personal Information:</h4>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Gender</li>
                                    <li>Last Education</li>
                                    <li>Birth Date</li>
                                    <li>Birth Place</li>
                                    <li>NIK (National ID Number)</li>
                                  </ul>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">Contact Information:</h4>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Email</li>
                                    <li>Phone Number</li>
                                    <li>Address</li>
                                  </ul>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">Employment Details:</h4>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Work Scheme</li>
                                    <li>Contract</li>
                                    <li>Position</li>
                                    <li>Branch</li>
                                  </ul>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-2">Bank Information:</h4>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Bank</li>
                                    <li>Account Number</li>
                                    <li>Account Name</li>
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
                                <TabsContent value="attendance_overview" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Attendance Overview Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>The "Checkclock" page contains a table listing employee attendance and working hours. To access the "Checkclock" page, follow these steps:</p>
                                        <p className='bg-blue-50 p-2 rounded-lg'>The "Checkclock" page can be accessed by clicking the "Checkclock" menu in the left navigation menu.</p>
                                        <p>The attendance data information displayed in the table includes:</p>
                                        <div className="bg-purple-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Avatar</li>
                                            <li>Employee Name</li>
                                            <li>Position</li>
                                            <li>Date</li>
                                          </ul>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Clock In</li>
                                            <li>Clock Out</li>
                                            <li>Work Hours</li>
                                            <li>Approve</li>
                                            <li>Status</li>
                                            <li>Actions</li>
                                          </ul>
                                        </div>
                                        <div className="bg-amber-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Attendance Status:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li><span className="text-green-600 font-medium">On Time</span> - Employee arrives on time according to workscheme</li>
                                            <li><span className="text-red-600 font-medium">Late</span> - Employee arrives late from the time set in workscheme</li>
                                            <li><span className="text-blue-600 font-medium">Early</span> - Employee arrives earlier than the time set in workscheme</li>
                                          </ul>
                                          <p className="text-sm mt-2 text-gray-600">*Status is determined based on comparison of clock in time with the time set in each employee's workscheme</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Approval Status:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li><span className="text-green-600 font-medium">Approved</span> - Attendance has been approved</li>
                                            <li><span className="text-red-600 font-medium">Disapproved</span> - Attendance is not approved</li>
                                            <li><span className="text-yellow-600 font-medium">Pending</span> - Attendance awaiting approval (marked with ✓ and ✗ buttons)</li>
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
                                        <p>To view complete details of employee attendance, users can click the "Eye" icon button in the "Actions" column. This detail will display complete information about employee attendance including clock in/out location.</p>
                                        <p>The following is detailed information displayed in the "Attendance Details" popup:</p>
                                        <div className='grid grid-cols-2 gap-4'>
                                          <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2">Employee Information:</h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                              <li>Avatar</li>
                                              <li>Employee Name</li>
                                              <li>Position</li>
                                              <li>Status (Late/On Time/Early)</li>
                                            </ul>
                                          </div>
                                          <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2">Attendance Information:</h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                              <li>Date</li>
                                              <li>Work Hours</li>
                                              <li>Clock In Time</li>
                                              <li>Clock Out Time</li>
                                            </ul>
                                          </div>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Location Information:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li><strong>Location:</strong> Displays clock in location (example: Outside Office (WFO))</li>
                                            <li><strong>Detail Address:</strong> Complete address of clock in location</li>
                                            <li><strong>Lat (Latitude):</strong> Latitude coordinates of location</li>
                                            <li><strong>Long (Longitude):</strong> Longitude coordinates of location</li>
                                          </ul>
                                          <p className="text-sm mt-2 text-gray-600">*Location information helps verify whether employees clock in from the appropriate location</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Action Buttons for Pending Status:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li><span className="text-green-600 font-medium">Approve Button (✓)</span> - To approve attendance</li>
                                            <li><span className="text-red-600 font-medium">Disapprove Button (✗)</span> - To disapprove attendance</li>
                                          </ul>
                                          <p className="text-sm mt-2 text-gray-600">*Action buttons only appear for attendance with "Pending" status</p>
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
                          <Tabs defaultValue="workscheme_overview" className="w-full">
                            <div className="flex gap-6">
                              {/* Sidebar Navigation */}
                              <div className="w-64 flex-shrink-0">
                                <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                                  <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                                    <TabsTrigger
                                      value="workscheme_overview"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Workscheme Overview
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
                                {/* Workscheme Overview */}
                                <TabsContent value="workscheme_overview" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Workscheme Overview Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>In addition to employee attendance features, the system also provides workscheme features that are useful for managing employee workplaces.</p>
                                        <p>To access this feature, follow these steps:</p>
                                        <div className='bg-blue-50 p-2 rounded-lg'>
                                          <ol className='list-decimal list-inside space-y-1 text-sm'>
                                            <li>Click the "Checkclock" menu in the left navigation menu.</li>
                                            <li>There is a "Workscheme Overview" button located above the employee attendance list table.</li>
                                            <li>Click that button to display a form containing workscheme data list.</li>
                                          </ol>
                                        </div>
                                        <p>The system provides default workschemes that can be used by users, including Work From Office, Work From Home, and Hybrid.</p>
                                        <p>The contents of the workscheme itself are as follows:</p>
                                        <div className="bg-purple-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Workscheme Name</li>
                                            <li>Clock In Time</li>
                                            <li>Clock Out Time</li>
                                          </ul>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Workscheme Address</li>
                                            <li>Coordinate Location</li>
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
                                        <p>Users can add new workschemes in addition to the default workschemes provided. Follow these steps to add a new workscheme:</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Go to the "Checkclock" page.</li>
                                            <li>There is an "Add Workscheme" button located above the employee attendance list table.</li>
                                            <li>Click that button to display the "Add Workscheme" form.</li>
                                            <li>Fill in the required data:</li>
                                            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                              <li>Workscheme Location (Optional)</li>
                                              <li>Workscheme Address</li>
                                              <li>Workscheme Name</li>
                                              <li>Clock In Time</li>
                                              <li>Clock Out Time</li>
                                            </ul>
                                            <li>Click the "Submit" button to save data to the system.</li>
                                          </ol>
                                        </div>
                                        <p>New workscheme data will be given a "Custom" label in the "Workscheme Overview" form.</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Edit Workscheme */}
                                <TabsContent value="edit_workscheme" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Edit Workscheme Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Users can edit workscheme data if there are errors during data input. All workscheme data can be edited, both default and custom workschemes.</p>
                                        <p>Follow these steps to edit workscheme data:</p>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                          <ul className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Go to the "Checkclock" page.</li>
                                            <li>There is a "Workscheme Overview" button located above the employee attendance list table.</li>
                                            <li>Click that button to display a form containing workscheme data list.</li>
                                            <li>In the table there is a button with a "Pencil" icon in the "Actions" column.</li>
                                            <li>Click that button to display the workscheme data edit form.</li>
                                            <li>In this form, users can change the desired workscheme data:</li>
                                            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                              <li>Workscheme Location (Optional)</li>
                                              <li>Workscheme Address</li>
                                              <li>Workscheme Name</li>
                                              <li>Clock In Time</li>
                                              <li>Clock Out Time</li>
                                            </ul>
                                            <li>Click the "Save" button to save changes.</li>
                                            <li>The system will automatically display the changed data.</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                {/* Delete Workscheme */}
                                <TabsContent value="delete_workscheme" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Delete Workscheme Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Unused workschemes can be deleted by users if desired. To delete workscheme data can be done in the "Workscheme Overview" form. Users can delete data by clicking the button with the "Trashcan" icon in the "Actions" column.</p>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Steps to delete workscheme:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm mb-3">
                                            <li>Go to the "Checkclock" page.</li>
                                            <li>There is a "Workscheme Overview" button located above the employee attendance list table.</li>
                                            <li>Click that button to display a form containing workscheme data list table.</li>
                                            <li>In the table there is a button with a "Trashcan" icon in the "Actions" column.</li>
                                            <li>Click that button to delete workscheme data.</li>
                                            <li>The system will ask for deletion confirmation.</li>
                                            <li>Confirm deletion to complete the process.</li>
                                          </ol>
                                          <h4 className="font-semibold mb-2">Important Notes:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Workschemes that are still being used by employees cannot be deleted.</li>
                                            <li>Make sure the workscheme data you want to delete matches the unused workscheme data</li>
                                            <li>If you accidentally delete data, users can restore data by adding data manually.</li>
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
                                        <p>The "Absence Overview" page contains a table listing leave/permit requests from employees. To access the "Absence Overview" page, follow these steps:</p>
                                        <p className='bg-blue-50 p-2 rounded-lg'>The "Absence Overview" page can be accessed by clicking the "Absence" menu in the left navigation menu.</p>
                                        <p>The absence data information displayed in the table includes:</p>
                                        <div className="bg-purple-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Avatar</li>
                                            <li>Employee Name</li>
                                            <li>Position</li>
                                            <li>Created At (Time)</li>
                                          </ul>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>On Date</li>
                                            <li>Reason</li>
                                            <li>Status (Pending/Approved/Rejected)</li>
                                            <li>Actions</li>
                                          </ul>
                                        </div>
                                        <div className="bg-amber-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Request Status:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li><span className="text-green-600 font-medium">Approved</span> - Request has been approved</li>
                                            <li><span className="text-red-600 font-medium">Rejected</span> - Request is rejected</li>
                                            <li><span className="text-yellow-600 font-medium">Pending</span> - Request awaiting approval</li>
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
                                        <p>To view complete details of employee leave/permit requests, users can click the "Eye" icon button in the "Actions" column. This detail will display complete information about absence requests.</p>
                                        <p>The following is detailed information displayed in the "Absence Details" popup:</p>
                                        <div className='grid grid-cols-2 gap-4'>
                                          <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2">Employee Information:</h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                              <li>Avatar</li>
                                              <li>Employee Name</li>
                                              <li>Position</li>
                                              <li>Status (Pending/Approved/Rejected)</li>
                                            </ul>
                                          </div>
                                          <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2">Absence Information:</h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                              <li>Created At (Time)</li>
                                              <li>Date</li>
                                              <li>Type (Sick/Permit/Leave)</li>
                                              <li>Reason</li>
                                            </ul>
                                          </div>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Evidence Picture:</h4>
                                          <p className="text-sm">This section displays evidence images attached by employees as supporting documentation for their leave/permit requests.</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Action Buttons for Pending Status:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li><span className="text-green-600 font-medium">Approve Button (✓)</span> - To approve the request</li>
                                            <li><span className="text-red-600 font-medium">Reject Button (✗)</span> - To reject the request</li>
                                          </ul>
                                          <p className="text-sm mt-2 text-gray-600">*Action buttons only appear for requests with "Pending" status</p>
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
                                        <p>The "Letters" page displays a table of employee letters in the company. To access the "Letters" page:</p>
                                        <p className='bg-blue-50 p-2 rounded-lg'>The "Letters" page can be accessed by clicking the "Letters" menu in the left navigation menu.</p>
                                        <p>The letter data information displayed in the table includes:</p>
                                        <div className="bg-purple-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Letter Name</li>
                                            <li>Employee Name</li>
                                            <li>Letter Type</li>
                                          </ul>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Valid Until</li>
                                            <li>Status</li>
                                            <li>Actions</li>
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
                                        <p>To add employee letters to the system, you can manually add them through the provided form.</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Steps to add employee letters:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Go to the "Letter Overview" page</li>
                                            <li>Click the "Add Letter" button located at the top right of the page</li>
                                            <li>The system will display a form to add employee letters</li>
                                            <li>Fill in the required data:
                                              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                                <li>Employee (dropdown)</li>
                                                <li>Letter Type (dropdown)</li>
                                                <li>Letter Name</li>
                                                <li>Letter Description (optional)</li>
                                                <li>Letter File (PDF, DOC, DOCX - Max 10MB)</li>
                                                <li>Letter Status (Active/Inactive)</li>
                                                <li>Valid Until</li>
                                              </ul>
                                            </li>
                                            <li>Click the "Submit Letter" button to save the letter data</li>
                                            <li>The system will automatically display the new letter data in the table</li>
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
                                        <p>Users can update letter information if there are input errors or other reasons. To edit letter information, users can click the "Pencil" icon button in the "Actions" column.</p>
                                        <p>For more details, follow these steps:</p>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                          <ul className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Go to the "Letter Overview" page</li>
                                            <li>In the table, find the "Pencil" icon button in the "Actions" column</li>
                                            <li>Click the button to display the letter edit form</li>
                                            <li>In this form, users can update the desired letter data:
                                              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                                <li>Employee (dropdown)</li>
                                                <li>Letter Type (dropdown)</li>
                                                <li>Letter Name</li>
                                                <li>Letter Description</li>
                                                <li>Letter file (can be replaced or keep using the old file)</li>
                                                <li>Letter Status</li>
                                                <li>Valid Until</li>
                                              </ul>
                                            </li>
                                            <li>Click the "Update Letter" button to save changes</li>
                                            <li>The system will automatically display the updated data</li>
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
                                        <p>Letters that are no longer needed or have expired can be deleted from the system. To delete letter data, click the "Trashcan" icon button in the "Actions" column.</p>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Steps to delete letters:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm mb-3">
                                            <li>Go to the "Letter Overview" page</li>
                                            <li>In the table, find the "Trashcan" icon button in the "Actions" column</li>
                                            <li>Click the button to delete the letter data</li>
                                            <li>The system will request deletion confirmation</li>
                                            <li>Confirm the deletion to complete the process</li>
                                          </ol>
                                          <h4 className="font-semibold mb-2">Important Notes:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Ensure the letter data to be deleted matches letters that are no longer needed</li>
                                            <li>If data is accidentally deleted, users can restore it by manually adding the data again</li>
                                            <li>Deleted letter files cannot be recovered</li>
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
                                        <p>Not all detailed letter information is displayed in the table. To view complete letter details, users can click the "Eye" icon button in the "Actions" column.</p>
                                        <p>Here are the details displayed:</p>
                                        <div className='grid grid-cols-2 gap-4'>
                                          <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2">Employee Information:</h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                              <li>Employee Name</li>
                                              <li>Employee Status</li>
                                              <li>Employee Avatar</li>
                                            </ul>
                                          </div>
                                          <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2">Letter Information:</h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                              <li>Letter Name</li>
                                              <li>Letter Type</li>
                                              <li>Description</li>
                                              <li>Valid Until</li>
                                              <li>Status</li>
                                            </ul>
                                          </div>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">File Information:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>File Name - displays the name of the uploaded letter file</li>
                                            <li>Files can be downloaded by clicking the download button</li>
                                            <li>Files can be viewed by clicking the "Eye" icon in the file section</li>
                                          </ul>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Additional Features:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Active/inactive letter status is displayed with color indicators</li>
                                            <li>Complete information can be accessed without opening the edit form</li>
                                            <li>Detail view provides a comprehensive overview of the letter</li>
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
                          <Tabs defaultValue="letter_type_overview" className="w-full">
                            <div className="flex gap-6">
                              {/* Sidebar Navigation */}
                              <div className="w-64 flex-shrink-0">
                                <div className="flex flex-col space-y-1 bg-gray-50 p-2 rounded-lg">
                                  <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                                    <TabsTrigger
                                      value="letter_type_overview"
                                      className="w-full justify-start text-left p-3 rounded-md bg-white hover:bg-gray-100 data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white border-0 shadow-none font-medium"
                                    >
                                      Letter Type Overview
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
                                <TabsContent value="letter_type_overview" className="mt-0 h-full">
                                  <Card className="w-full h-fit">
                                    <CardHeader>
                                      <CardTitle>Letter Type Overview Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <p>Employee letter data contains "Letter type" data. This data is used to determine employee letter types based on their content.</p>
                                        <p>To view Letter Type data in the system, follow these steps:</p>
                                        <div className='bg-blue-50 p-2 rounded-lg'>
                                          <ol className='list-decimal list-inside space-y-1 text-sm'>
                                            <li>Click the "Letters" menu in the left navigation menu</li>
                                            <li>There is a "Letter Type Overview" button located above the employee letter list table</li>
                                            <li>Click the button to display a form containing the Letter Type list data</li>
                                          </ol>
                                        </div>
                                        <p>The contents of Letter Type are as follows:</p>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Letter Type Name</li>
                                            <li>Content</li>
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
                                        <p>Users can add new letter types. Follow these steps to add a new letter type:</p>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Go to the "Letters" page</li>
                                            <li>There is an "Add Letter type" button located above the employee letter list table</li>
                                            <li>Click the button to display the "Add Letter type" form</li>
                                            <li>Fill in the required data:</li>
                                            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                              <li>Letter type Name</li>
                                              <li>Content</li>
                                            </ul>
                                            <li>Click the "Submit" button to save the data to the system</li>
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
                                        <p>Users can edit letter type data if there are input errors.</p>
                                        <p>Follow these steps to edit letter type data:</p>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                          <ul className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Go to the "Letters" page</li>
                                            <li>There is a "Letter Type Overview" button located above the employee letter list table</li>
                                            <li>Click the button to display a form containing the letter type list data</li>
                                            <li>In the table, find the "Pencil" icon button in the "Actions" column</li>
                                            <li>Click the button to display the letter type edit form</li>
                                            <li>In this form, users can update the desired letter type data:</li>
                                            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                              <li>Letter Type</li>
                                              <li>Content</li>
                                            </ul>
                                            <li>Click the "Save" button to save changes</li>
                                            <li>The system will automatically display the updated data</li>
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
                                        <p>Unused letter types can be deleted if desired. To delete workscheme data, it can be done in the "Letter Type Overview" form. Users can delete data by clicking the "Trashcan" icon button in the "Actions" column.</p>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                          <h4 className="font-semibold mb-2">Steps to delete letter types:</h4>
                                          <ol className="list-decimal list-inside space-y-1 text-sm mb-3">
                                            <li>Go to the "Letters" page</li>
                                            <li>There is a "Letter type Overview" button located above the employee letter list table</li>
                                            <li>Click the button to display a form containing the letter type list data table</li>
                                            <li>In the table, find the "Trashcan" icon button in the "Actions" column</li>
                                            <li>Click the button to delete the letter type data</li>
                                            <li>The system will request deletion confirmation</li>
                                            <li>Confirm the deletion to complete the process</li>
                                          </ol>
                                          <h4 className="font-semibold mb-2">Important Notes:</h4>
                                          <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Letter Types still being used by employees cannot be deleted</li>
                                            <li>Ensure the letter type data to be deleted matches unused workscheme data</li>
                                            <li>If data is accidentally deleted, users can restore it by manually adding the data again</li>
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