'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Input } from '@/components/ui/input';
import { Bell, Upload, CreditCardIcon, CalendarIcon, Pencil } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { AdminForm } from '@/components/admin-form';

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

import { 
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { IoMdSearch } from 'react-icons/io';

const data = {
    user: {
        name: 'Admin',
        email: 'admin@hris.com',
        avatar: '/avatars/shadcn.jpg',
    },
};

export default function Page() {
    const [avatar, setAvatar] = useState<File | null>(null);
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
                                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
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

                {/* Content */}
                <div className="flex flex-col md:flex-row gap-4 p-4 relative">
                    
                    {/* Profile Data */}
                    <form className="w-full h-fit md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 border-2 p-4 bg-white rounded-lg shadow">
                        <div className="col-span-full flex items-center gap-4">
                            <Avatar className='w-25 h-25'>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
                            <Label>Email</Label>
                            <Input placeholder="Your email" readOnly />
                        </div>
                        <div>
                            <Label>Mobile Phone</Label>
                            <Input placeholder="Your Mobile Phone" readOnly />
                        </div>
                        <div className="col-span-full">
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
                                    <AdminForm />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </form>

                    {/* Subscription Data */}
                    <div className="w-full h-fit md:w-1/3 gap-4 border-2 p-4 bg-white rounded-lg shadow">
                        <h1 className="text-lg font-semibold mb-2">Subscription Information</h1>
                        <Card>
                            <CardHeader className='pb-2'>
                                <p className='text-sm'>Joined on 31 December 2025</p>
                                <CardTitle className='text-xl'>
                                    Pay As You Go
                                </CardTitle>
                                <div className='flex items-center gap-2'>
                                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                    <p className="text-muted-foreground text-xs">Next payment is on 28 January 2026</p>   
                                </div>
                                <hr className="my-2" />
                            </CardHeader>
                            <CardContent className='pt-0'>
                                <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
                                    <Button>
                                        <a href="/pricing">Manage Subscription</a>
                                    </Button>
                                    <Button variant="outline">
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <div className='flex justify-end pt-4'>
                            <Button>
                                <a href="/user/[id]/admin/subscription">Subscription History</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
