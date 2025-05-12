'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Bell, Check, Filter, Plus, X } from 'lucide-react';
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { VscSettings } from 'react-icons/vsc';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { MdImage } from 'react-icons/md';

import MapPicker from '@/components/map-picker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const data = {
  user: {
    name: 'Employee',
    email: 'employee@hris.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLat(lat.toFixed(6));
    setLng(lng.toFixed(6));
    setAddressDetail(address);
  };

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
          <div className="p-4 rounded-xl border bg-card text-card-foreground shadow">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold">Checkclock Overview</h2>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <IoMdAdd /> Add Check Clock
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Add Check Clock</DialogTitle>
                      </DialogHeader>
                      <form>
                        <div className="flex flex-col md:flex-row gap-x-6">
                          {/* Left Form*/}
                          <div className="w-full md:w-1/2 mb-4 md:mb-0 space-y-4">
                            <Label htmlFor="letterType">Absence Type</Label>
                            <div className="mt-2">
                              <Select>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="-Choose Absence Type-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="absent">Absent</SelectItem>
                                  <SelectItem value="ontime">
                                    On Time
                                  </SelectItem>
                                  <SelectItem value="late">Late</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Label htmlFor="letterPicture">
                              Upload Evidence Picture
                            </Label>
                            <div className="mt-2 relative w-full aspect-[20/19] border rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition cursor-pointer">
                              {previewUrl ? (
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <span className="flex flex-col items-center justify-center text-black text-sm">
                                  <MdImage className="text-3xl text-[#1E3A5F] mb-1" />
                                  Click to upload
                                </span>
                              )}
                              <Input
                                id="letterPicture"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute opacity-0 w-full h-full cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Form Right */}
                          <div className="w-full md:w-1/2 space-y-4">
                            <Label htmlFor="location">Work Location</Label>
                            <div className="mt-2">
                              <Select>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="-Choose Location-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="WFO">WFO</SelectItem>
                                  <SelectItem value="WFH">WFH</SelectItem>
                                  <SelectItem value="WFA">WFA</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <MapPicker
                              onLocationSelect={handleLocationSelect}
                            />

                            <Label htmlFor="addressDetail">
                              Address Detail
                            </Label>
                            <div className="mt-2">
                              <Input
                                id="addressDetail"
                                type="text"
                                placeholder="Enter address detail"
                                value={addressDetail}
                                onChange={(e) =>
                                  setAddressDetail(e.target.value)
                                }
                              />
                            </div>
                            <div className="flex flex-col md:flex-row gap-x-6">
                              <div className="w-full md:w-1/2 space-y-4">
                                <Label htmlFor="lat">Lat</Label>
                                <div className="mt-2">
                                  <Input
                                    id="lat"
                                    type="text"
                                    value={lat}
                                    onChange={(e) => setLat(e.target.value)}
                                    readOnly
                                    className="bg-gray-100"
                                  />
                                </div>
                              </div>
                              <div className="w-full md:w-1/2 space-y-4">
                                <Label htmlFor="long">Long</Label>
                                <div className="mt-2">
                                  <Input
                                    id="long"
                                    type="text"
                                    value={lng}
                                    onChange={(e) => setLng(e.target.value)}
                                    readOnly
                                    className="bg-gray-100"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <DialogFooter className="gap-2 sm:justify-end mt-4">
                          <Button type="submit" className="w-20">
                            Submit
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Approve</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    name: 'Alice Johnson',
                    position: 'Software Engineer',
                    clockIn: '08:00',
                    clockOut: '16:00',
                    workHours: '8h',
                    status: 'Waiting Approval',
                  },
                  {
                    name: 'Michael Chen',
                    position: 'Project Manager',
                    clockIn: '08:15',
                    clockOut: '16:30',
                    workHours: '8h 15m',
                    status: 'Waiting Approval',
                  },
                  {
                    name: 'Nina Patel',
                    position: 'UI/UX Designer',
                    clockIn: '08:00',
                    clockOut: '17:00',
                    workHours: '9h',
                    status: 'On Time',
                  },
                  {
                    name: 'David Lee',
                    position: 'DevOps Engineer',
                    clockIn: '09:20',
                    clockOut: '18:00',
                    workHours: '8h 40m',
                    status: 'Late',
                  },
                  {
                    name: 'Sarah Kim',
                    position: 'HR Staff',
                    clockIn: '-',
                    clockOut: '-',
                    workHours: '0h',
                    status: 'Absent/Leave',
                  },
                ].map((employee, i) => {
                  let approveContent;

                  switch (employee.status) {
                    case 'Waiting Approval':
                      approveContent = (
                        <div className="flex gap-1">
                          <Button size="icon" variant="outline">
                            <Check className="text-green-600 w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="outline">
                            <X className="text-red-600 w-4 h-4" />
                          </Button>
                        </div>
                      );
                      break;
                    case 'On Time':
                      approveContent = (
                        <span className="h-2 w-2 rounded-full bg-green-600 inline-block" />
                      );
                      break;
                    case 'Late':
                      approveContent = (
                        <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" />
                      );
                      break;
                    case 'Absent/Leave':
                      approveContent = (
                        <span className="h-2 w-2 rounded-full bg-red-600 inline-block" />
                      );
                      break;
                  }

                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <Avatar className="h-8 w-8 rounded-full">
                          <AvatarImage src="/avatars/user.jpg" alt="avatar" />
                          <AvatarFallback>
                            {employee.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.clockIn}</TableCell>
                      <TableCell>{employee.clockOut}</TableCell>
                      <TableCell>{employee.workHours}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center">
                          {approveContent}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-black">{employee.status}</span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
