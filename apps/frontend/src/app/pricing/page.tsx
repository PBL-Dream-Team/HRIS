'use client';
import { useState } from 'react';
import { Check, X } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

// List fitur
const featureLabels = [
  'Employee Management',
  'Checkclock',
  'Absence',
  'Letter',
];

const singlePayment = [
  {
    title: 'Trial',
    description:
      'Try out all features of our HRIS platform free for up to 10 employees. No credit card required!',
    price: 'Rp. 0',
    range: '10 Employee',
    features: [true, true, true, true],
  },
  {
    title: 'Bronze',
    description:
      'An ideal package for startups and small businesses looking to digitize their HR management with essential yet powerful features.',
    price: 'Rp. 14.000',
    range: '14 Employee',
    features: [true, true, true, true],
  },
  {
    title: 'Silver',
    description:
      'Perfect for growing businesses that require more flexibility and additional advanced features to manage their workforce efficiently.',
    price: 'Rp. 45.000',
    range: '30 Employee',
    features: [true, true, true, true],
  },
  {
    title: 'Gold',
    description:
      'The best choice for medium to large enterprises aiming for maximum efficiency and full utilization of HRIS capabilities.',
    price: 'Rp. 90.000',
    range: '60 Employee',
    features: [true, true, true, true],
  },
];

const baseEmployeePrice = 1000;

export default function PricingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'singlePayment' | 'payAsYouGo'>(
    'singlePayment',
  );
  const [employeeCount, setEmployeeCount] = useState(1);

  const payAsYouGo = [
    {
      title: 'Pay as you go',
      description:
        'Ideal for small teams or short-term projects, this plan allows you to pay only for the users you need.',
      price: employeeCount * baseEmployeePrice,
      features: [true, true, true, true],
    },
  ];

  const handleEmployeeChange = (delta: number) => {
    setEmployeeCount((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 bg-white">
      <h1 className="text-black text-3xl font-bold text-center">
        HRIS Pricing Plans
      </h1>
      <p className="text-center mt-2 max-w-2xl mx-auto text-gray-600">
        Choose The Plan That Best Suits Your Business! This HRIS Offers Both
        Subscription And Pay-As-You-Go Payment Options, Available In The
        Following Packages:
      </p>

      {/* Tabs */}
      <div className="flex justify-center my-6">
        <button
          onClick={() => setActiveTab('singlePayment')}
          className={`px-4 py-2 border rounded-l-lg ${activeTab === 'singlePayment' ? 'bg-[#1E3A5F] text-white' : 'border-[#1E3A5F] text-black'}`}
        >
          Single Payment
        </button>
        <button
          onClick={() => setActiveTab('payAsYouGo')}
          className={`px-4 py-2 border rounded-r-lg ${activeTab === 'payAsYouGo' ? 'bg-[#1E3A5F] text-white' : 'border-[#1E3A5F] text-black'}`}
        >
          Pay As You Go
        </button>
      </div>

      {activeTab === 'singlePayment' ? (
        <div className="grid md:grid-cols-3 gap-6">
          {singlePayment.map((plan, idx) => (
            <Card key={idx} className="border rounded-lg p-0">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl">{plan.title}</CardTitle>
                <p className="text-black text-sm mt-1">
                  This Package Include {plan.range}
                </p>
                <p className="text-black text-2xl font-bold mt-2">
                  {plan.price}{' '}
                  <span className="text-sm font-normal">/user/28 days</span>
                </p>
                <CardDescription>{plan.description}</CardDescription>
                <Button
                  className="w-full mt-4"
                  onClick={() => {
                    // Untuk Single Payment
                    router.push(
                      `/payment?title=${plan.title}&price=${plan.price}&range=${plan.range}&type=single`,
                    );
                  }}
                >
                  Get Started
                </Button>
                <hr className="my-2" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2">Feature</CardTitle>
                <ul className="space-y-1 text-black text-sm">
                  {featureLabels.map((label, i) => (
                    <li key={i} className="flex gap-2 items-center">
                      <Check className="text-[#257047] w-4 h-4" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid">
          {payAsYouGo.map((plan, idx) => (
            <Card key={idx} className="border rounded-lg p-0 max-w-md mx-auto">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl">{plan.title}</CardTitle>
                <p className="text-black text-sm mt-1">
                  You can choose how many employees you need
                </p>

                {/* Kalkulator Jumlah Karyawan */}
                <div className="flex items-center mt-3 space-x-2">
                  <Button size="sm" onClick={() => handleEmployeeChange(-1)}>
                    -
                  </Button>

                  <input
                    type="number"
                    min={1}
                    value={employeeCount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value >= 1) {
                        setEmployeeCount(value);
                      }
                    }}
                    className="w-16 text-center border rounded px-2 py-1"
                  />

                  <Button size="sm" onClick={() => handleEmployeeChange(1)}>
                    +
                  </Button>
                </div>

                <p className="text-black text-2xl font-bold mt-2">
                  Rp. {plan.price.toLocaleString()}{' '}
                  <span className="text-sm font-normal">/28 days</span>
                </p>
                <CardDescription>{plan.description}</CardDescription>
                <Button
                  className="w-full mt-4"
                  onClick={() => {
                    // Untuk Pay As You Go
                    router.push(
                      `/payment?title=${plan.title}&price=${baseEmployeePrice}&range=${employeeCount}&type=payg`,
                    );
                  }}
                >
                  Get Started
                </Button>
                <hr className="my-2" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2">Feature</CardTitle>
                <ul className="space-y-1 text-black text-sm">
                  {featureLabels.map((label, i) => (
                    <li key={i} className="flex gap-2 items-center">
                      <Check className="text-[#257047] w-4 h-4" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
