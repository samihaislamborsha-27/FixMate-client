"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && (!session || session.user?.role !== "admin")) {
      router.replace(session ? "/dashboard" : "/login");
    }
  }, [session, isPending, router]);

  if (isPending || !session || session.user?.role !== "admin") {
    return <main className="p-10 text-center">Checking administrator access...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-2xl font-black text-blue-700">FixMate.</Link>
        <section className="mt-8 rounded-2xl bg-white p-8 shadow">
          <p className="text-sm font-bold uppercase text-blue-700">Administrator</p>
          <h1 className="mt-2 text-3xl font-black">Welcome, {session.user.name}</h1>
          <p className="mt-3 text-slate-600">Manage FixMate services and platform activities.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/services" className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">View Services</Link>
            <Link href="/dashboard" className="rounded-xl border px-5 py-3 font-bold">My Account</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
