'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Payment Failed 😢
      </h1>
      <p className="text-gray-700 mb-6">
        Unfortunately, your payment could not be completed.
      </p>
      <Button onClick={() => router.push('/pricing')}>Try Again</Button>
    </div>
  );
}
