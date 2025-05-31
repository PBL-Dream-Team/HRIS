'use client'

import { Card, CardContent } from "@/components/ui/card"
import { BadgeCheck, Clock, Settings } from "lucide-react"

const steps = [
  {
    title: "1. Daftar & Buat Akun",
    description: "Mulai dengan mendaftarkan perusahaan Anda dan buat akun admin HR.",
    icon: <BadgeCheck className="w-10 h-10 text-[#1E3A5F]" />,
  },
  {
    title: "2. Tambah Karyawan",
    description: "Import data karyawan secara manual atau melalui file Excel dalam hitungan detik.",
    icon: <Settings className="w-10 h-10 text-[#1E3A5F]" />,
  },
  {
    title: "3. Mulai Gunakan Fitur",
    description: "Kelola absensi, cuti, payroll, dan lainnya langsung dari dashboard Anda.",
    icon: <Clock className="w-10 h-10 text-[#1E3A5F]" />,
  },
]

export function HowToUseSection() {
  return (
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Bagaimana Cara Kerjanya?
      </h2>
      <p className="text-gray-600 text-lg mb-12">
        Hanya butuh beberapa langkah sederhana untuk mulai mengelola SDM Anda dengan efisien.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 flex justify-center">
              {step.icon}
            </div>
            <CardContent>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
