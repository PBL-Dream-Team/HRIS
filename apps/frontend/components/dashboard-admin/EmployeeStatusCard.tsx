import React from 'react';

import SelectMonthFilter from './ui/SelectMonthFilter';

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type Props = {
  data: {
    name: string;
    total: number;
    color: string;
  }[];
};

function toTitleCase(str: string | null | undefined) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function EmployeeStatusCard({ data }: Props) {
  // Add safety check
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <CardHeader className="relative pb-4">
          <div className="flex items-center gap-2">
            <div>
              <CardTitle className="text-xl">Employee Status</CardTitle>
              <CardDescription className="text-md">
                Current Number of Employees
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No employee status data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ubah name dari uppercase ke Title Case
  const formattedData = data
    .filter(item => item && item.name) // Filter out null items
    .map(item => ({
      ...item,
      name: toTitleCase(item.name),
    }));

  // Mapping chart config sesuai nama yang sudah diubah
  const chartConfig = formattedData.reduce((acc, curr) => {
    acc[curr.name] = {
      label: `${curr.name} Employees`,
      color: curr.color,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader className="relative pb-4">
        <div className="flex items-center gap-2">
          <div>
            <CardTitle className="text-xl">Employee Status</CardTitle>
            <CardDescription className="text-md">
              Current Number of Employees
            </CardDescription>
          </div>
          <div className="absolute right-4 top-4 pr-1">
            {/* <SelectMonthFilter /> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={formattedData}
            margin={{ top: 15, right: 0, left: -25, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis axisLine={false} tickLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="total" radius={[10, 10, 0, 0]}>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
