'use client'

import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FaqSection() {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Left: Image */}
      <div className="flex justify-center">
        <Image
          src="/images/faq-illustration.png" // Ganti sesuai gambar kamu
          alt="FAQ Illustration"
          width={500}
          height={400}
          className="rounded-xl shadow-lg"
        />
      </div>

      {/* Right: FAQ Content */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Temukan jawaban atas pertanyaan umum seputar platform kami.
        </p>

        <Accordion type="single" collapsible className="text-left space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Apa itu HRIS dan mengapa penting untuk perusahaan?
            </AccordionTrigger>
            <AccordionContent>
              HRIS adalah sistem digital yang membantu mengelola data karyawan,
              absensi, cuti, payroll, dan lainnya secara efisien.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              Apakah platform ini cocok untuk UKM?
            </AccordionTrigger>
            <AccordionContent>
              Sangat cocok! Sistem kami fleksibel dan scalable untuk berbagai
              ukuran bisnis.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              Apakah saya bisa mencoba sebelum berlangganan?
            </AccordionTrigger>
            <AccordionContent>
              Ya, Anda bisa mencoba secara gratis selama 14 hari tanpa kartu
              kredit.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              Bagaimana dengan keamanan data karyawan?
            </AccordionTrigger>
            <AccordionContent>
              Kami menggunakan enkripsi dan praktik keamanan terbaik untuk
              melindungi data Anda.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
