'use client';
import { useEffect, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';

function PaymentFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentDetail, setPaymentDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const ref = searchParams.get('ref');

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      if (!ref) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await api.get(`/api/payment/detail/${ref}`);
        setPaymentDetail(response.data);
      } catch (error) {
        console.error('Error fetching payment detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetail();
  }, [ref]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="max-w-md w-full bg-white border rounded-lg p-6 shadow-sm">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Failed
        </h1>
        <p className="text-gray-700 mb-6">
          Unfortunately, your payment could not be completed. Please try again.
        </p>
        
        {paymentDetail && (
          <div className="bg-red-50 rounded-lg p-4 mb-6 text-left text-sm">
            <h3 className="font-semibold mb-3">Payment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Reference:</span>
                <span className="font-mono text-xs">{paymentDetail.reference}</span>
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
                <span className="font-semibold text-red-600">{paymentDetail.status}</span>
              </div>
              {paymentDetail.expired_time && (
                <div className="flex justify-between">
                  <span>Expired:</span>
                  <span className="text-xs">
                    {new Date(paymentDetail.expired_time * 1000).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/pricing')}
            className="w-full"
          >
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/signin')}
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
