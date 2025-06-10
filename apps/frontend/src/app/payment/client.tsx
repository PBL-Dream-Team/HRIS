'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import Image from 'next/image';

const SUBSCRIPTION_IDS: Record<string, string> = {
  Trial: 'bcf1b2a6-bdc2-4b66-98b1-e8a2c0ea2e95',
  'Pay as you go': 'd63b6982-048d-414e-92d4-50357234e010',
  Bronze: '3883ceb2-0e1b-416a-a04a-25a1c13ea235',
  Silver: '570e5b14-c64a-420c-a0a9-2d139a197c4f',
  Gold: '83ae1693-b69d-42ba-93c4-66eb6efffb6f',
};

const PAYMENT_METHODS = [
  { id: 'BNIVA', name: 'BNI Virtual Account', image: '/images/payment-methods/bniva.svg' },
  { id: 'BRIVA', name: 'BRI Virtual Account', image: '/images/payment-methods/briva.svg' },
  { id: 'MANDIRIVA', name: 'Mandiri Virtual Account', image: '/images/payment-methods/mandiriva.svg' },
  { id: 'BCAVA', name: 'BCA Virtual Account', image: '/images/payment-methods/bcava.svg' },
  { id: 'OVO', name: 'OVO', image: '/images/payment-methods/ovo.svg' },
  { id: 'QRIS', name: 'QRIS', image: '/images/payment-methods/qris.svg' },
  { id: 'QRIS2', name: 'QRIS 2', image: '/images/payment-methods/qris2.svg' },
  { id: 'DANA', name: 'DANA', image: '/images/payment-methods/dana.svg' },
  { id: 'SHOPEEPAY', name: 'ShopeePay', image: '/images/payment-methods/shopeepay.svg' },
];

