import React from 'react';

{/* Import Components */}

import { 
  Pie, 
  PieChart, 
  Cell,
} from "recharts";

import { 
  Card,
  CardContent,
} from '@/components/ui/card';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

{/* Data */}

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
} satisfies ChartConfig;

{/* Content */}

export default function AttendanceOverviewCard() {
  return (
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
                <div key={item.attendance}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ 
                        backgroundColor: chartConfig[item.attendance as keyof typeof chartConfig]?.color,
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
  );
}
