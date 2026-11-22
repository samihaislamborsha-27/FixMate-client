"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Wrench, UserRound, Mail, Phone, MapPin, LogOut, ArrowLeft } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  async function handleLogout() {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      toast.success("Logged out successfully.");
      router.replace("/login");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  }

  if (isPending || !session) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">Loading your account...</main>;
  }

  const user = session.user;

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-2xl font-black text-blue-700">FixMate<span className="text-orange-500">.</span></Link>
        <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50">
          <LogOut size={17} /> Logout
        </button>
      </header>

      <section className="mx-auto mt-10 max-w-5xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200/70">
          <div className="bg-linear-to-r from-blue-950 to-blue-700 px-7 py-9 text-white sm:px-10">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15"><Wrench size={31} /></div>
              <div>
                <p className="text-sm font-medium text-blue-200">Your account</p>
                <h1 className="mt-1 text-3xl font-black">Welcome, {user.name}!</h1>
              </div>
            </div>
            <p className="mt-5 text-sm text-blue-100">Manage your FixMate profile and service activities here.</p>
          </div>

          <div className="p-7 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Account information</h2>
                <p className="mt-1 text-sm text-slate-500">Your registered details.</p>
              </div>
              <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-blue-700">{user.role || "customer"}</span>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Full name", value: user.name, Icon: UserRound },
                { label: "Email address", value: user.email, Icon: Mail },
                { label: "Phone number", value: user.phone || "Not provided", Icon: Phone },
                { label: "Area", value: user.area || "Not provided", Icon: MapPin },
              ].map(({ label, value, Icon }) => (
                <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="rounded-xl bg-white p-3 text-blue-700 shadow-sm"><Icon size={21} /></div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="mt-1 wrap-break-words text-sm font-bold text-slate-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"><ArrowLeft size={17} /> Back to homepage</Link>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"><LogOut size={17} /> Sign out</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