export default function PaymentClient({ company_id }: { company_id: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('SHOPEEPAY');
  const [phoneNumber, setPhoneNumber] = useState('');
  // Consistent number formatting function to avoid hydration errors
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  // Check if payment method is available based on total amount
  const isPaymentMethodAvailable = (methodId: string) => {
    const virtualAccountMethods = ['BCAVA', 'BNIVA', 'MANDIRIVA', 'BRIVA'];
    if (virtualAccountMethods.includes(methodId) && total < 25000) {
      return false;
    }
    return true;
  };

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

  // Auto-select available payment method if current selection is not available
  React.useEffect(() => {
    if (!isPaymentMethodAvailable(paymentMethod)) {
      const availableMethod = PAYMENT_METHODS.find(method => isPaymentMethodAvailable(method.id));
      if (availableMethod) {
        setPaymentMethod(availableMethod.id);
      }
    }
  }, [total, paymentMethod]);

  const handleContinue = async () => {
    if (!company_id) {
      router.push('/signin');
      return;
    }

    // Check if it's Trial package - skip payment gateway
    if (title === 'Trial') {
      setLoading(true);
      
      const subscription_id = SUBSCRIPTION_IDS[title] || '';
      const merchant_ref = `HRIS${Math.floor(100000 + Math.random() * 900000)}`;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 14); // Trial for 14 days

      try {
        // Create transaction for Trial
        const transactionResponse = await api.post(`/api/transaction`, {
          company_id: company_id,
          subscription_id: subscription_id,
          total: 0, // Trial is free
          merchantRef: merchant_ref,
          expiresAt: expiryDate.toISOString()
        });

        console.log('Transaction created:', transactionResponse.data);

        // Update transaction status to PAID for Trial
        // You might need to call a separate endpoint to update the status
        try {
          await api.patch(`/api/transaction/${transactionResponse.data.id || merchant_ref}`, {
            status: 'PAID',
            paidAt: new Date().toISOString()
          });
        } catch (updateError) {
          console.warn('Could not update transaction status:', updateError);
          // Continue anyway since the main transaction was created
        }

        // Update company subscription details
        try {
          await api.patch(`/api/company/${company_id}`, {
            subscription_id: subscription_id,
            max_employee: 10, // Trial allows 10 employees
            subs_date_start: new Date().toISOString(),
            subs_date_end: expiryDate.toISOString()
          });
        } catch (companyUpdateError) {
          console.warn('Could not update company subscription:', companyUpdateError);
          // Continue anyway
        }

        // Redirect to success page
        router.push('/payment/success?ref=' + merchant_ref);
        
      } catch (error) {
        console.error('Trial activation error:', error);
        router.push('/payment/failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    // For non-trial packages, require phone number
    if (!phoneNumber.trim()) {
      alert('Please enter your phone number');
      return;
    }

    setLoading(true);

    const subscription_id = SUBSCRIPTION_IDS[title] || '';
    const merchant_ref = `HRIS${Math.floor(100000 + Math.random() * 900000)}`;
    const expired = Math.floor(Date.now() / 1000) + 3600; // UNIX
    const expiryDate = new Date(expired * 1000).toISOString(); //ISO

    try {
      await api.post(`/api/transaction`, {
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
        // Redirect ke pending page dengan merchant_ref
        router.push(`/payment/pending?ref=${res.data.tripayRef}`);
        // Buka Tripay payment page di tab baru
        // window.open(res.data.checkout_url, '_blank');

      } else {
        console.error('Tripay Error:', res.data);
        router.push('/payment/failed');
      }
    } catch (error) {
      console.error('Request Error:', error);
      router.push('/payment/failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-4xl w-full text-black border rounded-lg p-6 shadow-sm space-y-2 text-sm lg:max-w-6xl">        <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Order Details Column */}
          <div className="space-y-2 lg:pr-6 lg:border-r lg:border-gray-200">
            <h3 className="text-lg font-semibold mb-3 lg:block hidden">Order Details</h3>
            
            <div className="flex justify-between"><span>Package</span><span>: {title}</span></div>
            <div className="flex justify-between"><span>Total Users</span><span>: {employeeCount}</span></div>            {type === 'payg' && (
              <div className="flex justify-between">
                <span>Price per User</span>
                <span>: Rp {formatCurrency(parsedPrice)}</span>
              </div>
            )}
            {type === 'single' && (
              <div className="flex justify-between">
                <span>Total Package Price</span>
                <span>: Rp {formatCurrency(parsedPrice)}</span>
              </div>
            )}

            <hr className="my-4" />
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>Rp {formatCurrency(subtotal)}</span></div>
            {/* <div className="flex justify-between text-sm"><span>Tax (10%)</span><span>Rp {formatCurrency(Math.round(subtotal * taxRate))}</span></div> */}
            <hr className="my-4" />
            <div className="flex justify-between font-semibold text-base"><span>Total</span><span>Rp {formatCurrency(total)}</span></div>
          </div>          {/* Payment Method and Phone Number Column */}
          <div className="mt-6 lg:mt-0 lg:pl-6 space-y-4">
            {title !== 'Trial' && (
              <>
                <div>
                  <label className="block font-medium mb-3">Payment Method</label>
                  {total < 25000 && (
                    <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        💡 Virtual Account payments require minimum Rp 25,000
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2 lg:grid-cols-2 lg:gap-3">
                    {PAYMENT_METHODS.map((method) => {
                      const isAvailable = isPaymentMethodAvailable(method.id);
                      return (
                        <label key={method.id} className={`flex flex-col lg:flex-row items-center lg:space-x-3 p-3 border rounded-lg transition-colors ${
                          !isAvailable 
                            ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50' 
                            : paymentMethod === method.id 
                              ? 'border-blue-500 bg-blue-50 cursor-pointer' 
                              : 'border-gray-200 hover:bg-gray-50 cursor-pointer'
                        }`}>
                          <input
                            type="radio"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            disabled={!isAvailable}
                            className="w-4 h-4 text-blue-600 mb-2 lg:mb-0 lg:flex-shrink-0 disabled:opacity-50"
                          />
                          <Image
                            src={method.image}
                            alt={method.name}
                            width={48}
                            height={32}
                            className="flex-shrink-0"
                          />
                          <span className="hidden lg:block lg:flex-1 text-sm">{method.name}</span>
                          {!isAvailable && (
                            <span className="hidden lg:block text-xs text-red-500">Min. Rp 25,000</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2" htmlFor="phoneNumber">
                    Phone Number *
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 081234567890"
                    className={`w-full border rounded px-3 py-2 text-sm ${
                      !phoneNumber.trim() && phoneNumber !== '' 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-1 focus:ring-opacity-50`}
                    required
                  />
                  {!phoneNumber.trim() && phoneNumber !== '' && (
                    <p className="text-red-500 text-xs mt-1">Phone number is required</p>
                  )}
                </div>
              </>
            )}

            {title === 'Trial' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">🎉 Free Trial Package</h3>
                <p className="text-sm text-green-700">
                  You've selected the Trial package. No payment is required! 
                  Click the button below to activate your 14-day free trial.
                </p>
              </div>
            )}

            <Button 
              className="w-full" 
              onClick={handleContinue} 
              disabled={loading || (title !== 'Trial' && !phoneNumber.trim())}
            >
              {loading ? 'Processing...' : title === 'Trial' ? 'Activate Free Trial' : 'Continue to Payment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
