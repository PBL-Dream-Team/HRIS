'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const HeroSection = () => {
    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            {/* Textual content */}
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Solusi HRIS Modern untuk Manajemen SDM yang Efisien
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Kelola Karyawan, absensi, dokumen, dan semua kebutuhan SDM dalam satu platform yang mudah digunakan dan hemat waktu.
                </p>
                <Link href="/signup">
                    <Button size="lg" className="text-lg px-6 py-4">
                        Coba Gratis Sekarang
                    </Button>
                </Link>
            </div>

            {/* Illustration */}
            <div className="flex justify-center">
                <Image
                    src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Ilustrasi HRIS"
                    width={500}
                    height={400}
                    className="rounded-xl shadow-lg"
                />
            </div>
        </div>
    );
};
