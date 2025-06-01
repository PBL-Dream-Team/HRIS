'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const status = searchParams.get('status'); // success atau failed

    if (status === 'success') {
      router.replace('/payment/success');
    } else {
      router.replace('/payment/failed');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl text-gray-600">Processing your payment result...</p>
    </div>
  );
}
