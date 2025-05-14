"use client"
import React from 'react'

{/* Import Components */}

import SelectMonthFilter from './ui/SelectMonthFilter';

import { 
    Bar, 
    BarChart, 
    CartesianGrid,
    XAxis, 
    YAxis,
} from "recharts";

import { 
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const workhoursData = [
    { name: "Week-1", total: 8 },
    { name: "Week-2", total: 6 },
    { name: "Week-3", total: 4 },
    { name: "Week-4", total: 2 },
];

const chartConfig = {
    week1: {
        label: "Week 1",
    },
    week2: {
        label: "Week 2",
    },
    week3: {
        label: "Week 3",
    },
    week4: {
        label: "Week 4"
    },
} satisfies ChartConfig

export default function WorkHoursOverviewCard() {
  return (
    <Card className='h-[300px]'>
        <CardHeader className='relative pb-4'>
            <div className='flex items-center gap-2'>
                <div>
                    <CardTitle className='text-xl'>Weekly Work Hours</CardTitle>
                    <CardDescription className='text-lg'>120h 54m</CardDescription>
                </div>
                <div className='absolute right-4 top-4 pr-1'>
                    <SelectMonthFilter />
                </div>
            </div>
        </CardHeader>
        <CardContent className='flex-1 h-[210px]'>
                <ChartContainer config={chartConfig} className='h-full w-full'>
                    <BarChart 
                        accessibilityLayer 
                        data={workhoursData} 
                        margin={{ top: 15, right: 0, left: -25, bottom: 5 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis  
                            axisLine={false} 
                            tickLine={false}
                            domain={[0, 8]}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel/>}
                        />
                        <Bar 
                            dataKey="total" 
                            fill='#1E3A5F' 
                            radius={[10, 10, 0, 0]} 
                        />
                    </BarChart>
                </ChartContainer>
        </CardContent>
    </Card>
  )
}
