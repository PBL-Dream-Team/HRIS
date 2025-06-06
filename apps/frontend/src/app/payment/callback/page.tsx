'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const status = searchParams.get('status'); // success atau failed
    const tripayReference = searchParams.get('tripay_reference');

    // Use tripay_merchant_ref as the main reference, fallback to tripay_reference
    const ref = tripayReference;

    if (status === 'success') {
      const successUrl = ref ? `/payment/success?ref=${ref}` : '/payment/success';
      router.replace(successUrl);
    } else {
      const failedUrl = ref ? `/payment/failed?ref=${ref}` : '/payment/failed';
      router.replace(failedUrl);
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl text-gray-600">Processing your payment result...</p>
    </div>
  );
}