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
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-md w-full text-center text-black border rounded-lg p-6 shadow-sm">
        <div className="text-yellow-500 text-6xl mb-4">⏳</div>
        <h2 className="text-xl font-bold mb-4">Payment Pending</h2>
        <p className="text-gray-600 mb-6">
          Your payment is being processed. Please complete the payment to continue.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm">
          <h3 className="font-semibold mb-3">Payment Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Reference:</span>
              <span className="font-mono text-xs">{paymentDetail.reference}</span>
            </div>
            <div className="flex justify-between">
              <span>Merchant Ref:</span>
              <span className="font-mono text-xs">{paymentDetail.merchant_ref}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span>Rp {paymentDetail.amount?.toLocaleString()}</span>
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
              <span className="text-xs">
                {new Date(paymentDetail.expired_time * 1000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {paymentDetail.order_items && paymentDetail.order_items.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm">
            <h3 className="font-semibold mb-3">Order Items</h3>
            {paymentDetail.order_items.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>@Rp {item.price.toLocaleString()}</span>
                  <span>Rp {item.subtotal.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {paymentDetail.instructions && paymentDetail.instructions.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left text-sm">
            <h3 className="font-semibold mb-3">Payment Instructions</h3>
            {paymentDetail.instructions.map((instruction, index) => (
              <div key={index}>
                <h4 className="font-medium mb-2">{instruction.title}</h4>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  {instruction.steps.map((step, stepIndex) => (
                    <li key={stepIndex} dangerouslySetInnerHTML={{ __html: step }} />
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {(paymentDetail.pay_url || paymentDetail.checkout_url) && (
            <Button 
              onClick={openPaymentUrl}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Complete Payment
            </Button>
          )}
          <Button 
            onClick={checkStatus} 
            disabled={checking}
            variant="outline"
            className="w-full"
          >
            {checking ? 'Checking...' : 'Check Status'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          Payment Ref: {ref}
        </p>
      </div>
    </div>
  );
}