"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Wrench, UserRound, Mail, LockKeyhole, Phone, MapPin, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    area: "",
    role: "customer",
  });

  function handleChange(e) {
    setForm((previous) => ({ ...previous, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        area: form.area.trim(),
        role: form.role,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      if (data) {
        toast.success("Your FixMate account has been created!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="relative hidden w-5/12 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-12 text-white lg:flex">
        <Link href="/" className="text-3xl font-black">FixMate<span className="text-orange-400">.</span></Link>
        <div className="relative z-10">
          <div className="mb-6 inline-flex rounded-2xl bg-orange-500 p-4"><Wrench size={34} /></div>
          <h1 className="max-w-md text-5xl font-black leading-tight">Your repair journey starts here.</h1>
          <p className="mt-6 max-w-md leading-8 text-blue-100">Join FixMate to request repair services or offer your professional skills as a technician.</p>
          <div className="mt-9 space-y-4 text-sm text-blue-100">
            <p className="flex items-center gap-3"><ShieldCheck size={19} className="text-green-400" /> A convenient service platform</p>
            <p className="flex items-center gap-3"><Wrench size={19} className="text-green-400" /> Customers and technicians together</p>
          </div>
        </div>
        <p className="text-xs text-blue-200">FixMate | Smart Repair Service Platform</p>
      </section>

      <section className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9">
          <Link href="/" className="text-sm font-semibold text-blue-700 hover:text-blue-900">← Back to home</Link>

          <div className="mt-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Wrench size={27} /></div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Create your account</h2>
            <p className="mt-2 text-sm text-slate-500">Join the FixMate community today.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
              <div className="relative"><UserRound className="absolute left-3.5 top-3.5 text-slate-400" size={18} /><input name="name" value={form.name} onChange={handleChange} required autoComplete="name" placeholder="Enter your full name" className={inputClass} /></div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <div className="relative"><Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} /><input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" placeholder="you@example.com" className={inputClass} /></div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative"><LockKeyhole className="absolute left-3.5 top-3.5 text-slate-400" size={18} /><input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" className={inputClass} /></div>
              <p className="mt-1.5 text-xs text-slate-400">Use at least 8 characters.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Phone number</label>
                <div className="relative"><Phone className="absolute left-3.5 top-3.5 text-slate-400" size={18} /><input type="tel" name="phone" value={form.phone} onChange={handleChange} required autoComplete="tel" placeholder="Phone number" className={inputClass} /></div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Your area</label>
                <div className="relative"><MapPin className="absolute left-3.5 top-3.5 text-slate-400" size={18} /><input name="area" value={form.area} onChange={handleChange} required autoComplete="address-level2" placeholder="City or area" className={inputClass} /></div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">I want to register as</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
                <option value="customer">Customer - I need repair services</option>
                <option value="technician">Technician - I provide repair services</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Creating account..." : "Create Account"} <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="font-bold text-blue-700 hover:underline">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}
