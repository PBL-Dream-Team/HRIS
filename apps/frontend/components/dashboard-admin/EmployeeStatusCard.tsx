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

const employeeDataStatus = [
  { name: 'Permanent', total: 200, color: '#257047' },
  { name: 'Contract', total: 50, color: '#FFAB00' },
  { name: 'Intern', total: 30, color: '#2D8EFF' },
];

const chartConfig = {
  Permanent: {
    label: 'Permanent Employees',
    color: '#257047',
  },
  Contract: {
    label: 'Contract Employees',
    color: '#FFAB00',
  },
  Intern: {
    label: 'Intern Employees',
    color: '#2D8EFF',
  },
} satisfies ChartConfig;

{
  /* Content */
}
type Props = {
  data: {
    name: string;
    total: number;
    color: string;
  }[];
};

export default function EmployeeStatusCard({ data }: Props) {
  const chartConfig = data.reduce((acc, curr) => {
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
            <SelectMonthFilter />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
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
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
