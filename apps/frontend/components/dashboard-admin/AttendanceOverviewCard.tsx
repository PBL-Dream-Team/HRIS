'use client';

import React from 'react';
import { Pie, PieChart, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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

  const isEmpty = attendancesData.every((item) => item.total === 0);

  return (
    <Card className="@container/card">
      <CardHeader className="relative pb-3">
        <div className="flex items-center gap-2">
          <div>
            <CardTitle className="text-xl">Attendance Overview</CardTitle>
            <CardDescription className="text-md">
              Attendance statistics for today
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <div className="flex flex-col md:grid md:grid-cols-10 h-full items-start p-0">
        {/* Chart Area */}
        <div className="md:col-span-4 w-full p-0 flex justify-center">
          <CardContent className="flex-1 pt-4 pb-0 px-4 md:pl-6 md:pr-2 h-full flex justify-center">
            <ChartContainer
              config={chartConfig}
              className="mx-auto w-full h-full min-h-[180px] md:min-h-[250px] [&_.recharts-text]:fill-background"
            >
              <PieChart
                width={160}
                height={160}
                className="md:w-[300px] md:h-[300px] w-[160px] h-[160px]"
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
        <div className="md:col-span-6 w-full">
          <CardContent className="flex flex-col gap-3 pt-8 pb-0 px-4 md:pl-4 md:pr-6">

            <div className="flex justify-between text-lg flex-wrap gap-2">
              <span className="font-semibold">Statistic</span>
              <span className="text-muted-foreground">Today</span>
            </div>
            <div className="flex justify-between items-center text-lg flex-wrap gap-2">
              <span className="font-semibold">Attendance</span>
              <span className="text-muted-foreground">{currentDate}</span>
            </div>
            <hr />
            {isEmpty ? (
              <div className="text-center text-muted-foreground py-8">
                No attendance data available
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {attendancesData.map((item) => (
                  <div key={item.attendance} className="flex items-center justify-between">
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
                    <span className="text-sm font-medium text-muted-foreground min-w-[16px] text-right">
                      {item.total}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
