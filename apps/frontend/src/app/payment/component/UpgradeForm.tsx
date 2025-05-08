'use client'

import { useState } from 'react'

export default function PaymentPage() {
  const [billing, setBilling] = useState<'single' | 'monthly'>('single')
  const [teamSize, setTeamSize] = useState<'1-50' | '51-100'>('1-50')
  const [employeeCount, setEmployeeCount] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  const pricePerUser = 17000
  const taxRate = 0.1
  const subtotal = pricePerUser * employeeCount
  const total = subtotal + subtotal * taxRate

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white grid md:grid-cols-2 gap-10">
      
      {/* LEFT: Form */}
      <div>
        <h1 className="text-2xl text-black font-bold">Paket 1</h1>
        <p className="text-gray-600 mt-1">Upgrade to Premium (Paket 1)</p>
        <a href="/pricingplan " className="text-sm text-blue-700 underline mt-1 inline-block">Change plan</a>

        {/* Billing Period */}
        <div className="mt-6">
          <h2 className="text-black font-semibold mb-2">Billing Period</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setBilling('single')}
              className={`px-4 py-2 rounded border ${billing === 'single' ? 'bg-[#1E3A5F] text-white' : 'border-[#1E3A5F] text-[#1E3A5F]'}`}
            >
              Single Payment - Rp {pricePerUser.toLocaleString()} / User
            </button>
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded border ${billing === 'monthly' ? 'bg-[#1E3A5F] text-white' : 'border-[#1E3A5F] text-[#1E3A5F]'}`}
            >
              Monthly - Rp (harga) / User
            </button>
          </div>
        </div>

        {/* Team Size */}
        <div className="mt-6">
          <h2 className="text-black font-semibold mb-2">Size Matters</h2>
          <p className="text-sm text-gray-600 mb-2">Choose the right fit for your team!</p>
          <div className="text-black flex gap-6 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={teamSize === '1-50'}
                onChange={() => setTeamSize('1-50')}
              />
              1 - 50
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={teamSize === '51-100'}
                onChange={() => setTeamSize('51-100')}
              />
              51 - 100
            </label>
          </div>

          {/* Employee Counter */}
          <div className="flex items-center gap-4">
            <span className="text-black font-medium">Number of Employees</span>
            <button
              onClick={() => setEmployeeCount(Math.max(1, employeeCount - 1))}
              className="text-black w-8 h-8 border rounded"
            >-</button>
            <span className='text-black'>{employeeCount}</span>
            <button
              onClick={() => setEmployeeCount(employeeCount + 1)}
              className="text-black w-8 h-8 border rounded"
            >+</button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={() => setShowSummary(true)}
          className="mt-8 w-full bg-[#1E3A5F] text-white py-3 rounded"
        >
          Continue to Payment
        </button>
      </div>

      {/* RIGHT: Order Summary */}
      {showSummary && (
        <div className="text-black border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Package</span><span>: Paket 1</span>
            </div>
            <div className="flex justify-between">
              <span>Billing Period</span><span>: {billing === 'single' ? 'Single Payment' : 'Monthly'}</span>
            </div>
            <div className="flex justify-between">
              <span>Team Size</span><span>: {teamSize}</span>
            </div>
            <div className="flex justify-between">
              <span>Number of Employees</span><span>: {employeeCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per User</span><span>: Rp {pricePerUser.toLocaleString()}</span>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>10%</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-semibold text-base">
            <span>Total at renewal</span>
            <span>Rp {total.toLocaleString()}</span>
          </div>

          <button className="mt-6 w-full bg-[#1E3A5F] text-white py-3 rounded">
            Confirm and upgrade
          </button>
        </div>
      )}
    </div>
  )
}
