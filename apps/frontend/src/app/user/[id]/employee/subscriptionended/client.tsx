'use client';

import { useRouter } from 'next/navigation';
import { LogOut, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

type SubscriptionEndedClientProps = {
  isAdmin: boolean;
};

export default function SubscriptionEndedClient({ isAdmin }: SubscriptionEndedClientProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await api.post('/api/auth/logout', {
        withCredentials: true,
      });
      alert(res.data.message);
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-center px-4">
      {/* Icon alert di atas judul */}
      <AlertCircle className="h-16 w-16 text-[#1E3A5F] mb-4" />

      <h1 className="text-3xl font-bold text-[#1E3A5F] mb-4">Subscription Ended</h1>
      <p className="text-lg text-gray-700 max-w-lg ">
        Masa aktif sistem HR Anda telah berakhir.
      </p>
      <p className="text-lg text-gray-700 max-w-lg mb-6">
        Silakan hubungi administrator untuk memperpanjang langganan.
      </p>
        

      {/* Tombol logout berwarna biru kustom */}
      <Button
        onClick={handleLogout}
        className="bg-[#1E3A5F] hover:bg-[#16324d] text-white"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </main>
  );
}
