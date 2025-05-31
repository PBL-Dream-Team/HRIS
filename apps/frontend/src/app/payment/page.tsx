'use client'
import { useSearchParams } from 'next/navigation'

export default function PaymentPage() {
  const searchParams = useSearchParams()

  const title = searchParams.get('title') || 'Unknown Package'
  const priceString = searchParams.get('price') || '0'
  const range = searchParams.get('range') || '1'
  const type = searchParams.get('type') || 'single'

  const employeeCount = parseInt(range.replace(/[^\d]/g, ''), 10) || 1
  const parsedPrice = parseInt(priceString.replace(/[^\d]/g, ''), 10) || 0

  const taxRate = 0.1

  // Hitung berdasarkan jenis paket
  const subtotal = type === 'payg'
    ? parsedPrice * employeeCount // pay-as-you-go dihitung per user
    : parsedPrice                 // single payment sudah total

  const total = subtotal + subtotal * taxRate

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-md w-full text-black border rounded-lg p-6 shadow-sm space-y-2 text-sm">
        <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>

        <div className="flex justify-between">
          <span>Package</span><span>: {title}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Users</span><span>: {employeeCount}</span>
        </div>
        {type === 'payg' && (
          <div className="flex justify-between">
            <span>Price per User</span><span>: Rp {parsedPrice.toLocaleString()}</span>
          </div>
        )}
        {type === 'single' && (
          <div className="flex justify-between">
            <span>Total Package Price</span><span>: Rp {parsedPrice.toLocaleString()}</span>
          </div>
        )}

        <hr className="my-4" />

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (10%)</span>
          <span>Rp {(subtotal * taxRate).toLocaleString()}</span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>Rp {total.toLocaleString()}</span>
        </div>

        <button className="mt-6 w-full bg-[#1E3A5F] text-white py-3 rounded">
          Confirm and upgrade
        </button>
      </div>
    </div>
  )
}
