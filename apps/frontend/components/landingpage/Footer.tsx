import Link from "next/link"
import Image from "next/image"

export function Footer() {
    return (
        <footer className="bg-[#1E3A5F] text-white py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand & Description */}
                <div>
                    <div className="w-32 h-16 bg-white rounded-lg flex items-center justify-center mb-4">
                        <Image
                            src="/images/logo.png" // Ganti jika path-nya berbeda
                            alt="Logo HRIS"
                            width={80}
                            height={30}
                            className="object-contain"
                        />
                    </div>
                    <p className="text-sm text-gray-300">
                        Solusi manajemen SDM modern untuk meningkatkan efisiensi dan produktivitas perusahaan Anda.
                    </p>
                </div>

                {/* Menu */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Menu</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link href="#feature" className="hover:underline">Fitur</Link></li>
                        <li><Link href="#pricing" className="hover:underline">Harga</Link></li>
                        <li><Link href="#faq" className="hover:underline">FAQ</Link></li>
                    </ul>
                </div>

                {/* Bantuan */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Bantuan</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link href="/contact" className="hover:underline">Hubungi Kami</Link></li>
                        <li><Link href="/support" className="hover:underline">Pusat Bantuan</Link></li>
                        <li><Link href="/privacy" className="hover:underline">Kebijakan Privasi</Link></li>
                    </ul>
                </div>

                {/* Newsletter / CTA */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Dapatkan Update</h3>
                    <p className="text-sm text-gray-300 mb-3">
                        Berlangganan untuk info produk dan penawaran spesial.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Email kamu"
                            className="px-4 py-2 rounded-md border-white text-white bg-transparent placeholder:text-white w-full border"
                        />
                        <button
                            type="submit"
                            className="bg-white text-[#1E3A5F] font-semibold px-4 py-2 rounded-md hover:bg-gray-100"
                        >
                            Langganan
                        </button>
                    </form>
                </div>
            </div>

            <div className="border-t border-gray-600 mt-10 pt-6 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} HRIS. All rights reserved.
            </div>
        </footer>
    )
}
