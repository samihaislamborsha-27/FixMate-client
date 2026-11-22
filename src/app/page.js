import Link from "next/link";
import {
  Wrench, Snowflake, Box, Waves, Monitor,
  ShieldCheck, Clock3, Users, ArrowRight, CheckCircle2
} from "lucide-react";

const services = [
  { name: "AC Repair", description: "Cooling, servicing and maintenance", Icon: Snowflake },
  { name: "Refrigerator Repair", description: "Fridge diagnosis and repair", Icon: Box },
  { name: "Washing Machine", description: "Laundry appliance repair", Icon: Waves },
  { name: "Computer Repair", description: "Desktop and laptop support", Icon: Monitor },
];

const benefits = [
  { title: "Trusted Professionals", description: "Connect with technicians for your repair needs.", Icon: ShieldCheck },
  { title: "Simple Booking", description: "Request a repair through an easy booking process.", Icon: Clock3 },
  { title: "Customer First", description: "Keep your service requests organized in one place.", Icon: Users },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-blue-700">
            FixMate<span className="text-orange-500">.</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <Link href="/" className="hover:text-blue-700">Home</Link>
            <a href="#services" className="hover:text-blue-700">Services</a>
            <a href="#about" className="hover:text-blue-700">Why FixMate</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="px-2 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700">
              Sign in
            </Link>
            <Link href="/register" className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 px-5 py-20 text-white md:px-8 md:py-28">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-300">
              <Wrench size={15} /> Your trusted repair partner
            </div>

            <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
              Home repairs,
              <span className="block text-orange-400">made simple.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-blue-100 md:text-lg">
              Find skilled technicians for your home appliances and devices.
              Request repair services and manage your bookings with FixMate.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-600">
                Book a Service <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">
                Sign In
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-100">
              <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-green-400" /> Easy booking</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-green-400" /> Skilled technicians</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-8">
            <div className="mb-7 flex items-center gap-4">
              <div className="rounded-2xl bg-orange-500 p-4">
                <Wrench size={30} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">FixMate Services</h2>
                <p className="mt-1 text-sm text-blue-100">The right help for your home.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {services.map(({ name, description, Icon }) => (
                <div key={name} className="rounded-2xl border border-white/10 bg-white/10 p-5 transition hover:bg-white/15">
                  <div className="mb-4 inline-flex rounded-xl bg-blue-400/20 p-3 text-orange-300">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>
                  <h3 className="font-bold">{name}</h3>
                  <p className="mt-2 text-xs leading-5 text-blue-100">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Our Services</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Solutions for everyday repairs</h2>
            <p className="mt-4 leading-7 text-slate-500">
              Get connected with technicians for your appliance and device repair needs.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ name, description, Icon }) => (
              <div key={name} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
                <div className="inline-flex rounded-xl bg-blue-50 p-4 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                  <Icon size={30} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-slate-50 px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Why Choose Us</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">A simpler way to get things fixed</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {benefits.map(({ title, description, Icon }) => (
              <div key={title} className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon size={32} />
                </div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-700 px-5 py-16 text-center text-white">
        <h2 className="text-3xl font-black">Need a repair? Start with FixMate.</h2>
        <p className="mx-auto mt-4 max-w-xl text-blue-100">Create your account and take the first step toward an easier repair experience.</p>
        <Link href="/register" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold hover:bg-orange-600">
          Create Your Account <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="bg-slate-950 px-5 py-8 text-center text-sm text-slate-400">
        Copyright 2026 FixMate. All rights reserved.
      </footer>
    </main>
  );
}
