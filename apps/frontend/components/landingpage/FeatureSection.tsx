'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  CalendarDays,
  FileText,
  CreditCard,
  BarChart2,
} from 'lucide-react';

export const FeatureSection = () => {
  const features = [
    {
      title: 'Employee Management',
      desc: 'Manage employee data in one place, from personal details to job history and active status.',
      icon: Users,
    },
    {
      title: 'Attendance',
      desc: 'Track employee attendance with an online check-in/out system integrated with time and location.',
      icon: CalendarDays,
    },
    {
      title: 'Document Management',
      desc: 'Upload, archive, and manage important documents such as contracts, leave letters, and more.',
      icon: FileText,
    },
  ];

  const additionalFeatures = [
    {
      title: 'Subscription & Payments',
      desc: 'Manage company subscription plans and make secure, transparent payments with ease.',
      icon: CreditCard,
    },
    {
      title: 'Employee Statistics',
      desc: 'Visualize employee data such as performance, attendance, and job distribution with informative charts.',
      icon: BarChart2,
    },
  ];

  return (

    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Key Features of Our HRIS
      </h2>
      <p className="text-gray-600 text-lg mb-12">
        A complete solution to manage all your human resource needs in one platform.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {features.map(({ title, desc, icon: Icon }, i) => (
          <Card
            key={i}
            className="p-6 text-center transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 text-[#1E3A5F]">
              <Icon className="w-10 h-10 mx-auto" />
            </div>
            <CardContent>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center flex-wrap gap-8">
        {additionalFeatures.map(({ title, desc, icon: Icon }, i) => (
          <Card
            key={i}
            className="p-6 text-center w-full max-w-sm transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 text-[#1E3A5F]">
              <Icon className="w-10 h-10 mx-auto" />
            </div>
            <CardContent>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

  );
};
