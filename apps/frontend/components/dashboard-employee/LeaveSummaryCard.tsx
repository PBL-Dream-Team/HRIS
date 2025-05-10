import React from 'react'

{/* Import Components */}

import SelectMonthFilter from './ui/SelectMonthFilter';

import { ArrowRight } from 'lucide-react';

import { Button } from '../ui/button';

import { 
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

export default function LeaveSummaryCard() {
  return (
    <Card>
        <CardHeader className='relative pb-5'>
            <div className='flex items-center gap-2'>
                <CardTitle className='text-2xl'>Leave Summary</CardTitle>
                <div className='absolute right-4 top-4 pr-1'>
                    <SelectMonthFilter />
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-4">
                <div>
                    <Card>
                        <CardHeader className='flex flex-row'>
                            <div className='flex items-center gap-2'>
                                <span
                                    className="w-3 h-3 rounded-full flex-shrink-0 bg-[#1E3A5F]"
                                ></span>
                                <CardTitle className='text-lg font-medium text-muted-foreground'>
                                    Total Quota Annual Leave
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='items-center flex flex-col text-3xl font-semibold'>
                                12 days
                            </div>
                        </CardContent>
                        <CardFooter className='flex flex-row pt-2 pb-2 border border-t-black'>
                            <div className='flex items-center gap-2'>
                                <Button variant="link" className="h-auto p-0 text-primary items-center">
                                    Request Leave
                                    <ArrowRight className=" h-5 w-5" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
                <div className='grid gap-4 sm:grid-cols-2'>
                    <Card>
                        <CardHeader className='flex flex-row'>
                            <div className='flex items-center gap-2'>
                                <span
                                    className="w-3 h-3 rounded-full flex-shrink-0 bg-[#1E3A5F]"
                                ></span>
                                <CardTitle className='text-lg font-medium text-muted-foreground'>
                                    Taken
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='items-center flex flex-col text-3xl font-semibold'>
                                12 days
                            </div>
                        </CardContent>
                        <CardFooter className='flex flex-row pt-2 pb-2 border border-t-black'>
                            <div className='flex items-center gap-2'>
                                <Button variant="link" className="h-auto p-0 text-primary items-center">
                                    Request Leave
                                    <ArrowRight className=" h-5 w-5" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row'>
                            <div className='flex items-center gap-2'>
                                <span
                                    className="w-3 h-3 rounded-full flex-shrink-0 bg-[#1E3A5F]"
                                ></span>
                                <CardTitle className='text-lg font-medium text-muted-foreground'>
                                    Remaining
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='items-center flex flex-col text-3xl font-semibold'>
                                12 days
                            </div>
                        </CardContent>
                        <CardFooter className='flex flex-row pt-2 pb-2 border border-t-black'>
                            <div className='flex items-center gap-2'>
                                <Button variant="link" className="h-auto p-0 text-primary items-center">
                                    Request Leave
                                    <ArrowRight className=" h-5 w-5" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}
