'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

interface PaymentDetail {
  reference: string;
  merchant_ref: string;
  status: string;
  amount: number;
  payment_method: string;
  payment_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pay_url: string;
  checkout_url: string;
  expired_time: number;
  order_items: Array<{
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  instructions: Array<{
    title: string;
    steps: string[];
  }>;
}

export default function PaymentPendingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = searchParams.get('ref');

  const fetchPaymentDetail = async () => {
    if (!ref) return;
    
    try {
      const response = await api.get(`/api/payment/detail/${ref}`);
      // API returns data directly, not nested in data.data.data
      setPaymentDetail(response.data);
    } catch (error) {
      console.error('Error fetching payment detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!ref) return;
    
    setChecking(true);
    try {
      const response = await api.get(`/api/payment/check-status/${ref}`);
      
      // Check the status field directly from response
      if (response.data.status === 'PAID') {
        router.replace('/payment/success');
      } else if (response.data.status === 'EXPIRED' || response.data.status === 'FAILED') {
        router.replace('/payment/failed?ref=' + ref);
      } else if (response.data.status === 'UNPAID') {
        // Refresh payment detail for UNPAID status
        fetchPaymentDetail();
      } else {
        alert(`Payment status: ${response.data.status}. Please wait or try again later.`);
        fetchPaymentDetail();
      }
    } catch (error) {
      console.error('Error checking status:', error);
      alert('Error checking payment status');
    } finally {
      setChecking(false);
    }
  };

  const openPaymentUrl = () => {
    if (paymentDetail?.pay_url) {
      window.open(paymentDetail.pay_url, '_blank');
    } else if (paymentDetail?.checkout_url) {
      window.open(paymentDetail.checkout_url, '_blank');
    }
  };

  useEffect(() => {
    fetchPaymentDetail();
    
    // Auto check status every 30 seconds
    const interval = setInterval(() => {
      checkStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [ref]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!paymentDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Payment details not found</p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="text-yellow-500 text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold mb-4 text-black">Payment Pending</h2>
          <p className="text-gray-600">
            Your payment is being processed. Please complete the payment to continue.
          </p>
        </div>

        {/* Desktop: 2 Column Layout, Mobile: Single Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Details & Order Items */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 text-black border shadow-sm">
              <h3 className="font-semibold mb-4 text-lg">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Reference:</span>
                  <span className="font-mono text-sm">{paymentDetail.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span>Merchant Ref:</span>
                  <span className="font-mono text-sm">{paymentDetail.merchant_ref}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">Rp {paymentDetail.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span>{paymentDetail.payment_name || paymentDetail.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-semibold ${
                    paymentDetail.status === 'PAID' ? 'text-green-600' :
                    paymentDetail.status === 'UNPAID' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {paymentDetail.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Expires:</span>
                  <span className="text-sm">
                    {new Date(paymentDetail.expired_time * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {paymentDetail.order_items && paymentDetail.order_items.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 text-black border shadow-sm">
                <h3 className="font-semibold mb-4 text-lg">Order Items</h3>
                <div className="space-y-4">
                  {paymentDetail.order_items.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm">x{item.quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>@Rp {item.price.toLocaleString()}</span>
                        <span className="font-medium">Rp {item.subtotal.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile: Action Buttons */}
            <div className="lg:hidden bg-white rounded-lg p-6 border shadow-sm">
              <div className="space-y-4">
                {(paymentDetail.pay_url || paymentDetail.checkout_url) && (
                  <Button 
                    onClick={openPaymentUrl}
                    className="w-full bg-[#1E3A5F] hover:bg-[#1E3A5F]/80 text-white py-3"
                    size="lg"
                  >
                    Complete Payment
                  </Button>
                )}
                <Button 
                  onClick={checkStatus} 
                  disabled={checking}
                  variant="outline"
                  className="w-full py-3"
                  size="lg"
                >
                  {checking ? 'Checking...' : 'Check Status'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3"
                  size="lg"
                >
                  Back to Dashboard
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-6 text-center">
                Payment Ref: {ref}
              </p>
            </div>
          </div>

          {/* Right Column - Payment Instructions */}
          <div className="space-y-6">
            {paymentDetail.instructions && paymentDetail.instructions.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-6 text-black border shadow-sm">
                <h3 className="font-semibold mb-4 text-lg">Payment Instructions</h3>
                <div className="space-y-4">
                  {paymentDetail.instructions.map((instruction, index) => (
                    <div key={index}>
                      <h4 className="font-medium mb-3 text-blue-800">{instruction.title}</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        {instruction.steps.map((step, stepIndex) => (
                          <li key={stepIndex} dangerouslySetInnerHTML={{ __html: step }} />
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop: Action Buttons */}
        <div className="hidden lg:block mt-8">
          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {(paymentDetail.pay_url || paymentDetail.checkout_url) && (
                <Button 
                  onClick={openPaymentUrl}
                  className="flex-1 bg-[#1E3A5F] hover:bg-[#1E3A5F]/80 text-white py-4"
                  size="lg"
                >
                  Complete Payment
                </Button>
              )}
              <Button 
                onClick={checkStatus} 
                disabled={checking}
                variant="outline"
                className="flex-1 py-4"
                size="lg"
              >
                {checking ? 'Checking...' : 'Check Status'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="flex-1 py-4"
                size="lg"
              >
                Back to Dashboard
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-6 text-center">
              Payment Ref: {ref}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}