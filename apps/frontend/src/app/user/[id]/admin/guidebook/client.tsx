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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="employee">Employee Database</TabsTrigger>
              <TabsTrigger value="checkclock">CheckClock</TabsTrigger>
              <TabsTrigger value="letter">Letter Management</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            <TabsContent value="subscription">
              <Card className="w-full">
                <CardTitle>Subscription Guide</CardTitle>
              </Card>
            </TabsContent>
            <TabsContent value="dashboard">
              <Card className="w-full">
                <CardTitle>Dashboard Guide</CardTitle>
              </Card>
            </TabsContent>
            <TabsContent value="employee">
              <Card className="w-full">
                <CardTitle>Employee Database Guide</CardTitle>
              </Card>
            </TabsContent>
            <TabsContent value="checkclock">
              <Card className="w-full">
                <CardTitle>Checkclock Guide</CardTitle>
              </Card>
            </TabsContent>
            <TabsContent value="letter">
              <Card className="w-full">
                <CardTitle>Letter Management Guide</CardTitle>
              </Card>
            </TabsContent>
            <TabsContent value="profile">
              <Card className="w-full">
                <CardTitle>Profile Guide</CardTitle>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
