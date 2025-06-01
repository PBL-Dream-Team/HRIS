'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  CalendarDays,
  FileText,
  CreditCard,
  BarChart2,
} from 'lucide-react';

export const FeatureSection = () => {
  const features = [
    {
      title: 'Employee Management',
      desc: 'Kelola data karyawan secara terpusat, mulai dari biodata hingga riwayat jabatan dan status aktif.',
      icon: Users,
    },
    {
      title: 'Attendance',
      desc: 'Rekam kehadiran karyawan dengan sistem check-in/out online, terintegrasi dengan lokasi dan waktu.',
      icon: CalendarDays,
    },
    {
      title: 'Document Management',
      desc: 'Unggah, arsipkan, dan kelola dokumen penting seperti kontrak kerja, surat cuti, dan lainnya.',
      icon: FileText,
    },
  ];

  const additionalFeatures = [
    {
      title: 'Subscription & Payments',
      desc: 'Kelola paket berlangganan perusahaan dan lakukan pembayaran dengan sistem yang aman dan transparan.',
      icon: CreditCard,
    },
    {
      title: 'Employee Statistics',
      desc: 'Visualisasi data karyawan seperti performa, absensi, dan distribusi jabatan dalam grafik yang informatif.',
      icon: BarChart2,
    },
  ];

  return (
    <section id="feature" className="py-24 bg-white px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Fitur Unggulan HRIS Kami
        </h2>
        <p className="text-gray-600 text-lg mb-12">
          Solusi lengkap untuk mengelola seluruh kebutuhan sumber daya manusia dalam satu platform.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {features.map(({ title, desc, icon: Icon }, i) => (
            <Card key={i} className="p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mb-4 text-[#1E3A5F]">
                <Icon className="w-10 h-10 mx-auto" />
              </div>
              <CardContent>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center flex-wrap gap-8">
          {additionalFeatures.map(({ title, desc, icon: Icon }, i) => (
            <Card key={i} className="p-6 text-center w-full max-w-sm transition-shadow hover:shadow-lg">
              <div className="mb-4 text-[#1E3A5F]">
                <Icon className="w-10 h-10 mx-auto" />
              </div>
              <CardContent>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
