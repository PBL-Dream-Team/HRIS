'use client'
import { useState } from 'react'
import { Check, X } from 'lucide-react'

const packages = [
    {
        title: 'Paket 1',
        description: 'Deskripsi',
        features: [
        true, true, true, true, true,
        true, true, false, false, false,
        ],
    },
    {
        title: 'Paket 2',
        description: 'Deskripsi',
        features: [
        true, true, true, true, true,
        true, false, false, false, false,
        ],
    },
    {
        title: 'Paket 3',
        description: 'Deskripsi',
        features: [
        true, true, true, true, true,
        false, false, false, false, false,
        ],
    },
]

const seatPlans = [
    {
        title: 'Paket 1',
        price: 'Rp. 100.000',
        range: '1 - 10 Users',
    },
    {
        title: 'Paket 2',
        price: 'Rp. 200.000',
        range: '11 - 50 Users',
    },
    {
        title: 'Paket 3',
        price: 'Rp. 300.000',
        range: '51 - 100 Users',
    },
    {
        title: 'Paket 4',
        price: 'Rp. 400.000',
        range: '101 - 200 Users',
    },
    {
        title: 'Paket 5',
        price: 'Rp. 500.000',
        range: '201 - 500 Users',
    },
    {
        title: 'Paket 6',
        price: 'Rp. 600.000',
        range: '501 - 1000 Users',
    },
]

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'package' | 'seat'>('package')

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 bg-white">
      <h1 className="text-black text-3xl font-bold text-center">HRIS Pricing Plans</h1>
      <p className="text-center mt-2 max-w-2xl mx-auto text-gray-600">
        Choose The Plan That Best Suits Your Business! This HRIS Offers Both Subscription And Pay-As-You-Go Payment Options, Available In The Following Packages:
      </p>

      {/* Tabs */}
      <div className="flex justify-center my-6">
        <button
          onClick={() => setActiveTab('package')}
          className={`px-4 py-2 border rounded-l-lg ${activeTab === 'package' ? 'bg-[#1E3A5F] text-white' : 'border-[#1E3A5F] text-black'}`}
        >
          Package
        </button>
        <button
          onClick={() => setActiveTab('seat')}
          className={`px-4 py-2 border rounded-r-lg ${activeTab === 'seat' ? 'bg-[#1E3A5F] text-white' : 'border-[#1E3A5F] text-black'}`}
        >
          Seat
        </button>
      </div>

      {activeTab === 'package' ? (
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <div key={idx} className="border rounded-lg p-6">
              <h2 className="text-black text-lg font-semibold">{pkg.title}</h2>
              <p className="text-sm text-black">Deskripsi</p>
              <hr className="my-2" />
              <ul className="space-y-1 text-black text-sm">
                {pkg.features.map((enabled, i) => (
                  <li key={i} className="flex justify-between">
                    <span>Fitur {i + 1}</span>
                    {enabled ? (
                      <Check className="text-green-600 w-4 h-4" />
                    ) : (
                      <X className="text-red-600 w-4 h-4" />
                    )}
                  </li>
                ))}
              </ul>
              <button className="mt-4 w-full bg-[#1E3A5F] text-white py-2 rounded flex justify-center items-center gap-2">
                Select Package →
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {seatPlans.map((plan, idx) => (
            <div key={idx} className="border rounded-lg p-6">
              <h2 className="text-black text-lg font-semibold">{plan.title}</h2>
              <p className="text-black text-xl font-bold mt-2">{plan.price} <span className="text-sm font-normal">/user/28 days</span></p>
              <p className="text-black text-sm mt-1">This Package For {plan.range}</p>
              <button className="mt-4 w-full bg-[#1E3A5F] text-white py-2 rounded flex justify-center items-center gap-2">
                Upgrade Package →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
