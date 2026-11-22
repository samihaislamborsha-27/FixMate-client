"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Wrench, Mail, LockKeyhole, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: form.email.trim(),
        password: form.password,
      });

      if (error) {
        toast.error(error.message || "Login failed.");
        return;
      }

      if (data) {
        toast.success("Welcome back to FixMate!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="relative hidden w-5/12 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-12 text-white lg:flex">
        <Link href="/" className="text-3xl font-black">FixMate<span className="text-orange-400">.</span></Link>
        <div className="relative z-10">
          <div className="mb-6 inline-flex rounded-2xl bg-orange-500 p-4"><Wrench size={34} /></div>
          <h1 className="max-w-md text-5xl font-black leading-tight">Welcome back. Let's get things fixed.</h1>
          <p className="mt-6 max-w-md leading-8 text-blue-100">Sign in to manage your account, find services and keep track of your repair requests.</p>
          <div className="mt-9 flex items-center gap-3 text-sm text-blue-100"><ShieldCheck size={20} className="text-green-400" /> Your FixMate account, all in one place.</div>
        </div>
        <p className="text-xs text-blue-200">FixMate | Smart Repair Service Platform</p>
      </section>

      <section className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-10">
          <Link href="/" className="text-sm font-semibold text-blue-700 hover:text-blue-900">← Back to home</Link>

          <div className="mt-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Wrench size={30} /></div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to continue to your FixMate account.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input type="password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Signing in..." : "Sign In"} <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">Don't have an account? <Link href="/register" className="font-bold text-blue-700 hover:underline">Create an account</Link></p>
        </div>
      </section>
    </main>
  );
}
