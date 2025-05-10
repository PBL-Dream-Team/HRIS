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
    CardDescription,
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

{/* Data */}

const employeeDataStatistics = [
    { name: "New", total: 200 },
    { name: "Active", total: 186 },
    { name: "Resign", total: 50 }
];

const chartConfig = {
    New: {
        label: "New Employees",
    },
    Active: {
        label: "Active Employees",
    },
    Resign: {
        label: "Resigned Employees",
    },
} satisfies ChartConfig

{/* Content */}

export default function EmployeeStatisticsCard() {
    return (
        <Card>
            <CardHeader className='relative pb-4'>
                <div className='flex items-center gap-2'>
                    <div>
                        <CardTitle>Employee Statistics</CardTitle>
                        <CardDescription>Current Number of Employees</CardDescription>
                    </div>
                    <div className='absolute right-4 top-4 pr-1'>
                        <SelectMonthFilter />
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
                        <YAxis  
                            axisLine={false} 
                            tickLine={false}
                            domain={[0, 200]}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
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
