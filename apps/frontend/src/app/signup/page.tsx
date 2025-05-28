'use client';

import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function HrSignUpPage() {
  const [checked, setChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await api.post('/api/auth/signup', {
        name: formData.name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(res.data.message || 'Sign up successful!');
    } catch (error: any) {
      console.error(error);
      toast.error("Sign up failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center relative">
        <Image
          src="https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Office"
          fill
          className="object-cover"
        />
        {/* Overlay transparan biru */}
        <div className="absolute inset-0 bg-[#1E3A5F] opacity-60 z-10" />
      </div>



      {/* Right Side - Form */}
      <div className="bg-white flex flex-col justify-center w-full md:w-1/2 p-8">
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Image
              src="/images/logo.png"
              alt="HRIS Logo"
              width={100}
              height={48}
              className="object-contain"
            />
          </div>

          <h2 className="text-2xl font-bold mb-2 text-[#1E3A5F]">Sign Up</h2>
          <p className="mb-6 text-gray-600 text-sm">
            Create your account and streamline your employee management.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="w-full">
              <Label htmlFor="name" className="text-[#1E3A5F] mb-2">
                Company Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your company name"
                className="text-gray-700 border-zinc-600"
              />
            </div>
            {/* First and Last Name */}
            <div className="flex gap-4">
              <div className="w-full">
                <Label htmlFor="first_name" className="text-[#1E3A5F] mb-2">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="text-gray-700 border-zinc-600"
                />
              </div>

              <div className="w-full">
                <Label htmlFor="last_name" className="text-[#1E3A5F] mb-2">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="text-gray-700 border-zinc-600"
                />
              </div>
            </div>

            {/* Email */}
            <div className="w-full">
              <Label htmlFor="email" className="text-[#1E3A5F] mb-2">
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email address"
                className="text-gray-700 border-zinc-600"
              />
            </div>

            {/* Password */}
            <div className="w-full">
              <Label htmlFor="password" className="text-[#1E3A5F] mb-2">
                Password
              </Label>
              <Input
                id="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Enter your password"
                className="text-gray-700 border-zinc-600"
              />
            </div>

            {/* Confirm Password */}
            <div className="w-full">
              <Label htmlFor="confirmPassword" className="text-[#1E3A5F] mb-2">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="Re-enter your password"
                className="text-gray-700 border-zinc-600"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2 text-sm">
              <Checkbox
                id="terms"
                checked={checked}
                onCheckedChange={(val) => setChecked(Boolean(val))}
                className="data-[state=checked]:bg-[#1E3A5F] data-[state=checked]:border-[#1E3A5F]"
              />{' '}
              <span>I agree with the</span>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-sm text-gray-700 underline"
                  >
                    terms of use of HRIS
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-scroll">
                  <DialogHeader>
                    <DialogTitle>Terms of Use</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Ini adalah isi Terms of Use HRIS.
                      <br />
                      <br />
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Molestias ut facere blanditiis. Dolor quidem accusamus
                      quos facilis? Maxime, dolorum! Nam quos ex voluptates
                      obcaecati, provident earum assumenda dolore, ut sequi
                      repudiandae ipsam suscipit! Repellendus ab temporibus
                      quam. Cum nihil voluptates vero, sequi maxime, reiciendis
                      natus eveniet quam itaque laborum doloribus a qui vel id
                      odio nobis expedita! Enim, culpa quod iste quidem aut
                      iusto aliquam nobis ullam veritatis libero mollitia.
                      Facere illo odit eaque consectetur quidem aperiam
                      voluptatibus molestiae, totam sint illum dolores vero
                      animi neque? Ratione adipisci, dicta impedit neque
                      expedita doloremque sequi consectetur similique vel
                      laudantium minus incidunt. Porro mollitia minima, eius
                      iure, dicta a, accusantium neque unde ducimus quas fugiat
                      ullam vitae! Perspiciatis dicta soluta est cum officia
                      illo ab facere, suscipit fugit illum. Labore, explicabo
                      deserunt? Blanditiis beatae, fugiat quas reiciendis quo
                      nisi, nostrum nobis consequatur ducimus iste a veritatis
                      corrupti provident alias quod tempora laborum veniam
                      cupiditate reprehenderit possimus dicta! Nemo, tempora
                      voluptas ex facere a nobis voluptatem quas vel ab
                      temporibus unde nihil laudantium tenetur ullam eius illum
                      iure, quis veritatis fugiat, voluptates commodi autem
                      dolores. Labore cum, nisi necessitatibus est, ipsam
                      veritatis porro aspernatur sunt eligendi similique
                      inventore quisquam itaque culpa odit molestias. Architecto
                      laboriosam tenetur, molestiae inventore aut delectus
                      pariatur repellendus, ad corporis veniam illo voluptatum,
                      repellat facere. Porro perspiciatis pariatur velit
                      deserunt ullam, amet autem molestias blanditiis ratione,
                      adipisci architecto? Reprehenderit nesciunt incidunt
                      voluptatem debitis vitae odio a doloremque temporibus
                      obcaecati odit molestias aliquid, officiis quam
                      consectetur ducimus dicta aliquam. Libero possimus numquam
                      qui, itaque necessitatibus ducimus quae impedit eum animi
                      cupiditate ab sequi? Necessitatibus exercitationem at,
                      repellat vitae et consequatur eius rem quaerat magni quasi
                      voluptatum mollitia deserunt praesentium, maiores fugit
                      nihil voluptates vero dolorem ipsa corrupti totam
                      possimus! Culpa odit alias fugit, in accusantium dolores,
                      laborum ea praesentium nesciunt ex reiciendis impedit
                      doloribus. Sapiente, ipsa. Accusamus explicabo blanditiis
                      pariatur dolor. Similique ab reiciendis neque nesciunt
                      temporibus quia, beatae facere ex corporis omnis maxime
                      minima libero aliquid hic tenetur, dolore molestias
                      cupiditate eos? Provident aliquid, natus voluptate iure
                      accusamus aspernatur, libero molestiae eveniet unde earum
                      eius perspiciatis. Sunt, magnam quaerat! In ipsum a
                      corrupti similique, deserunt tempore, harum id, deleniti
                      nisi nulla adipisci laborum laboriosam quaerat porro.
                      Laboriosam aliquam eum itaque similique delectus suscipit
                      necessitatibus sapiente illum culpa aspernatur a magni
                      vero eaque totam quibusdam rem, dolore fugiat esse modi
                      consequuntur corrupti! Dolor ad mollitia deserunt a
                      tempore expedita accusamus voluptas unde laborum commodi
                      beatae laudantium, deleniti eos aliquam. Facere a nam
                      temporibus voluptatibus. Autem assumenda eaque mollitia,
                      vitae pariatur perferendis maxime in velit tempore minus
                      deleniti consequatur quae blanditiis tempora nam.
                      Distinctio veritatis labore quos et quasi iusto voluptas
                      sit, perspiciatis laboriosam, itaque maiores explicabo
                      facere animi voluptatem ducimus cumque magni saepe, sint
                      molestias maxime enim culpa temporibus. Laudantium et nisi
                      cumque impedit. Rem, labore? Culpa dolores fuga harum
                      blanditiis sed aliquam, quod voluptatem magni nisi magnam
                      soluta a quibusdam quidem. Magnam, dicta rerum in, velit
                      optio delectus accusamus est sed corrupti placeat pariatur
                      sequi accusantium error at odit.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            {/* Buttons */}
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-[#1E3A5F]"
              disabled={!checked}
            >
              Sign Up
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center gap-2 "
            >
              <Image
                src="/images/google.png"
                alt="Google"
                width={20}
                height={20}
                className="object-contain"
              />
              <span>Sign up with Google</span>
            </Button>

            {/* Link to Sign In */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link href="/signin" className="text-[#1E3A5F] hover:underline">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
