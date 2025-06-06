'use client';

import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FaqSection() {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Left: Image */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-xl aspect-[16/9]">
          <Image
            src="https://images.pexels.com/photos/5428833/pexels-photo-5428833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="FAQ Illustration"
            fill
            className="rounded-xl object-cover shadow-lg"
          />
        </div>
      </div>

      {/* Right: FAQ Content */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Find answers to common questions about our platform.
        </p>

        <Accordion type="single" collapsible className="text-left space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What is an HRIS and why is it important for companies?
            </AccordionTrigger>
            <AccordionContent>
              An HRIS is a digital system that helps manage employee data,
              attendance, leave, payroll, and more efficiently.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              Is this platform suitable for small businesses?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely! Our system is flexible and scalable for businesses of all sizes.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              Can I try it before subscribing?
            </AccordionTrigger>
            <AccordionContent>
              Yes, you can try it for free for 14 days with no credit card required.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              How is employee data security handled?
            </AccordionTrigger>
            <AccordionContent>
              We use encryption and best security practices to protect your data.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
