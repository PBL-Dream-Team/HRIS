'use client'
import { useState } from 'react'
import { Check, X } from 'lucide-react'

import { 
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button'

const singlePayment = [
    {
        title: 'Silver',
        description: 'An ideal package for startups and small businesses looking to digitize their HR management with essential yet powerful features.',
        price: 'Rp. 100.000',
        range: '25 Employee',
        features: [
        true, true, true, true, true,
        true, true, false, false, false,
        ],
    },
    {
        title: 'Gold',
        description: 'Perfect for growing businesses that require more flexibility and additional advanced features to manage their workforce efficiently.',
        price: 'Rp. 100.000',
        range: '50 Employee',
        features: [
        true, true, true, true, true,
        true, false, false, false, false,
        ],
    },
    {
        title: 'Diamond',
        description: 'The best choice for medium to large enterprises aiming for maximum efficiency and full utilization of HRIS capabilities.',
        price: 'Rp. 100.000',
        range: '100 Employee',
        features: [
        true, true, true, true, true,
        false, false, false, false, false,
        ],
    },
]

const payAsYouGo = [
    {
        title: 'Pay As You Go',
        description: 'Ideal for small teams or short-term projects, this plan allows you to pay only for the users you need.',
        price: 'Rp. 100.000',
        features: [
        true, true, true, true, true,
        false, false, false, false, false,
        ],
    },
]

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'singlePayment' | 'payAsYouGo'>('singlePayment')

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 bg-white">
      <h1 className="text-black text-3xl font-bold text-center">HRIS Pricing Plans</h1>
      <p className="text-center mt-2 max-w-2xl mx-auto text-gray-600">
        Choose The Plan That Best Suits Your Business! This HRIS Offers Both Subscription And Pay-As-You-Go Payment Options, Available In The Following Packages:
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
              <CardHeader className='pb-0'>
                <CardTitle className='text-xl'>{plan.title}</CardTitle>
                <p className="text-black text-sm mt-1">This Package Include {plan.range}</p>
                <p className="text-black text-2xl font-bold mt-2">{plan.price} <span className="text-sm font-normal">/user/28 days</span></p>
                <CardDescription>{plan.description}</CardDescription>
                <Button className='w-full mt-4'>
                  Get Started
                </Button>
              <hr className="my-2" />
              </CardHeader>
              <CardContent>
                  <CardTitle className='text-lg mb-2'>Feature</CardTitle>
                  <ul className="space-y-1 text-black text-sm">
                    {plan.features.map((enabled, i) => (
                      <li key={i} className="flex gap-2 items-center">
                        {enabled ? (
                          <Check className="text-[#257047] w-4 h-4" />
                        ) : (
                          <X className="text-[#C11106] w-4 h-4" />
                        )}
                        <span>Fitur {i + 1}</span>
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
              <CardHeader className='pb-0'>
                <CardTitle className='text-xl'>{plan.title}</CardTitle>
                <p className="text-black text-sm mt-1">You can choose how many employee that you needed</p>
                <p className="text-black text-2xl font-bold mt-2">{plan.price} <span className="text-sm font-normal">/user/28 days</span></p>
                <CardDescription>{plan.description}</CardDescription>
                <Button className='w-full mt-4'>
                  Get Started
                </Button>
              <hr className="my-2" />
              </CardHeader>
              <CardContent>
                  <CardTitle className='text-lg mb-2'>Feature</CardTitle>
                  <ul className="space-y-1 text-black text-sm">
                    {plan.features.map((enabled, i) => (
                      <li key={i} className="flex gap-2 items-center">
                        {enabled ? (
                          <Check className="text-[#257047] w-4 h-4" />
                        ) : (
                          <X className="text-[#C11106] w-4 h-4" />
                        )}
                        <span>Fitur {i + 1}</span>
                      </li>
                    ))}
                  </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
