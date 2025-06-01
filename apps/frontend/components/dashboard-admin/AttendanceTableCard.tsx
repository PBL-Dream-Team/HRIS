import React from 'react';

{
  /* Import Components */
}

import SelectMonthFilter from './ui/SelectMonthFilter';

import { ExternalLink } from 'lucide-react';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

import { ChartConfig } from '@/components/ui/chart';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

{
  /* Data */
}

const attendancesData = [
  { attendance: 'onTime', total: 200, fill: 'hsl(var(--chart-1))' },
  { attendance: 'late', total: 186, fill: 'hsl(var(--chart-2))' },
  { attendance: 'leave', total: 50, fill: 'hsl(var(--chart-3))' },
];

const chartConfig = {
  total: {
    label: 'Total',
    color: '#000000',
  },
  onTime: {
    label: 'On Time',
    color: '#257047',
  },
  late: {
    label: 'Late',
    color: '#FFAB00',
  },
  leave: {
    label: 'Leave',
    color: '#C11106',
  },
} satisfies ChartConfig;

const attendancesTableData = [
  {
    id: 1,
    name: 'John Doe',
    status: 'On Time',
    clockIn: '08:00',
  },
  {
    id: 2,
    name: 'Jane Smith',
    status: 'Late',
    clockIn: '09:00',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    status: 'Leave',
    clockIn: 'N/A',
  },
];

{
  /* Content */
}

export default function AttendanceTableCard() {
  return (
    <Card>
      <CardHeader className="relative">
        <div>
          <div className="flex items-center gap-2 pb-4">
            <CardTitle className="text-xl">Attendance Summary</CardTitle>
            <div className="absolute right-4 top-4 pr-1 flex items-center">
              <SelectMonthFilter />
              <a href="/user/[id]/employee/checkclock">
                <button>
                  <ExternalLink className="h-7 w-7 ml-2" />
                </button>
              </a>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            {attendancesData.slice(0, 4).map((item, index) => (
              <div
                key={item.attendance}
                className="flex gap-2 items-center after:content-['|'] last:after:hidden"
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      chartConfig[item.attendance as keyof typeof chartConfig]
                        ?.color,
                  }}
                ></span>
                <span className="text-sm font-medium">{item.total}</span>
                <span className="text-sm font-medium">
                  {
                    chartConfig[item.attendance as keyof typeof chartConfig]
                      ?.label
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-[#1E3A5F] text-white">
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
                <TableCell>
                  <div>
                    <span
                      className={`px-2 py-1 rounded text-xs text-white 
                            ${at.status === 'On Time' ? 'bg-[#257047]' : ''}
                            ${at.status === 'Late' ? 'bg-[#FFAB00]' : ''}
                            ${at.status === 'Leave' ? 'bg-[#C11106]' : ''}
                            `}
                    >
                      {at.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{at.clockIn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
