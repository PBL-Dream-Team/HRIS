import Navbar from "@/components/landingpage/Navbar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { PricingSection } from "@/components/landingpage/PricingSection";
import { HowToUseSection } from "@/components/landingpage/HowToUseSection";
import { TestimonialSection } from "@/components/landingpage/TestimonialSection";
import { FaqSection } from "@/components/landingpage/FAQSection";
import { Footer } from "@/components/landingpage/Footer";


export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Sections like #feature, #pricing, etc */}

        <section className="bg-[#F9FAFB] py-24 px-4 md:px-8" id="hero">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            {/* Textual content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Solusi HRIS Modern untuk Manajemen SDM yang Efisien
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Kelola absensi, cuti, payroll, dan semua kebutuhan SDM dalam satu platform yang mudah digunakan dan hemat waktu.
              </p>
              <Link href="/signup">
                <Button size="lg" className="text-lg px-6 py-4">
                  Coba Gratis Sekarang
                </Button>
              </Link>
            </div>

            {/* Illustration or Image */}
            <div className="flex justify-center">
              <Image
                src="/images/hris-illustration.png"
                alt="Ilustrasi HRIS"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Feature Section */}

        <section id="feature" className="py-24 bg-white px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan HRIS Kami
            </h2>
            <p className="text-gray-600 text-lg mb-12">
              Solusi lengkap untuk mengelola seluruh kebutuhan sumber daya manusia dalam satu platform.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              <Card className="p-6 text-center transition-shadow hover:shadow-lg">
                <div className="mb-4 text-[#1E3A5F]">
                  <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M5.121 17.804A4 4 0 0 1 3 14.618V11a9 9 0 1 1 18 0v3.618a4 4 0 0 1-2.121 3.186l-4.379 2.19a4 4 0 0 1-3.999 0l-4.38-2.19z" />
                  </svg>
                </div>
                <CardContent>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Employee Management</h3>
                  <p className="text-gray-600 text-sm">
                    Kelola data karyawan secara terpusat, mulai dari biodata hingga riwayat jabatan dan status aktif.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center transition-shadow hover:shadow-lg">
                <div className="mb-4 text-[#1E3A5F]">
                  <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 0 0 2-2v-6H3v6a2 2 0 0 0 2 2z" />
                  </svg>
                </div>
                <CardContent>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Attendance</h3>
                  <p className="text-gray-600 text-sm">
                    Rekam kehadiran karyawan dengan sistem check-in/out online, terintegrasi dengan lokasi dan waktu.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center transition-shadow hover:shadow-lg">
                <div className="mb-4 text-[#1E3A5F]">
                  <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M4 4h16v16H4zM4 8h16M8 4v16" />
                  </svg>
                </div>
                <CardContent>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Document Management</h3>
                  <p className="text-gray-600 text-sm">
                    Unggah, arsipkan, dan kelola dokumen penting seperti kontrak kerja, surat cuti, dan lainnya.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center flex-wrap gap-8">
              <Card className="p-6 text-center w-full max-w-sm transition-shadow hover:shadow-lg">
                <div className="mb-4 text-[#1E3A5F]">
                  <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M17 9V7a5 5 0 0 0-10 0v2M5 11h14v10H5z" />
                  </svg>
                </div>
                <CardContent>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Subscription & Payments</h3>
                  <p className="text-gray-600 text-sm">
                    Kelola paket berlangganan perusahaan dan lakukan pembayaran dengan sistem yang aman dan transparan.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center w-full max-w-sm transition-shadow hover:shadow-lg">
                <div className="mb-4 text-[#1E3A5F]">
                  <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M3 3v18h18M9 17V9m4 8V5m4 12v-6" />
                  </svg>
                </div>
                <CardContent>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Employee Statistics</h3>
                  <p className="text-gray-600 text-sm">
                    Visualisasi data karyawan seperti performa, absensi, dan distribusi jabatan dalam grafik yang informatif.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        {/*Pricing Section*/}

        <section id="pricing" className="py-24 px-4 md:px-8 bg-[#F9FAFB]">
          <PricingSection />
        </section>


        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-4 md:px-8 bg-white">
          <HowToUseSection />
        </section>

        {/* Testimonial Section */}
        <section id="testimonials" className="py-24 px-4 md:px-8 bg-[#F9FAFB]">
          <TestimonialSection />
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 px-4 md:px-8 bg-white">
          <FaqSection />
        </section>

        <Footer />

      </main>
    </>
  )
}
