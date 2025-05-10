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

const data = {
  user: {
    name: 'Employee',
    email: 'employee@hris.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

const checkclocks = [
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

        <div className="flex flex-1 flex-col gap-4 p-10 pt-5">
          <div className="border border-gray-300 rounded-md p-4">
            {/* Title and Search */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">Check Clock Overview</div>
              <div className="relative w-96 hidden lg:block">
                <IoMdSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                <Input type="search" placeholder="Search" className="pl-10" />
              </div>
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                <Button className="bg-gray-100 text-black shadow-xs hover:bg-gray-200">
                  <VscSettings /> Filter
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
                                <SelectItem value="ontime">On Time</SelectItem>
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
                          <MapPicker onLocationSelect={handleLocationSelect} />

                          <Label htmlFor="addressDetail">Address Detail</Label>
                          <div className="mt-2">
                            <Input
                              id="addressDetail"
                              type="text"
                              placeholder="Enter address detail"
                              value={addressDetail}
                              onChange={(e) => setAddressDetail(e.target.value)}
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

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkclocks.map((checkclock) => (
                  <TableRow key={checkclock.id}>
                    <TableCell>{checkclock.date}</TableCell>
                    <TableCell>{checkclock.clockin}</TableCell>
                    <TableCell>{checkclock.clockout}</TableCell>
                    <TableCell>{checkclock.workhours}</TableCell>
                    <TableCell>
                      <div>
                        <span
                          className={`px-2 py-1 rounded text-xs text-white 
                                ${checkclock.status === 'On Time' ? 'bg-green-600' : ''}
                                ${checkclock.status === 'Late' ? 'bg-yellow-600' : ''}
                                ${checkclock.status === 'Absent' ? 'bg-red-600' : ''}
                                `}
                        >
                          {checkclock.status}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{checkclocks.length}</span> of{' '}
                <span className="font-medium">{checkclocks.length}</span>{' '}
                results
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  disabled
                >
                  &lt;
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300">
                  1
                </button>
                <button
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  disabled
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
