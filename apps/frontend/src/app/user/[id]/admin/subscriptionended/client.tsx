'use client';

import { useRouter } from 'next/navigation';
import { LogOut, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

type SubscriptionEndedClientProps = {
  isAdmin: boolean;
};

export default function SubscriptionEndedClient({
  isAdmin,
}: SubscriptionEndedClientProps) {
  const router = useRouter();

  const handleGoToPricing = () => {
    router.push('/pricing');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-center px-4">
      {/* Icon alert di atas judul */}
      <AlertCircle className="h-16 w-16 text-[#1E3A5F] mb-4" />

      <h1 className="text-3xl font-bold text-[#1E3A5F] mb-4">
        Subscription Ended
      </h1>
      <p className="text-lg text-gray-700 max-w-lg">
        Masa aktif sistem HR Anda telah berakhir.
      </p>
      <p className="text-lg text-gray-700 mb-6">
        Silakan memperpanjang langganan.
      </p>

      {/* Tombol menuju halaman pricing */}
      <Button
        onClick={handleGoToPricing}
        className="bg-[#1E3A5F] hover:bg-[#16324d] text-white"
      >
        Perpanjang Sekarang
      </Button>
    </main>
  );
}
