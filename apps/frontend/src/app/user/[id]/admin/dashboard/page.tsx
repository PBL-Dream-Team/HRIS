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
import { Bell, UserCheck } from 'lucide-react';
import { NavUser } from '@/components/nav-user';

import { User, 
  UserPlus, 
  UserRoundCheck, 
  UserMinus 
} from 'lucide-react';

import { Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
 } from '@/components/ui/card';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

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
                  <BreadcrumbPage>Employee Database</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <Input
              type="search"
              placeholder="Search"
              className="hidden lg:block w-80"
            />

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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4 sm:grid-cols-2">
            <Card className='@container/card bg-[#1E3A5F] text-white'>
              <CardHeader className='relative'>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <User className="h-8 w-8" />
                    <h1 className='text-xl'>Total Employee</h1>
                  </div>
                </CardTitle>
                <CardDescription className='text-white text-5xl font-semibold'>
                  24
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div>
                  Update: March 16, 2025
                </div>
              </CardFooter>
            </Card>
            <Card className='@container/card bg-[#1E3A5F] text-white'>
              <CardHeader className='relative'>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-8 w-8" />
                    <h1 className='text-xl'>New Employee</h1>
                  </div>
                </CardTitle>
                <CardDescription className='text-white text-5xl font-semibold'>
                  24
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div>
                  Update: March 16, 2025
                </div>
              </CardFooter>
            </Card>
            <Card className='@container/card bg-[#1E3A5F] text-white'>
              <CardHeader className='relative'>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-8 w-8" />
                    <h1 className='text-xl'>Active Employee</h1>
                  </div>
                </CardTitle>
                <CardDescription className='text-white text-5xl font-semibold'>
                  24
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div>
                  Update: March 16, 2025
                </div>
              </CardFooter>
            </Card>
            <Card className='@container/card bg-[#1E3A5F] text-white'>
              <CardHeader className='relative'>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <UserMinus className="h-8 w-8" />
                    <h1 className='text-xl'>Resigned Employee</h1>
                  </div>
                </CardTitle>
                <CardDescription className='text-white text-5xl font-semibold'>
                  24
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div>
                  Update: March 16, 2025
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
