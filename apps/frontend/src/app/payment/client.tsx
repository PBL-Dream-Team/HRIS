'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

const SUBSCRIPTION_IDS: Record<string, string> = {
  Trial: 'bcf1b2a6-bdc2-4b66-98b1-e8a2c0ea2e95',
  'Pay as you go': 'd63b6982-048d-414e-92d4-50357234e010',
  Bronze: '3883ceb2-0e1b-416a-a04a-25a1c13ea235',
  Silver: '570e5b14-c64a-420c-a0a9-2d139a197c4f',
  Gold: '83ae1693-b69d-42ba-93c4-66eb6efffb6f',
};

// Hanya metode yang didukung Tripay
const PAYMENT_METHODS = [
  'BNIVA',
  'BRIVA',
  'MANDIRIVA',
  'BCAVA',
  'OVO',
  'QRIS',
  'QRIS2',
  'DANA',
  'SHOPEEPAY',
];

export default function PaymentClient({ company_id }: { company_id: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('SHOPEEPAY');
  const [phoneNumber, setPhoneNumber] = useState('');

  const title = searchParams.get('title') || 'Unknown Package';
  const priceString = searchParams.get('price') || '0';
  const range = searchParams.get('range') || '1';
  const type = searchParams.get('type') || 'single';

  const employeeCount = parseInt(range.replace(/[^\d]/g, ''), 10) || 1;
  const parsedPrice = parseInt(priceString.replace(/[^\d]/g, ''), 10) || 0;

  const taxRate = 0.1; //.env bandel
  const subtotal = type === 'payg' ? parsedPrice * employeeCount : parsedPrice;
  // const total = subtotal + subtotal * taxRate;
  const total = subtotal;

  const handleContinue = async () => {
    if (!company_id) {
      router.push('/signin');
      return;
    }

    setLoading(true);

    const subscription_id = SUBSCRIPTION_IDS[title] || '';
    const merchant_ref = `HRIS${Math.floor(100000 + Math.random() * 900000)}`;
    const expired = Math.floor(Date.now() / 1000) + 3600; // UNIX
    const expiryDate = new Date(expired * 1000).toISOString(); //ISO

    try {
      await api.post(`/api/transaction`,{
        company_id: company_id,
        subscription_id: subscription_id,
        total: total,
        merchantRef: merchant_ref,
        // taxRate: taxRate*100,
        expiresAt: new Date(expiryDate).toISOString()
      });
      const res = await api.post(`/api/payment/init`, {
        company_id: company_id,
        subscription_id: subscription_id,
        title: title,
        price: parsedPrice,
        employeeCount: employeeCount,
        type: type,
        method: paymentMethod,
        amount: total,
        merchant_ref: merchant_ref,
        expired: expired,
        phone: phoneNumber
      });

      if (res.data?.success) {
        router.push(res.data.checkout_url);
      } else {
        console.error('Tripay Error:', res.data);
        router.push('/payment/callback?status=failed');
      }
    } catch (error) {
      console.error('Request Error:', error);
      router.push('/payment/callback?status=failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-md w-full text-black border rounded-lg p-6 shadow-sm space-y-2 text-sm">
        <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>

        <div className="flex justify-between"><span>Package</span><span>: {title}</span></div>
        <div className="flex justify-between"><span>Total Users</span><span>: {employeeCount}</span></div>

        {type === 'payg' && (
          <div className="flex justify-between">
            <span>Price per User</span>
            <span>: Rp {parsedPrice.toLocaleString()}</span>
          </div>
        )}
        {type === 'single' && (
          <div className="flex justify-between">
            <span>Total Package Price</span>
            <span>: Rp {parsedPrice.toLocaleString()}</span>
          </div>
        )}

        <hr className="my-4" />
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>Rp {subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm"><span>Tax (10%)</span><span>Rp {(subtotal * taxRate).toLocaleString()}</span></div>
        <hr className="my-4" />
        <div className="flex justify-between font-semibold text-base"><span>Total</span><span>Rp {total.toLocaleString()}</span></div>

        <div className="mt-4">
          <label className="block font-medium mb-2">Payment Method</label>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <label key={method} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>

          
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g. 081234567890"
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>

        <Button className="mt-6 w-full" onClick={handleContinue} disabled={loading}>
          {loading ? 'Processing...' : 'Continue to Payment'}
        </Button>
      </div>
    </div>
  );
}
