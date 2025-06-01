import Navbar from '@/components/landingpage/Navbar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import PricingSection from '@/components/landingpage/PricingSection';
import { HowToUseSection } from '@/components/landingpage/HowToUseSection';
import { TestimonialSection } from '@/components/landingpage/TestimonialSection';
import { FaqSection } from '@/components/landingpage/FAQSection';
import { Footer } from '@/components/landingpage/Footer';
import { HeroSection } from '@/components/landingpage/HeroSection';
import { FeatureSection } from '@/components/landingpage/FeatureSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Sections like #feature, #pricing, etc */}

        {/* Hero Section */}
        <section className="bg-[#F9FAFB] py-24 px-4 md:px-8" id="hero">
          <HeroSection />
        </section>

        {/* Feature Section */}

        <section id="feature" className="py-24 bg-white px-4 md:px-8">
          <FeatureSection />
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
  );
}
