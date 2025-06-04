'use client';
import React from 'react';

// Import Components
import SelectMonthFilter from './ui/SelectMonthFilter';

import { Pie, PieChart, Cell } from 'recharts';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

// Data
// const attendancesData = [
//   { attendance: 'onTime', total: 200, fill: 'hsl(var(--chart-1))' },
//   { attendance: 'late', total: 186, fill: 'hsl(var(--chart-2))' },
//   { attendance: 'leave', total: 50, fill: 'hsl(var(--chart-3))' },
//   { attendance: 'sick', total: 30, fill: 'hsl(var(--chart-4))' },
//   { attendance: 'permit', total: 20, fill: 'hsl(var(--chart-5))' },
// ];

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
  sick: {
    label: 'Sick',
    color: '#900d04',
  },
  permit: {
    label: 'Permit',
    color: '#BA3C54',
  },
} satisfies ChartConfig;

type AttendanceSummary = {
  onTime: number;
  late: number;
  leave: number;
  sick: number;
  permit: number;
};
// Content
type AttendanceSummaryCardProps = {
  summary: AttendanceSummary;
};

export default function AttendanceSummaryCard({ summary }: AttendanceSummaryCardProps) {
  const attendancesData = [
    { attendance: 'onTime', total: summary.onTime, fill: 'hsl(var(--chart-1))' },
    { attendance: 'late', total: summary.late, fill: 'hsl(var(--chart-2))' },
    { attendance: 'leave', total: summary.leave, fill: 'hsl(var(--chart-3))' },
    { attendance: 'sick', total: summary.sick, fill: 'hsl(var(--chart-4))' },
    { attendance: 'permit', total: summary.permit, fill: 'hsl(var(--chart-5))' },
  ];
  return (
    <Card>
      <CardHeader className="relative pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">Attendance Summary</CardTitle>
          <div className="absolute right-4 top-4 pr-1">
            <SelectMonthFilter />
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
            <Pie data={attendancesData} dataKey="total" outerRadius={130}>
              {attendancesData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    chartConfig[entry.attendance as keyof typeof chartConfig]
                      ?.color
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="grid grid-cols-5 gap-4">
          {attendancesData.slice(0, 5).map((item, index) => (
            <div key={item.attendance} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  backgroundColor:
                    chartConfig[item.attendance as keyof typeof chartConfig]
                      ?.color,
                }}
              ></span>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground font-medium">
                  {
                    chartConfig[item.attendance as keyof typeof chartConfig]
                      ?.label
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
