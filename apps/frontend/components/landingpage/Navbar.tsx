"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
    { label: "Feature", href: "#feature" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Testimonial", href: "#testimonial" },
    { label: "FAQ", href: "#faq" },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="w-full bg-white shadow-md fixed top-0 z-50 h-[64px]">
            <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 h-full">
                    <Image src="/images/logo.png" alt="HRIS Logo" width={70} height={50} />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center h-full space-x-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="h-full flex items-center px-4 text-lg font-medium text-gray-800 transition-colors hover:bg-[#1E3A5F] hover:text-white"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link href="/signup">
                        <Button className="ml-4 text-lg">Try It Now</Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-4 pb-4 space-y-2 bg-white">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="block text-sm text-gray-800 px-4 py-2 rounded-md transition-colors hover:bg-[#1E3A5F] hover:text-white"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link href="/signup">
                        <Button className="w-full mt-2">Try It Now</Button>
                    </Link>
                </div>
            )}
        </nav>
    )
}
