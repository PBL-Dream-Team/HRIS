'use client';

import React from 'react';
import { Pie, PieChart, Cell, Tooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

import {
  ChartConfig,
  ChartContainer,
} from '@/components/ui/chart';

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

type AttendanceOverviewCardProps = {
  attendancesData: {
    attendance: 'onTime' | 'late' | 'leave';
    total: number;
  }[];
};

export default function AttendanceOverviewCard({
  attendancesData,
}: AttendanceOverviewCardProps) {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const totalSum = attendancesData.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card className="@container/card">
      <div className="grid grid-cols-10 h-full items-center p-0">
        {/* Chart Area */}
        <div className="col-span-4 p-0">
          <CardContent className="flex-1 pt-0 pb-0 pl-6 pr-0 h-full">
            <ChartContainer
              config={chartConfig}
              className="mx-auto w-full h-full min-h-[300px] [&_.recharts-text]:fill-background"
            >
              <PieChart
                width={300}
                height={300}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <Pie
                  data={attendancesData}
                  dataKey="total"
                  outerRadius={80}
                  nameKey="attendance"
                >
                  {attendancesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        chartConfig[
                          entry.attendance as keyof typeof chartConfig
                        ]?.color
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0) {
                      const current = payload[0].payload;
                      const percentage = ((current.total / totalSum) * 100).toFixed(1);
                      const attendanceType = current.attendance as keyof typeof chartConfig;

                      return (
                        <div className="bg-white rounded shadow p-2 text-sm border border-gray-200">
                          <div className="font-semibold">
                            {chartConfig[attendanceType]?.label}
                          </div>
                          <div>{`${current.total} (${percentage}%)`}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </div>

        {/* Detail Area */}
        <div className="col-span-6">
          <CardContent className="flex flex-col gap-4 pt-0 pb-0 pl-6 pr-6">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Statistic</span>
              <span className="text-muted-foreground">Today</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Attendance</span>
              <span className="text-muted-foreground">{currentDate}</span>
            </div>
            <hr />
            <div className="flex flex-col gap-3">
              {attendancesData.map((item) => (
                <div key={item.attendance}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          chartConfig[item.attendance as keyof typeof chartConfig]
                            ?.color,
                      }}
                    ></span>
                    <span className="text-sm text-black font-medium">
                      {chartConfig[item.attendance as keyof typeof chartConfig]?.label}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.total}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
