'use client';

import React from 'react';

{
  /* Import Components */
}
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

{
  /* Data */
}
const employeeDataStatistics = [
  { name: 'New', total: 200, color: '#2D8EFF' },
  { name: 'Active', total: 186, color: '#257047' },
  { name: 'Resign', total: 50, color: '#C11106' },
];

const chartConfig = {
  New: {
    label: 'New Employees',
    color: '#2D8EFF',
  },
  Active: {
    label: 'Active Employees',
    color: '#257047',
  },
  Resign: {
    label: 'Resigned Employees',
    color: '#C11106',
  },
} satisfies ChartConfig;

{
  /* Content */
}
export default function EmployeeStatisticsCard() {
  return (
    <Card>
      <CardHeader className="relative pb-4">
        <div className="flex items-center gap-2">
          <div>
            <CardTitle className="text-xl">Employee Statistics</CardTitle>
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
            data={employeeDataStatistics}
            margin={{ top: 15, right: 0, left: -25, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis axisLine={false} tickLine={false} domain={[0, 200]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="total" radius={[10, 10, 0, 0]}>
              {employeeDataStatistics.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    chartConfig[entry.name as keyof typeof chartConfig]?.color
                  }
                  name={entry.name}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
