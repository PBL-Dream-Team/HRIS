'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Andi Pratama',
    position: 'HR Manager di PT. Maju Sejahtera',
    message:
      'Sistem HRIS ini benar-benar memudahkan pekerjaan saya dalam mengelola absensi dan data karyawan. UI-nya intuitif dan tim support sangat responsif!',
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    name: 'Sinta Wulandari',
    position: 'CEO Startup Tech',
    message:
      'Kami menghemat banyak waktu dan biaya operasional sejak menggunakan platform ini. Sangat recommended untuk perusahaan berkembang.',
    image: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    name: 'Budi Santoso',
    position: 'Staff HR di CV Kreatif',
    message:
      'Fitur payroll dan dokumentasi karyawan sangat membantu dan terintegrasi dengan baik. Keren banget!',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export function TestimonialSection() {
  return (
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Apa Kata Mereka?
      </h2>
      <p className="text-gray-600 text-lg mb-12">
        HR dari berbagai perusahaan telah merasakan manfaatnya.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <Card
            key={index}
            className="p-6 text-left hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={t.image}
                alt={t.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800">{t.name}</p>
                <p className="text-sm text-gray-500">{t.position}</p>
              </div>
            </div>
            <CardContent className="p-0 text-sm text-gray-700">
              “{t.message}”
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
