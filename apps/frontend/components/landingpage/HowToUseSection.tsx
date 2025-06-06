'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BadgeCheck, Clock, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const steps = [
  {
    title: '1. Register & Create Account',
    description: 'Start by registering your company and creating an HR admin account.',
    icon: <BadgeCheck className="w-10 h-10 text-[#1E3A5F]" />,
  },
  {
    title: '2. Add Employees',
    description: 'Import employee data manually or using an Excel file in seconds.',
    icon: <Settings className="w-10 h-10 text-[#1E3A5F]" />,
  },
  {
    title: '3. Start Using Features',
    description: 'Manage attendance, leave, payroll, and more right from your dashboard.',
    icon: <Clock className="w-10 h-10 text-[#1E3A5F]" />,
  },
];

export function HowToUseSection() {
  return (
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        How Does It Work?
      </h2>
      <p className="text-gray-600 text-lg mb-12">
        Just a few simple steps to start managing your HR efficiently.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="p-6 text-center hover:shadow-lg transition-shadow"
          >
            <div className="mb-4 flex justify-center">{step.icon}</div>
            <CardContent>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Link href="/how-it-works">
        <Button size="lg" className="text-lg px-6 py-4">
          See More
        </Button>
      </Link>
    </div>
  );
}
