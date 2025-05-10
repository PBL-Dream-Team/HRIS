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

import { User, UserPlus, UserRoundCheck, UserMinus } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Switch } from '@/components/ui/switch';
import {
  Pencil,
  Trash2,
  Eye,
  Filter,
  Import,
  Download,
  Plus,
} from 'lucide-react';
import { EmployeeForm } from '@/components/EmployeeForm';

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
          <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h2 className="text-2xl font-bold">$1,250.00</h2>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">New Customers</p>
                <h2 className="text-2xl font-bold">320</h2>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Orders Completed
                </p>
                <h2 className="text-2xl font-bold">842</h2>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Refund Requests</p>
                <h2 className="text-2xl font-bold">17</h2>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 rounded-xl border bg-card text-card-foreground shadow">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold">
                All Employees Information
              </h2>
              <div className="flex flex-col w-full gap-2 md:flex-row md:items-center md:gap-2 md:w-auto">
                {/* Search Input */}
                <Input
                  placeholder="Search"
                  className="w-full md:w-auto max-w-full md:max-w-xs"
                />

                {/* Buttons */}
                <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-2">
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="h-4 w-4 mr-1" /> Filter
                  </Button>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Import className="h-4 w-4 mr-1" /> Import
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-1" /> Tambah Data
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Employee</DialogTitle>
                      </DialogHeader>
                      <EmployeeForm />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">No</TableHead>
                  <TableHead className="text-white">Avatar</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Gender</TableHead>
                  <TableHead className="text-white">Mobile Number</TableHead>
                  <TableHead className="text-white">Branch</TableHead>
                  <TableHead className="text-white">Position</TableHead>
                  <TableHead className="text-white">Grade</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Action Button</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>1</TableCell>
                    <TableCell>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src="/avatars/shadcn.jpg" alt="shadcn" />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>John doel asdw</TableCell>
                    <TableCell>Male</TableCell>
                    <TableCell>081221211122</TableCell>
                    <TableCell>Jakarta</TableCell>
                    <TableCell>Head Of HR</TableCell>
                    <TableCell>Management</TableCell>
                    <TableCell>
                      <Switch defaultChecked />
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Employee</DialogTitle>
                          </DialogHeader>
                          <EmployeeForm />
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground flex-wrap gap-2">
              {/* Info text */}
              <div>Showing 1 to 1 of 1 results</div>

              {/* Page controls */}
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="rounded-md">
                  {'<'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-md bg-muted text-foreground"
                >
                  1
                </Button>
                <Button variant="outline" size="icon" className="rounded-md">
                  {'>'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
