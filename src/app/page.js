import Link from "next/link";
import {
  Wrench,
  Refrigerator,
  WashingMachine,
  Monitor,
  ArrowRight,
  ShieldCheck,
  Clock,
  Users,
} from "lucide-react";

const services = [
  { name: "AC Repair", icon: "❄️", description: "Cooling and maintenance services" },
  { name: "Refrigerator Repair", icon: "🧊", description: "Fridge diagnosis and repair" },
  { name: "Washing Machine", icon: "🫧", description: "Laundry appliance repair" },
  { name: "Computer Repair", icon: "💻", description: "Desktop and laptop support" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="flex items-center justify-between border-b px-6 py-5 md:px-16">
        <Link href="/" className="text-2xl font-extrabold text-blue-700">
          FixMate<span className="text-orange-500">.</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <a href="#services" className="hover:text-blue-600">Services</a>
          <a href="#about" className="hover:text-blue-600">About</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="font-semibold hover:text-blue-600">
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="bg-linear-to-br from-blue-950 via-blue-900 to-slate-900 px-6 py-24 text-white md:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-5 font-semibold uppercase tracking-widest text-orange-400">
              Your trusted repair partner
            </p>

            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Home repairs made
              <span className="text-orange-400"> simple.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Find trusted technicians for your home appliances and devices.
              Book repair services easily with FixMate.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
              >
                Book a Service <ArrowRight size={18} />
              </Link>

              <Link
                href="/login"
                className="rounded-lg border border-white/40 px-6 py-3 font-semibold hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-xl bg-orange-500 p-4">
                <Wrench size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">FixMate Services</h2>
                <p className="text-blue-100">Reliable help, right when you need it.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {services.map((service) => (
                <div key={service.name} className="rounded-xl bg-white/10 p-4">
                  <div className="text-3xl">{service.icon}</div>
                  <h3 className="mt-3 font-bold">{service.name}</h3>
                  <p className="mt-1 text-sm text-blue-100">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="px-6 py-20 md:px-16">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-semibold uppercase tracking-widest text-blue-600">
            What we offer
          </p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
            Repair services you can trust
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Get connected with technicians for your everyday repair needs.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div key={service.name} className="rounded-2xl border p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="text-4xl">{service.icon}</div>
                <h3 className="mt-5 text-lg font-bold">{service.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-slate-50 px-6 py-20 md:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Trusted Service", text: "Connect with service professionals." },
            { icon: Clock, title: "Easy Booking", text: "Request repairs through a simple process." },
            { icon: Users, title: "Customer Focused", text: "Manage your service requests in one place." },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <item.icon className="mx-auto text-blue-700" size={38} />
              <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-slate-950 px-6 py-8 text-center text-sm text-slate-300">
        © {new Date().getFullYear()} FixMate. All rights reserved.
      </footer>
    </main>
  );
}