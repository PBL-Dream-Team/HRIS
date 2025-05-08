"use client";
import { AppSidebar } from '@/components/app-sidebar';
import { Input } from '@/components/ui/input';
import { Bell, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { NavUser } from '@/components/nav-user';
import { Separator } from '@/components/ui/separator';

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
  Bar, 
  BarChart, 
  CartesianGrid, 
  LabelList, 
  XAxis, 
  YAxis, 
  Pie, 
  PieChart, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from "recharts";

import { 
  User, 
  UserPlus, 
  UserCheck, 
  UserMinus 
} from 'lucide-react';

import { 
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent
 } from '@/components/ui/card';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

const employeeDataStatistics = [
  { statistic: "New", total: 200 },
  { statistic: "Active", total: 186 },
  { statistic: "Resign", total: 50 }
];

const employeeDataStatus = [
  { status: "Permanent", total: 200 },
  { status: "Trial", total: 186 },
  { status: "Contract", total: 50 },
  { status: "Intern", total: 50 }
];

const attendancesData = [
  { attendance: "onTime", total: 200, fill: "hsl(var(--chart-1))" },
  { attendance: "late", total: 186, fill: "hsl(var(--chart-2))" },
  { attendance: "leave", total: 50, fill: "hsl(var(--chart-3))" },
];

const chartConfig = {
  total: {
    label: "Total",
    color: "#000000",
  },
  onTime: {
    label: "On Time",
    color: "#257047",
  },
  late: {
    label: "Late",
    color: "#FFAB00",
  },
  leave: {
    label: "Leave",
    color: "#C11106",
  },
} satisfies ChartConfig

const attendancesTableData = [
  { 
    id: 1, 
    name: "John Doe",
    status: "On Time",
    clockIn: "08:00",
  },
]

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
          <div className="grid auto-rows-min gap-4 md:grid-cols-2 sm:grid-cols-1 bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <Card>
              <CardHeader className='relative pb-4'>
                <div className='flex items-center gap-2'>
                  <div>
                    <CardTitle>Employee Statistics</CardTitle>
                    <CardDescription>Current Number of Employees</CardDescription>
                  </div>
                  <div className='absolute right-4 top-4 pr-1'>
                    <Select>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="january">January</SelectItem>
                          <SelectItem value="february">February</SelectItem>
                          <SelectItem value="march">March</SelectItem>
                          <SelectItem value="april">April</SelectItem>
                          <SelectItem value="may">May</SelectItem>
                          <SelectItem value="june">June</SelectItem>
                          <SelectItem value="july">July</SelectItem>
                          <SelectItem value="august">August</SelectItem>
                          <SelectItem value="september">September</SelectItem>
                          <SelectItem value="october">October</SelectItem>
                          <SelectItem value="november">November</SelectItem>
                          <SelectItem value="december">December</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={employeeDataStatistics} margin={{ top: 15, right: 0, left: -25, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="statistic" tickLine={false}/>
                    <YAxis  
                      axisLine={false} 
                      tickLine={false}
                      domain={[0, 200]}
                    />
                    <Tooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 shadow rounded text-sm">
                              <p> Total = {payload[0].value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="total" fill="#1E3A5F" radius={[10, 10, 0, 0]}>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='relative pb-4'>
                <div className='flex items-center gap-2'>
                  <div>
                    <CardTitle>Employee Status</CardTitle>
                    <CardDescription>Current Status of Employees</CardDescription>
                  </div>
                  <div className='absolute right-4 top-4 pr-1'>
                    <Select>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="january">January</SelectItem>
                          <SelectItem value="february">February</SelectItem>
                          <SelectItem value="march">March</SelectItem>
                          <SelectItem value="april">April</SelectItem>
                          <SelectItem value="may">May</SelectItem>
                          <SelectItem value="june">June</SelectItem>
                          <SelectItem value="july">July</SelectItem>
                          <SelectItem value="august">August</SelectItem>
                          <SelectItem value="september">September</SelectItem>
                          <SelectItem value="october">October</SelectItem>
                          <SelectItem value="november">November</SelectItem>
                          <SelectItem value="december">December</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={employeeDataStatus} margin={{ top: 15, right: 0, left: -25, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="statistic" tickLine={false}/>
                    <YAxis  
                      axisLine={false} 
                      tickLine={false}
                      domain={[0, 200]}
                    />
                    <Tooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 shadow rounded text-sm">
                              <p> Total = {payload[0].value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="total" fill="#1E3A5F" radius={[10, 10, 0, 0]}>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className='@container/card'>
              <div className='grid grid-cols-10 h-full items-center p-0'>
                <div className='col-span-4 p-0'>
                  <CardContent className='flex-1 pt-0 pb-0 pl-6 pr-0 h-full'> 
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto w-full h-full min-h-[300px] [&_.recharts-text]:fill-background"
                    >
                      <PieChart
                        width={300}
                        height={300}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <ChartTooltip
                          content={<ChartTooltipContent nameKey="total" hideLabel />}
                        />
                        <Pie 
                          data={attendancesData} 
                          dataKey="total"
                          outerRadius={80} 
                        >
                          {attendancesData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={chartConfig[entry.attendance as keyof typeof chartConfig]?.color}
                            />
                          ))}
                          <LabelList
                            dataKey="attendance"
                            className="fill-background"
                            stroke="none"
                            fontSize={12}
                            formatter={(value: keyof typeof chartConfig) =>
                              chartConfig[value]?.label
                            }
                          />
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </div>
                <div className='col-span-6'>
                  <CardContent className="flex flex-col gap-4 pt-0 pb-0 pl-6 pr-6">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Statistic</span>
                      <span className="text-muted-foreground">Today</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Attendance</span>
                      <span className="text-muted-foreground">02 May 2025</span>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-3">
                      {attendancesData.slice(0, 4).map((item, index) => (
                        <div key={item.attendance} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ 
                                backgroundColor: chartConfig[item.attendance as keyof typeof chartConfig]?.color
                              }}
                            ></span>
                            <span className="text-sm text-muted-foreground font-medium">
                              {chartConfig[item.attendance as keyof typeof chartConfig]?.label}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{item.total}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
            <Card>
              <CardHeader className='relative'>
                <div>
                  <div className='flex items-center gap-2 pb-4'>
                    <h1>Attendance</h1>
                    <div className='absolute right-4 top-4 pr-1 flex items-center'>
                      <Select>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="january">January</SelectItem>
                            <SelectItem value="february">February</SelectItem>
                            <SelectItem value="march">March</SelectItem>
                            <SelectItem value="april">April</SelectItem>
                            <SelectItem value="may">May</SelectItem>
                            <SelectItem value="june">June</SelectItem>
                            <SelectItem value="july">July</SelectItem>
                            <SelectItem value="august">August</SelectItem>
                            <SelectItem value="september">September</SelectItem>
                            <SelectItem value="october">October</SelectItem>
                            <SelectItem value="november">November</SelectItem>
                            <SelectItem value="december">December</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <a href="/user/[id]/employee/checkclock">
                        <button>
                          <ExternalLink className="h-7 w-7 ml-2" />
                        </button>
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-row gap-3">
                      {attendancesData.slice(0, 4).map((item, index) => (
                        <div key={item.attendance} className="flex gap-2 items-center after:content-['|'] last:after:hidden">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: chartConfig[item.attendance as keyof typeof chartConfig]?.color
                            }}
                          ></span>
                          <span className="text-sm font-medium">{item.total}</span>
                          <span className="text-sm font-medium">
                            {chartConfig[item.attendance as keyof typeof chartConfig]?.label}
                          </span>
                        </div>
                      ))}
                    </div>
                </div>
              </CardHeader>  
              <CardContent>
                <Table>
                  <TableHeader className='bg-[#1E3A5F] text-white'>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Clock In</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendancesTableData.map((at) => (
                      <TableRow key={at.id}>
                        <TableCell>{at.id}</TableCell>
                        <TableCell>{at.name}</TableCell>
                        <TableCell>{at.status}</TableCell>
                        <TableCell>{at.clockIn}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>                
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
