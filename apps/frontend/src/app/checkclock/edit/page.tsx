import { AppSidebar } from '@/components/app-sidebar';
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
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { IoMdSearch } from 'react-icons/io';

const data = {
  user: {
    name: 'Employee',
    email: 'employee@hris.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

const users = [
  {
    id: 1,
    date: '20 March 2025',
    clockin: '09.00',
    clockout: '17.00',
    workhours: 8,
    status: 'On Time',
  },
  {
    id: 2,
    date: '20 March 2025',
    clockin: '09.00',
    clockout: '17.00',
    workhours: 8,
    status: 'On Time',
  },
];

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
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
                  <BreadcrumbPage>Check Clock</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-80 hidden lg:block">
              <IoMdSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <Input type="search" placeholder="Search" className="pl-10" />
            </div>

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
            <NavUser user={data.user} />
          </div>
        </header>
        <div className="p-4">
          <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle>Edit Check Clock</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="mb-4">
                  <Label htmlFor="letterName">Letter Name</Label>
                  <Input
                    id="letterName"
                    type="text"
                    placeholder="Enter letter name"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="letterType">Letter Type</Label>
                  <Input
                    id="letterType"
                    type="text"
                    placeholder="Enter letter type"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="letterDescription">Letter Description</Label>
                  <Input
                    id="letterDescription"
                    type="text"
                    placeholder="Enter letter description"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="letterStatus">Letter Status</Label>
                  <Input
                    id="letterStatus"
                    type="text"
                    placeholder="Enter letter status"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input id="validUntil" type="date" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" className="w-20" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="w-20">
                    Submit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
