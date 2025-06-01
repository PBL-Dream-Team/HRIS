'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
      <p className="text-gray-700 mb-6">Thank you! Your payment was processed successfully.</p>
      <Button onClick={() => router.push('/redirect')}>Go To Dashboard</Button>
    </div>
  );
}
